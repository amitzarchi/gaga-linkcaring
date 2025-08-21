"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "@/lib/auth-client";
import { useAccessRequests } from "@/app/context/access-requests-context";
import {
  Play,
  Key,
  Users,
  ListChecks,
  Shield,
  FileText,
  Sparkles,
  Milestone,
  Home,
  TestTube,
  LandPlot,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut } from "@/components/animate-ui/icons/log-out";
import { LogoutIcon } from "@/components/ui/logout";


const generalItems = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/dashboard",
  },
  {
    title: "Playground",
    icon: LandPlot,
    url: "/dashboard/playground",
  },
];

const workspaceItems = [
  {
    title: "Milestones",
    icon: Milestone,
    url: "/dashboard/milestones",
  },
  {
    title: "Validators",
    icon: ListChecks,
    url: "/dashboard/validators",
  },
  {
    title: "Policies",
    icon: Shield,
    url: "/dashboard/policies",
  },
  {
    title: "System Prompt",
    icon: FileText,
    url: "/dashboard/system-prompt",
  },
  {
    title: "Test Runner",
    icon: Play,
    url: "/dashboard/test-runner",
  },
  {
    title: "Models",
    icon: Sparkles,
    url: "/dashboard/models",
  },
];

const serviceItems = [
  {
    title: "API Keys",
    icon: Key,
    url: "/dashboard/api-keys",
  },
  {
    title: "Admins & Requests",
    icon: Users,
    url: "/dashboard/admins",
  },
];

export function AppSidebar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { accessRequests } = useAccessRequests();

  // Calculate pending requests count
  const pendingRequestsCount = accessRequests.filter(
    (request) => request.status === "PENDING"
  ).length;

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="p-4">
        <div className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
          <span className="[font-family:var(--font-gaga)] font-normal text-2xl">
            gaga{" "}
          </span>
          <span className="text-2xl font-medium">X </span>
          <span className="font-inter font-bold">LinkCaring</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {generalItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.url === "/dashboard" 
                        ? pathname === "/dashboard"
                        : pathname === item.url || pathname.startsWith(`${item.url}/`)
                    }
                    className="hover:bg-gray-200/30 hover:ring-1 hover:ring-gray-300/50 data-[active=true]:bg-gray-200/50 data-[active=true]:ring-1 data-[active=true]:ring-gray-300/60"
                  >
                    <Link
                      href={item.url}
                      className="flex items-center gap-4 py-5"
                    >
                      <item.icon className="!size-5 transition-transform duration-200 ease-out group-hover/menu-item:rotate-[8deg]" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>WORKSPACE</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {workspaceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url || pathname.startsWith(`${item.url}/`)}
                    className="hover:bg-gray-200/30 hover:ring-1 hover:ring-gray-300/50 data-[active=true]:bg-gray-200/50 data-[active=true]:ring-1 data-[active=true]:ring-gray-300/60"
                  >
                    <Link
                      href={item.url}
                      className="flex items-center gap-4 py-5"
                    >
                      <item.icon className="!size-5 transition-transform duration-200 ease-out group-hover/menu-item:rotate-[8deg]" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>SERVICES</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {serviceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url || pathname.startsWith(`${item.url}/`)}
                    className="hover:bg-gray-200/30 hover:ring-1 hover:ring-gray-300/50 data-[active=true]:bg-gray-200/50 data-[active=true]:ring-1 data-[active=true]:ring-gray-300/60"
                  >
                    <Link
                      href={item.url}
                      className="flex items-center gap-4 py-5"
                    >
                      <item.icon className="!size-5 transition-transform duration-200 ease-out group-hover/menu-item:rotate-[8deg]" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.title === "Admins & Requests" &&
                    pendingRequestsCount > 0 && (
                      <SidebarMenuBadge className="mt-1">
                        {pendingRequestsCount}
                      </SidebarMenuBadge>
                    )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 pr-2">
        <div className="flex items-center gap-3 hover:bg-gray-200/30 hover:ring-1 hover:ring-gray-300/50 rounded-lg p-2 transition-all">
          <Avatar className="size-8">
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback>
              {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-left flex-1 group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-medium">
              {session?.user?.name || "User"}
            </span>
            <span className="text-xs text-muted-foreground">
              {session?.user?.email || ""}
            </span>
          </div>
          {/* <TooltipProvider>
            <Tooltip delayDuration={1000}>
              <TooltipTrigger asChild> */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="size-8 group-data-[collapsible=icon]:size-8 hover:bg-gray-200/30"
          >
            <LogoutIcon />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
