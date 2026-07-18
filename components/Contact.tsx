"use client";

import { useState, FormEvent, FocusEvent } from "react";
import { Send } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useRateLimit } from "@/hooks/useRateLimit";

const FORMSPREE_ENDPOINT = "YOUR_FORMSPREE_ENDPOINT";

const socials = [
  {
    name: "GitHub",
    url: "https://github.com/gabrielSabang",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/gabriel-sabang-2a9909328/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/_gab.ggs/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/gabriel.sabang.79",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

function validateField(name: string, value: string): string | undefined {
  if (!value.trim()) {
    return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
  }
  if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Please enter a valid email address";
  }
  return undefined;
}

export default function Contact() {
  const { ref, isVisible } = useScrollAnimation();
  const { isLimited, remaining, checkRateLimit, recordSubmission } =
    useRateLimit();
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  function handleBlur(e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    const newErrors: FormErrors = {
      name: validateField("name", name),
      email: validateField("email", email),
      message: validateField("message", message),
    };
    setErrors(newErrors);

    if (newErrors.name || newErrors.email || newErrors.message) {
      return;
    }

    if (checkRateLimit()) {
      setStatus("error");
      setErrorMessage("Too many messages. Please wait a moment before trying again.");
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("success");
        recordSubmission();
        form.reset();
        setErrors({});
      } else {
        setStatus("error");
        setErrorMessage("Something went wrong. Please try again later.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please check your connection.");
    }
  }

  const inputClasses =
    "w-full px-4 py-3 bg-surface border rounded-lg text-foreground text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors min-h-[44px]";

  return (
    <section id="contact" className="py-24 px-6 bg-primary/30">
      <div
        ref={ref}
        className={`max-w-4xl mx-auto transition-all duration-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
          Get in Touch
        </h2>
        <p className="text-foreground/60 text-center mb-12">
          Have a question or want to work together? Send me a message.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground/70 mb-1.5"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                onBlur={handleBlur}
                className={`${inputClasses} ${errors.name ? "border-destructive" : "border-border"}`}
                placeholder="Your name"
                aria-describedby={errors.name ? "name-error" : undefined}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-xs text-destructive" role="alert">
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground/70 mb-1.5"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                onBlur={handleBlur}
                className={`${inputClasses} ${errors.email ? "border-destructive" : "border-border"}`}
                placeholder="your@email.com"
                aria-describedby={errors.email ? "email-error" : undefined}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-xs text-destructive" role="alert">
                  {errors.email}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-foreground/70 mb-1.5"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                onBlur={handleBlur}
                className={`${inputClasses} ${errors.message ? "border-destructive" : "border-border"} resize-none`}
                placeholder="Your message..."
                aria-describedby={errors.message ? "message-error" : undefined}
                aria-invalid={!!errors.message}
              />
              {errors.message && (
                <p id="message-error" className="mt-1 text-xs text-destructive" role="alert">
                  {errors.message}
                </p>
              )}
            </div>

            <div aria-live="polite" aria-atomic="true">
              {isLimited && (
                <p className="text-sm text-destructive">
                  Rate limit reached. You have {remaining} message(s) remaining.
                  Try again in a few seconds.
                </p>
              )}

              {status === "success" && (
                <p className="text-sm text-accent">
                  Message sent successfully! I&apos;ll get back to you soon.
                </p>
              )}

              {status === "error" && errorMessage && (
                <p className="text-sm text-destructive">{errorMessage}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={status === "sending" || isLimited}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-background font-medium rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-h-[44px]"
            >
              <Send size={16} />
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>
          </form>

          <div className="flex flex-col justify-center">
            <p className="text-foreground/60 mb-6">
              Or reach out directly through my socials:
            </p>
            <div className="flex flex-wrap gap-4">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 bg-surface border border-border rounded-lg text-foreground/70 hover:text-accent hover:border-accent/50 transition-colors cursor-pointer min-h-[44px]"
                  aria-label={social.name}
                >
                  {social.icon}
                  <span className="text-sm">{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
