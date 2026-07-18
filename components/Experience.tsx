"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const experiences = [
  {
    role: "Full-Stack Developer",
    company: "Company Name",
    period: "2023 - Present",
    description:
      "Leading development of scalable web applications. Built and maintained multiple microservices and improved system performance by 40%.",
  },
  {
    role: "Frontend Developer",
    company: "Another Company",
    period: "2021 - 2023",
    description:
      "Developed responsive user interfaces for enterprise clients. Collaborated with design teams to implement pixel-perfect components.",
  },
  {
    role: "Junior Developer",
    company: "First Company",
    period: "2019 - 2021",
    description:
      "Started my professional journey building internal tools and learning best practices in software development.",
  },
];

export default function Experience() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="experience" className="py-24 px-6">
      <div
        ref={ref}
        className={`max-w-3xl mx-auto transition-all duration-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
          Experience
        </h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-10">
            {experiences.map((exp) => (
              <div key={exp.role} className="relative pl-12">
                <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-accent border-2 border-background" />
                <p className="text-xs text-accent font-medium mb-1">
                  {exp.period}
                </p>
                <h3 className="text-lg font-semibold text-foreground">
                  {exp.role}
                </h3>
                <p className="text-sm text-foreground/50 mb-2">{exp.company}</p>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
