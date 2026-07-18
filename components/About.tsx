"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import {
  Code2,
  Database,
  Server,
  Layers,
} from "lucide-react";

const skillCategories = [
  {
    title: "Programming",
    skills: ["Javascript", "C#", "HTML", "CSS", "Flutter", "PHP", "Typescript"],
    icon: Code2,
  },
  {
    title: "Databases",
    skills: ["MongoDB", "MySQL", "SQLite", "Supabase", "Firebase", "Prisma", "Neon", "Redis"],
    icon: Database,
  },
  {
    title: "Frameworks",
    skills: ["ASP.NET", "Express.js", "React", "Tailwind"],
    icon: Layers,
  },
  {
    title: "Backend",
    skills: ["Node.js", "ASP.NET Core"],
    icon: Server,
  },
];

export default function About() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="about" className="py-24 px-6">
      <div
        ref={ref}
        className={`max-w-4xl mx-auto transition-all duration-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
          About Me
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-4 text-foreground/70 leading-relaxed">
            <p>
              I&apos;m a full-stack developer passionate about building elegant
              and performant web applications. I enjoy working across the entire
              stack, from crafting intuitive user interfaces to designing robust
              backend systems.
            </p>
            <p>
              When I&apos;m not coding, you can find me exploring new
              technologies, contributing to open-source projects, or diving into
              the latest development trends.
            </p>
          </div>
          <div className="space-y-6">
            {skillCategories.map((category) => (
              <div key={category.title}>
                <div className="flex items-center gap-2 mb-3">
                  <category.icon size={16} className="text-accent" />
                  <h3 className="text-sm font-semibold text-accent uppercase tracking-wider">
                    {category.title}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-3 py-1.5 bg-surface rounded-md text-foreground/70 border border-border hover:border-accent/50 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
