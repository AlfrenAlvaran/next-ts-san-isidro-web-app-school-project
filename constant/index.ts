import { services } from "@/data";
import { NavLink } from "./types";

export const navLinks: NavLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About",
    href: "/about",
  },

  {
    label: "offers",
    href: "#",
    children: [
      {
        label: "Barangay Clearance",
        href: "/barangay-clearance",
      },
      { label: "Indigency Certificate", href: "/indigency-certificate" },
      { label: "Business Permit", href: "/barangay-permit" },
      { label: "Residency Certificate", href: "/residency-certificate" },
      { label: "Good Moral Certificate", href: "/good-moral-certificate" },
    ],
  },
  {
    label: "Services",
    href: "/services",
  },
];

// about
import {
  EyeIcon,
  GroupIcon,
  HandIcon,
  IconProps,
  ShieldIcon,
} from "@/components/icons";
import { FileText, IdCard, Landmark, LayoutGrid, LucideIcon, Users } from "lucide-react";
import { ComponentType } from "react";

export type ValueChild = {
  title: string;
  desc: string | null;
  icon: ComponentType<IconProps>;
};

export const values: ValueChild[] = [
  {
    title: "Transparency",
    desc: "Every peso and every decision is open to the community we serve.",
    icon: EyeIcon,
  },
  {
    title: "Accessibility",
    desc: "Services should be within reach of every resident, regardless of schedule or circumstance.",
    icon: HandIcon,
  },
  {
    title: "Accountability",
    desc: "Officials answer directly to the people who elected them.",
    icon: ShieldIcon,
  },
  {
    title: "Bayanihan",
    desc: "A community that carries its burdens, and its progress, together.",
    icon: GroupIcon,
  },
];

export type TimeLineProps = {
  year: string;
  title: string;
  desc: string;
};

export const timeLine: TimeLineProps[] = [
  {
    year: "1948",
    title: "Barangay Founded",
    desc: "San Isidro was formally established as a barrio of the City of Manila, named after its patron saint of laborers and farmers.",
  },
  {
    year: "1975",
    title: "First Barangay Hall Built",
    desc: "A permanent community hall was constructed along Rizal Street, replacing the original wooden meeting house.",
  },
  {
    year: "1991",
    title: "Local Government Code",
    desc: "San Isidro was reorganized under the Local Government Code of 1991, formalizing its councils and elected positions.",
  },
  {
    year: "2018",
    title: "Digital Records Initiative",
    desc: "The barangay began digitizing resident records, reducing average document processing time significantly.",
  },
  {
    year: "2024",
    title: "Online Services Launched",
    desc: "Residents gained the ability to request certificates and track applications online, from anywhere.",
  },
];

export type DepartmentProps = {
  name: string;
  role: string;
};

export const departments: DepartmentProps[] = [
  {
    name: "Office of the Barangay Captain",
    role: "Executive leadership & external affairs",
  },
  {
    name: "Committee on Peace and Order",
    role: "Public safety & dispute mediation",
  },
  {
    name: "Committee on Health",
    role: "Barangay health station & wellness programs",
  },
  {
    name: "Committee on Education",
    role: "Scholarships & youth learning support",
  },
  {
    name: "Committee on Infrastructure",
    role: "Roads, drainage & public facilities",
  },
  { name: "Committee on Women and Family", role: "VAWC desk & family welfare" },
  {
    name: "Sangguniang Kabataan",
    role: "Youth council & youth development programs",
  },
  {
    name: "Barangay Treasury",
    role: "Budget, disbursements & financial reports",
  },
];

import React from "react";

export type RevealChild = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

export type StatItemProps = {
  value: string;
  label: string;
  visible: boolean;
};

export type UseCountUpProps = {
  target: string;
  visible: boolean;
  duration?: number;
};

export type ServiceCardProps = {
  title: string;
  description: string;
  tag: string | null;
  icon: React.ReactNode;
};

export type StepCardProps = {
  step: string;
  title: string;
  description: string;
};

export type NewsCardProps = {
  category: string;
  date: string;
  title: string;
  desc: string;
};

// House Hold Client

export interface Member {
  id: string;
  name: string;
  relation: string;
  age: number;
}

// Data shape submitted from the form
export interface MemberFormPayload {
  name: string;
  relation: string;
  age: number;
}

export interface MemberModalProps {
  mode: string;
  member?: Member | null;
  onClose: () => void;
  onAdd: (payload: MemberFormPayload) => void;
  onEdit: (payload: Member) => void;
}

export type SidebarAdminChild = {
  href: string;
  label: string;
  icon: ComponentType<IconProps>;
  badge?: boolean;
};

// Sidebar admin
export const SidebarAdmin: SidebarAdminChild[] = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: LayoutGrid,
  },
  {
    href: "/certificate-requests",
    label: "Certificate Request",
    icon: FileText,
    badge: true,
  },
  {
    href: "/residents",
    label: "Resident",
    icon: Users,
  },
];

export const CERT_TYPES: string[] = Array.from(
  new Set(services.map((s) => s.title)),
);

export const AUTH_ERROR_CODES = {
  UNVERIFIED: "unverified",
  UNAPPROVED: "unapproved",
  CREDENTIALS: "CredentialsSignin",
} as const;
export type AuthErrorCode =
  (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];

// super admin

// navbar
export interface Tab {
  href: string;
  label: string;
  icon: LucideIcon
}

export const tabs: Tab[] = [
  {
    href: "/overview",
    label: "Overview",
    icon: LayoutGrid,
  },
   {
    href: "/staff",
    label: "Staff & Admins",
    icon: IdCard,
  },
   {
    href: "/officials",
    label: "Elected Officials",
    icon: Landmark,
  },
];
