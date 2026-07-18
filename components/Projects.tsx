"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import ProjectCard from "./ProjectCard";

const projects = [
  {
    title: "Project One",
    description:
      "A full-stack web application built with Next.js and PostgreSQL. Features real-time updates and a modern dashboard interface.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind"],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "Project Two",
    description:
      "A mobile-first React Native app for task management with offline support and push notifications.",
    tags: ["React Native", "Firebase", "Expo"],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "Project Three",
    description:
      "An open-source developer tool for API testing and documentation generation. CLI and web interface.",
    tags: ["Node.js", "React", "MongoDB"],
    githubUrl: "#",
  },
  {
    title: "Project Four",
    description:
      "A real-time collaboration platform with WebSocket integration, built for distributed teams.",
    tags: ["Next.js", "Socket.io", "Redis", "Docker"],
    liveUrl: "#",
    githubUrl: "#",
  },
];

export default function Projects() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="projects" className="py-24 px-6 bg-primary/30">
      <div
        ref={ref}
        className={`max-w-6xl mx-auto transition-all duration-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
          Projects
        </h2>
        <p className="text-foreground/60 text-center mb-12 max-w-2xl mx-auto">
          A selection of projects I&apos;ve worked on. Each one taught me
          something new.
        </p>
        <div className="grid sm:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}
