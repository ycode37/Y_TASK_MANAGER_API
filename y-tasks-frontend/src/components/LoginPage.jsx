import { useState } from "react";
import AuthLayout from "./AuthLayout";
import Field from "./Field";
import Button from "./Button";
import { AuthAPI, getErrorMessage } from "../lib/api";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "../store/useToastStore";

export default function LoginPage({ onSwitchToRegister, initialEmail = "" }) {
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ email: initialEmail, password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await AuthAPI.login(form);
      const { token, user } = res.data.data;
      login(token, user);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}.`);
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't sign you in. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to see your list."
      footer={
        <span>
          New here?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-semibold text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
          >
            Create an account
          </button>
        </span>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <Field
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={update("email")}
        />
        <Field
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={form.password}
          onChange={update("password")}
        />

        {error && (
          <p className="-mt-2 mb-5 text-[13px] text-rust" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthLayout>
  );
}
