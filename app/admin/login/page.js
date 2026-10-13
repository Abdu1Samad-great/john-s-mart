
import { redirect } from "next/navigation";
import { isAdmin } from "../../../lib/auth";
import { loginAction } from "../actions";

export const metadata = { title: "Admin Login | John's Mart" };

export default async function AdminLogin({ searchParams }) {
  if (await isAdmin()) {
    redirect("/admin/dashboard");
  }

  const params = await searchParams;
  const error = params?.error;

  return (
    <main className="admin-page">
      <a className="back-link" href="/">
        ← Back to store
      </a>

      <section className="login-card">
        <a className="brand login-brand" href="/">
          <span>
            JOHN'S <b>MART</b>
            <small>STORE ADMIN</small>
          </span>
        </a>

        <span className="eyebrow">RESTRICTED ACCESS</span>

        <h1>Welcome back.</h1>
        <p>Sign in to manage your products and stock.</p>

        {error === "invalid" && (
          <div className="form-alert">
            Incorrect password. Please try again.
          </div>
        )}

        {error === "config" && (
          <div className="form-alert">
            Admin password is not configured in the environment variables.
          </div>
        )}

        <form action={loginAction} className="login-form">
          <label>
            Admin password
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              placeholder="Enter your password"
            />
          </label>

          <button className="button button-light" type="submit">
            Sign in <span>→</span>
          </button>
        </form>

        <small className="security-note">
          Sign in with your admin password to manage the store.
        </small>
      </section>
    </main>
  );
} 