"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSubmitGuard } from "@/hooks/useSubmitGuard";
import Spinner from "@/components/ui/Spinner";
import { buttonStyles } from "@/components/ui/buttonStyles";
import FormField, { inputStyles } from "@/components/ui/FormField";

export default function LoginForm() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  // The login page redirects as soon as the session exists, so no navigation here.
  const [submitLogin, isSubmitting] = useSubmitGuard(login);

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};
    if (!username.trim()) nextErrors.username = "Username is required.";
    if (!password) nextErrors.password = "Password is required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitError("");
    try {
      await submitLogin(username.trim(), password);
    } catch (error) {
      setSubmitError(
        error.status === 400 || error.status === 401
          ? "Wrong username or password. Please try again."
          : error.message
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {submitError && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </p>
      )}

      <FormField id="username" label="Username" error={errors.username}>
        <input
          id="username"
          name="username"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          aria-invalid={Boolean(errors.username)}
          aria-describedby={errors.username ? "username-error" : undefined}
          className={inputStyles(errors.username)}
        />
      </FormField>

      <FormField id="password" label="Password" error={errors.password}>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "password-error" : undefined}
          className={inputStyles(errors.password)}
        />
      </FormField>

      <button type="submit" disabled={isSubmitting} className={buttonStyles("primary", "w-full")}>
        {isSubmitting && <Spinner className="h-4 w-4" />}
        {isSubmitting ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}
