"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import getUserProfile from "@/libs/getUserProfile";
import { User } from "../../../interface";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (session?.user?.token) {
          const response = await getUserProfile(session.user.token);
          setProfile(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [session]);

  if (!session || !session.user.token) {
    return (
      <main className="w-full h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/img/background.avif')" }}>
        <div className="bg-red-600 text-white p-6 rounded-lg shadow-lg text-center text-xl font-bold">
          Please sign in to view your profile.
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-gray-600 text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/img/background.avif')" }}>
      <div className="w-[40%] bg-white p-6 rounded-lg shadow-lg border border-gray-300 flex flex-col items-center space-y-6">
        <div className="text-2xl font-bold text-center">
          {profile?.role === "admin" ? "Admin Profile" : "User Profile"}
        </div>
        <table className="table-auto w-full text-left border-spacing-2 bg-gray-200 rounded-xl p-4">
          <tbody>
            <tr>
              <td className="font-semibold text-gray-800">Name</td>
              <td>{profile?.name}</td>
            </tr>
            <tr>
              <td className="font-semibold text-gray-800">Email</td>
              <td>{profile?.email}</td>
            </tr>
            <tr>
              <td className="font-semibold text-gray-800">Tel.</td>
              <td>{profile?.tel}</td>
            </tr>
            <tr>
              <td className="font-semibold text-gray-800">Current Balance.</td>
              <td>{profile?.balance}</td>
            </tr>
            <tr>
              <td className="font-semibold text-gray-800">Member since</td>
              <td>{profile ? new Date(profile.createdAt).toLocaleString() : "N/A"}</td>
            </tr>
          </tbody>
        </table>

        {/* ✅ ปุ่มไปหน้า /payment */}
    <div className="flex flex-row gap-x-4 mt-4">
        <Link href="/payment">
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow">
            Top-up
            </button>
        </Link>
        <Link href="/history">
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow">
            History
            </button>
        </Link>
    </div>

      </div>
    </main>
  );
}
