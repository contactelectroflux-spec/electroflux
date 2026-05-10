"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";
import Image from "next/image";

const initialState = { error: "" };

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <Image
            src="/images/Atlasibo logo.png"
            alt="atlasibo"
            width={120}
            height={36}
            className="brand-logo"
            style={{ height: "48px", width: "auto" }}
          />
        </div>
        <h1 className="admin-login-title">Panneau d'administration</h1>
        <p className="admin-login-sub">Accès réservé</p>

        <form action={formAction} className="admin-login-form">
          <div className="admin-field">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              required
            />
          </div>
          {state?.error && (
            <p className="admin-login-error">{state.error}</p>
          )}
          <button type="submit" className="admin-login-btn" disabled={pending}>
            {pending ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
