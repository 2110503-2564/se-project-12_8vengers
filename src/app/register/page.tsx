"use client";
import userRegister from "@/libs/userRegister";
import { useState } from "react";

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
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form
        onSubmit={handleRegister}
        className="w-1/3 bg-white p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 mb-3 border border-gray-300 rounded"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Tel"
          className="w-full p-2 mb-3 border border-gray-300 rounded"
          onChange={(e) => setForm({ ...form, tel: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border border-gray-300 rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border border-gray-300 rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <div className="flex items-center mb-3">
          <input
            type="checkbox"
            id="role"
            className="mr-2 w-4 h-4"
            onChange={(e) =>
              setForm({ ...form, role: e.target.checked ? "admin" : "user" })
            }
          />
          <label className="text-gray-700" htmlFor="role">
            Admin
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-green-600 hover:shadow-lg"
        >
          Sign Up
        </button>
      </form>
      <p className="text-red-600 mt-3 ">{message}</p>
    </div>
  );
}
