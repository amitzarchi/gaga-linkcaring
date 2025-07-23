import { getMilestones } from "@/db/queries/milestones-queries";
import { getValidators } from "@/db/queries/validators-queries";
import { getMilestoneVideos } from "@/db/queries/milestone-videos-queries";
import { MilestonesProvider } from "../context/milestones-context";
import { ValidatorsProvider } from "../context/validators-context";
import { MilestoneVideosProvider } from "../context/milestone-videos-context";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [milestones, validators, milestoneVideos] = await Promise.all([
    getMilestones(),
    getValidators(),
    getMilestoneVideos(),
  ]);

  return (
    <MilestonesProvider milestonesData={milestones}>
      <ValidatorsProvider validatorsData={validators}>
        <MilestoneVideosProvider milestoneVideosData={milestoneVideos}>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <div className="flex flex-1 flex-col w-full">
                <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 max-w-7xl mx-auto">
                  {children}
                </div>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </MilestoneVideosProvider>
      </ValidatorsProvider>
    </MilestonesProvider>
  );
}
