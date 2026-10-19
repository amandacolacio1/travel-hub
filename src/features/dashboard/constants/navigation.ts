import {
  ArrowRightLeft,
  Compass,
  LayoutGrid,
  MapPin,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/explorar", label: "Explorar", icon: Compass },
  { href: "/comparador", label: "Comparador", icon: ArrowRightLeft },
  { href: "/destinos", label: "Destinos", icon: MapPin },
];
