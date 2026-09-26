import {
  AudioLines,
  Home,
  LineChart,
  Settings,
  Sparkles,
  Target,
  Timer,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Short description used for accessible context. */
  description: string;
}

/** Primary destinations: present in the desktop rail and the mobile bottom bar. */
export const primaryNav: NavItem[] = [
  { href: "/", label: "Home", icon: Home, description: "How am I doing today?" },
  { href: "/goals", label: "Goals", icon: Target, description: "Long-term journeys" },
  { href: "/focus", label: "Focus", icon: Timer, description: "Start a focus session" },
  { href: "/universe", label: "Universe", icon: Sparkles, description: "Your progress as a world" },
];

/** Secondary destinations: desktop rail and the mobile "More" sheet. */
export const secondaryNav: NavItem[] = [
  { href: "/audio", label: "Audio", icon: AudioLines, description: "Soundscape mixer" },
  { href: "/circle", label: "Circle", icon: Users, description: "Gentle accountability" },
  { href: "/insights", label: "Insights", icon: LineChart, description: "Private weekly reflection" },
  { href: "/settings", label: "Settings", icon: Settings, description: "Profile, privacy, and data" },
];

/** All destinations, for lookups. */
export const allNav: NavItem[] = [...primaryNav, ...secondaryNav];

export function findNavItem(pathname: string): NavItem | undefined {
  return allNav.find((item) => isActivePath(pathname, item.href));
}

/** Root is only active on an exact match; other routes match their subtree. */
export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
