"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      setLoading(false);
    } else {
      router.push("/login");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f5f0]">
      <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-md border border-[#e5ddd0]">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black">
            <span className="text-black">Tech</span>
            <span className="text-orange-500">Pulse</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm">Create your account</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Teja"
              className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teja@example.com"
              className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-orange-500 transition-colors duration-200 mt-2"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </div>

        {/* Login link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-orange-500 font-medium hover:underline"
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
