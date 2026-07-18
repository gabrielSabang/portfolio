"use client";

import { useState, useCallback } from "react";

const RATE_LIMIT_KEY = "portfolio_rate_limit";
const MAX_SUBMISSIONS = 3;
const WINDOW_MS = 20 * 1000;

interface RateLimitEntry {
  timestamps: number[];
}

function getStoredTimestamps(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    if (!raw) return [];
    const data: RateLimitEntry = JSON.parse(raw);
    const now = Date.now();
    return data.timestamps.filter((t) => now - t < WINDOW_MS);
  } catch {
    return [];
  }
}

function storeTimestamps(timestamps: number[]) {
  if (typeof window === "undefined") return;
  try {
    const data: RateLimitEntry = { timestamps };
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
  } catch {
    // localStorage unavailable, silently fail
  }
}

export function useRateLimit() {
  const [isLimited, setIsLimited] = useState(false);
  const [remaining, setRemaining] = useState(MAX_SUBMISSIONS);

  const checkRateLimit = useCallback(() => {
    const timestamps = getStoredTimestamps();
    const count = timestamps.length;
    setRemaining(Math.max(0, MAX_SUBMISSIONS - count));
    setIsLimited(count >= MAX_SUBMISSIONS);
    return count >= MAX_SUBMISSIONS;
  }, []);

  const recordSubmission = useCallback(() => {
    const timestamps = getStoredTimestamps();
    timestamps.push(Date.now());
    storeTimestamps(timestamps);
    const count = timestamps.length;
    setRemaining(Math.max(0, MAX_SUBMISSIONS - count));
    setIsLimited(count >= MAX_SUBMISSIONS);
  }, []);

  return { isLimited, remaining, checkRateLimit, recordSubmission };
}
