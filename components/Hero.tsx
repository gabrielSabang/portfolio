"use client";

import { ArrowDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-3xl">
        <p className="text-accent text-sm font-medium tracking-wider uppercase mb-4 animate-fade-in-up">
          Hello, I&apos;m
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in-up animate-delay-100">
          Gabriel Sabang
        </h1>
        <p className="text-lg sm:text-xl text-foreground/60 mb-8 animate-fade-in-up animate-delay-200">
          Full-Stack Developer building modern web experiences
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-300">
          <a
            href="#projects"
            className="inline-flex items-center justify-center px-6 py-3 bg-accent text-background font-medium rounded-lg hover:bg-accent-hover transition-colors cursor-pointer"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-6 py-3 border border-border text-foreground font-medium rounded-lg hover:bg-surface-hover transition-colors cursor-pointer"
          >
            Get in Touch
          </a>
        </div>
      </div>
      <a
        href="#about"
        className="absolute bottom-8 text-foreground/40 hover:text-accent transition-colors cursor-pointer"
        aria-label="Scroll to about section"
      >
        <ArrowDown size={24} className="animate-bounce" />
      </a>
    </section>
  );
}
