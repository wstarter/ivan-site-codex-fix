import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { handleLeadSubmit } from "@/lib/lead";

export function useInquiryForm<T extends Record<string, unknown>>(
  formType: string,
  initial: T,
  validate: (state: T) => Record<string, string>,
) {
  const [state, setState] = useState<T>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  function set<K extends keyof T>(key: K, value: T[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate(state);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      handleLeadSubmit(formType, state, navigate);
    } else {
      // scroll to first error
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return { state, set, errors, submitted, onSubmit };
}

export function required(v: unknown) {
  if (typeof v === "string") return v.trim().length > 0;
  if (typeof v === "number") return !isNaN(v);
  if (typeof v === "boolean") return v;
  return v != null;
}

export function emailValid(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}