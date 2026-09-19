import { useState } from "react";
import AuthLayout from "./AuthLayout";
import Field from "./Field";
import Button from "./Button";
import { AuthAPI, getErrorMessage } from "../lib/api";
import { toast } from "../store/useToastStore";

export default function RegisterPage({ onSwitchToLogin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password needs at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await AuthAPI.register(form);
      toast.success("Account created. Sign in to continue.");
      onSwitchToLogin(form.email);
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't create your account. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="A quiet place to keep your list."
      footer={
        <span>
          Already have one?{" "}
          <button
            type="button"
            onClick={() => onSwitchToLogin()}
            className="font-semibold text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
          >
            Sign in
          </button>
        </span>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <Field
          label="Name"
          autoComplete="name"
          required
          value={form.name}
          onChange={update("name")}
        />
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
          autoComplete="new-password"
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
          {submitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  );
}
