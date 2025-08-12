"use client";

import { useSession } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const { data, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-lg">Loading...</span>
      </div>
    );
  }

  if (!data?.user) {
    redirect("/");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-16 px-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-lg text-gray-700">
        Welcome, <span className="font-semibold">{data.user.name || data.user.email}</span>!
      </p>
      <div className="mt-8">
        <p className="text-gray-500">Select a section from the sidebar to get started.</p>
      </div>
    </div>
  );
}
