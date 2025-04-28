"use client";
import userRegister from "@/libs/userRegister";
import { useState } from "react";
import Link from "next/link";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    tel: "",
    password: "",
    role: "user",
  });
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await userRegister(
      form.name,
      form.email,
      form.tel,
      form.password,
      form.role
    );

    const data = await res.json();
    if (res.ok) {
      setMessage("Registration successful! You can now log in.");
    } else {
      setMessage("This user already Exist! Please log in.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 p-4">
  <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">
    <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-2">Register</h1>
    <p className="text-gray-500 text-center text-sm">Create your account to get started</p>

    {message && (
      <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">
        {message}
      </div>
    )}

    <form onSubmit={handleRegister} className="space-y-3">
      <div>
        <label className="text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Tel</label>
        <input
          type="text"
          placeholder="Enter your phone number"
          value={form.tel}
          onChange={(e) => setForm({ ...form, tel: e.target.value })}
          required
          className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="role"
          className="mr-2 w-4 h-4"
          onChange={(e) =>
            setForm({ ...form, role: e.target.checked ? "admin" : "user" })
          }
        />
        <label className="text-sm text-gray-700" htmlFor="role">
          Admin
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-semibold transition-all"
      >
        Sign Up
      </button>
    </form>

    <p className="text-center text-sm text-gray-600 mt-6">
      Already have an account?{" "}
      <Link href="/api/auth/signin" className="text-blue-600 font-medium hover:underline">
        Sign In
      </Link>
    </p>
  </div>
</div>

  );
}
