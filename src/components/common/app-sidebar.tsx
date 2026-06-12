"use client";
import {
  EllipsisVertical,
  LogOut,
  LucideProps,
  BriefcaseBusiness,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { SIDEBAR_MENU_LIST } from "@/constants/sidebar-constant";
import { INITIAL_STATE_PROFILE } from "@/constants/auth-constants";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { signOut } from "@/actions/auth-action";
import { useAuthStore } from "@/stores/auth-store";
import { Profile } from "@/types/auth";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export default function AppSidebar({
  initialProfile,
}: {
  initialProfile: Profile;
}) {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const storeProfile = useAuthStore((state) => state.profile);
  const profile = storeProfile.id
    ? storeProfile
    : (initialProfile ?? INITIAL_STATE_PROFILE);

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size={"lg"} asChild>
              <div className="font-semibold">
                <div className="bg-teal-500 flex p-2 items-center justify-center rounded-md">
                  <BriefcaseBusiness className="size-4" />
                </div>
                Portofolio Admin Page
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {SIDEBAR_MENU_LIST?.map(
                (item: {
                  title: string;
                  url: string;
                  icon: ForwardRefExoticComponent<
                    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
                  >;
                }) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <a
                        href={item.url}
                        className={cn("px-4 py-3 h-auto", {
                          "bg-teal-500 text-white hover:bg-teal-500 hover:text-white":
                            pathname === item.url,
                        })}
                      >
                        {item.icon && <item.icon />} <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size={"lg"}
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={String(profile?.avatar_url) ?? ""}
                    alt={profile.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {profile?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="leading-tight">
                  <h4 className="truncate font-medium capitalize">
                    {profile.name}
                  </h4>
                </div>
                <EllipsisVertical className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex item-center gap-2 px-1 py-1.5">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={String(profile?.avatar_url) ?? ""}
                      alt={profile.name}
                    />
                    <AvatarFallback className="rounded-lg">
                      {profile?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="leading-tight">
                    <h4 className="truncate font-medium capitalize">
                      {profile?.name}
                    </h4>
                    <p className="text-muted-foreground truncate text-xs capitalize">
                      {profile.location}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}
