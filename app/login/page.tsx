/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
// @ts-nocheck
import React, { useState } from "react";
import gqlClient from "@/service/gql";
import { gql } from "graphql-tag";
import Link from "next/link";
export default function SignInPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const LOGIN_USER = gql`
   query Query($userCred: String!, $password: String!) {
  loginUser(userCred: $userCred, password: $password)
}
  `;
  //@ts-ignore
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  //@ts-ignore
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const data = await gqlClient.request(LOGIN_USER, {
        email: form.email,
        password: form.password,
      });
      //@ts-ignore
      if (data?.signInUser) {
        setSuccess(true);
        window.location.href = "/";
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Error signing in");
      console.error(err);
    }
    setLoading(false);
  };
  return (
    <div className="min-h-screen p-2 flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900  p-8 rounded shadow-md w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center">Login In</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && (
          <p className="text-green-500 text-center">Signed in successfully!</p>
        )}
        <div>
          Do not have an account ?{" "}
          <Link className="font-medium text-blue-400" href="/sign-up">
            Sign-up
          </Link>
        </div>
      </form>
    </div>
  );
}
