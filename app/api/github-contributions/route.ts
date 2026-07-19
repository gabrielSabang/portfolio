import { NextResponse } from "next/server";

const GITHUB_GRAPHQL = "https://api.github.com/graphql";

const CONTRIBUTION_QUERY = `
  query ($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username")?.trim();

  if (!username) {
    return NextResponse.json(
      { error: "Missing username parameter" },
      { status: 400 },
    );
  }

  if (!/^[a-zA-Z0-9-]{1,39}$/.test(username)) {
    return NextResponse.json(
      { error: "Invalid GitHub username" },
      { status: 400 },
    );
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN environment variable is not set" },
      { status: 500 },
    );
  }

  const now = new Date();
  const from = new Date(now.getFullYear(), 0, 1).toISOString();
  const to = new Date(now.getFullYear(), 11, 31, 23, 59, 59).toISOString();

  try {
    const ghRes = await fetch(GITHUB_GRAPHQL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: CONTRIBUTION_QUERY,
        variables: { username, from, to },
      }),
      next: { revalidate: 3600 },
    });

    const json = await ghRes.json();

    if (!ghRes.ok || json.errors) {
      return NextResponse.json(
        { error: json.errors?.[0]?.message ?? "GitHub API error" },
        { status: 500 },
      );
    }

    if (!json.data?.user) {
      return NextResponse.json(
        { error: `User "${username}" not found or contributions are private.` },
        { status: 404 },
      );
    }

    const calendar =
      json.data.user.contributionsCollection.contributionCalendar;
    const allDays = calendar.weeks.flatMap(
      (w: { contributionDays: { contributionCount: number }[] }) =>
        w.contributionDays,
    );
    const max = Math.max(
      ...allDays.map((d: { contributionCount: number }) => d.contributionCount),
      0,
    );

    const weeks = calendar.weeks.map(
      (w: {
        contributionDays: { date: string; contributionCount: number }[];
      }) => ({
        days: w.contributionDays.map(
          (d: { date: string; contributionCount: number }) => {
            const count = d.contributionCount;
            let level: 0 | 1 | 2 | 3 | 4 = 0;
            if (count > 0) {
              const ratio = count / (max || 1);
              if (ratio > 0.75) level = 4;
              else if (ratio > 0.5) level = 3;
              else if (ratio > 0.25) level = 2;
              else level = 1;
            }
            return { date: d.date, count, level };
          },
        ),
      }),
    );

    return NextResponse.json(
      {
        weeks,
        totalContributions: calendar.totalContributions,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch GitHub contributions" },
      { status: 500 },
    );
  }
}
