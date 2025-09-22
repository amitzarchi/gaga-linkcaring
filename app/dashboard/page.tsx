import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ResponseStatsDashboard from "./components/response-stats-dashboard";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/");
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="space-y-0 w-full">
        <h1 className="text-lg font-semibold w-full">Dashboard</h1>
        <p className="text-sm text-muted-foreground font-medium w-full">View your stats.</p>
      </div>
      <ResponseStatsDashboard />
    </div>
  );
}
