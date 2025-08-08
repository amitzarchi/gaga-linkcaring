import { getMilestones } from "@/db/queries/milestones-queries";
import { getValidators } from "@/db/queries/validators-queries";
import { getMilestoneVideos } from "@/db/queries/milestone-videos-queries";
import { getTestResults } from "@/db/queries/test-results-queries";
import { MilestonesProvider } from "../context/milestones-context";
import { PoliciesProvider } from "../context/policies-context";
import { ValidatorsProvider } from "../context/validators-context";
import { MilestoneVideosProvider } from "../context/milestone-videos-context";
import { TestResultsProvider } from "../context/test-results-context";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { AccessRequestsProvider } from "../context/access-requests-context";
import { getAccessRequests } from "@/db/queries/access-requests-queries";
import { ApiKeysProvider } from "../context/api-keys-context";
import { getApiKeys } from "@/db/queries/api-keys-queries";
import { getPolicies } from "@/db/queries/policies-queries";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }
  const [
    milestones,
    validators,
    milestoneVideos,
    testResults,
    accessRequests,
    apiKeys,
    policies,
  ] = await Promise.all([
    getMilestones(),
    getValidators(),
    getMilestoneVideos(),
    getTestResults(),
    getAccessRequests(),
    getApiKeys(),
    getPolicies(),
  ]);

  return (
    <ApiKeysProvider apiKeysData={apiKeys}>
      <AccessRequestsProvider accessRequestsData={accessRequests}>
        <MilestonesProvider milestonesData={milestones}>
          <PoliciesProvider policiesData={policies}>
          <ValidatorsProvider validatorsData={validators}>
            <MilestoneVideosProvider milestoneVideosData={milestoneVideos}>
              <TestResultsProvider testResultsData={testResults}>
                <SidebarProvider>
                  <AppSidebar />
                  <SidebarInset>
                    <div className="flex flex-1 flex-col w-full">
                      <header className="flex h-16 md:h-2 shrink-0 items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1 md:hidden" />
                      </header>
                      <div className="flex flex-1 justify-center w-full">
                        <div className="flex flex-1 flex-col gap-4 p-4 max-w-4xl md:px-6">
                          {children}
                        </div>
                      </div>
                    </div>
                  </SidebarInset>
                </SidebarProvider>
              </TestResultsProvider>
            </MilestoneVideosProvider>
          </ValidatorsProvider>
          </PoliciesProvider>
        </MilestonesProvider>
      </AccessRequestsProvider>
    </ApiKeysProvider>
  );
}
