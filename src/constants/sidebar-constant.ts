import {
  FolderKanban,
  GitBranch,
  Info,
  LayoutDashboard,
  Layers3,
  Settings,
  UserRound,
} from "lucide-react";

export const SIDEBAR_MENU_LIST = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: UserRound,
  },
  {
    title: "Projects",
    url: "/dashboard/projects",
    icon: FolderKanban,
  },
  {
    title: "Skills",
    url: "/dashboard/skills",
    icon: Layers3,
  },
  {
    title: "About Items",
    url: "/dashboard/about-items",
    icon: Info,
  },
  {
    title: "Experience",
    url: "/dashboard/experience",
    icon: GitBranch,
  },
  {
    title: "Site Settings",
    url: "/dashboard/site-settings",
    icon: Settings,
  },
];

export type SidebarMenuKey = keyof typeof SIDEBAR_MENU_LIST;
