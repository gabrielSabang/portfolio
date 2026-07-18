"use client";

import { ArrowUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-foreground/40">
          &copy; {new Date().getFullYear()} Gabriel Sabang. All rights reserved.
        </p>
        <a
          href="#"
          className="inline-flex items-center gap-2 text-sm text-foreground/40 hover:text-accent transition-colors cursor-pointer"
          aria-label="Back to top"
        >
          <ArrowUp size={14} />
          Back to top
        </a>
      </div>
    </footer>
  );
}
