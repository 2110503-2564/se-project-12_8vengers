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
          console.log("USER PROFILE RESPONSE:", response);
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
      <main
        className="w-full h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/img/background.avif')" }}
      >
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
    <main
      className="w-full min-h-[90vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/img/background.avif')" }}
    >
      <div className="w-[100%] max-w-xl bg-white p-8 rounded-2xl shadow-xl border border-gray-600 flex flex-col items-center space-y-6">
        {/* หัวข้อ */}
        <div className="text-3xl font-bold text-center text-gray-800">
          {profile?.role === "admin" ? "Admin Profile" : "User Profile"}
        </div>
        <table className="table-auto w-full text-sm sm:text-base text-left bg-gray-100 rounded-xl overflow-hidden">
          <tbody>
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-800">Name</td>
              <td>{profile?.name}</td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-800">Email</td>
              <td>{profile?.email}</td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-800">Tel.</td>
              <td>{profile?.tel}</td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700">Current Balance</td>
              <td>{profile?.balance} Baht</td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-800">Member since</td>
              <td>{profile ? new Date(profile.createdAt).toLocaleString() : "N/A"}</td>
            </tr>
          </tbody>
        </table>

        {/* ปุ่ม */}
        <div className="flex flex-row gap-x-6">
          <Link href="/payment">
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition transform hover:scale-105">
              Top-up
            </button>
          </Link>

          
          <Link href="/transaction">
            <button className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow transition transform hover:scale-105">
              History
            </button>
          </Link> 
          
        </div>
      </div>

    </main>
  );
}
