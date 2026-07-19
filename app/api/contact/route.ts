import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "anonymous";
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { success, remaining } = await rateLimit(ip);

  if (!success) {
    return NextResponse.json(
      {
        error:
          "Too many messages. Please try again later.",
        remaining,
      },
      { status: 429 },
    );
  }

  const formData = await request.formData();

  const formspreeEndpoint = process.env.FORMSPREE_ENDPOINT;
  if (!formspreeEndpoint) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(formspreeEndpoint, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      return NextResponse.json({ success: true, remaining });
    }

    const body = await res.json();
    return NextResponse.json(
      { error: body.error ?? "Something went wrong. Please try again later." },
      { status: res.status },
    );
  } catch {
    return NextResponse.json(
      { error: "Network error. Please check your connection." },
      { status: 502 },
    );
  }
}
