import {
  BriefcaseIcon,
  DocIcon,
  HandHeartIcon,
  IconProps,
  IdIcon,
  PeopleIcon,
  PlaneIcon,
  ReportIcon,
  SeedlingIcon,
  StarIcon,
  TaxIcon,
} from "@/components/icons";
import { HomeIcon } from "lucide-react";
import { ComponentType } from "react";

export type StatsCHild = {
  value: string;
  label: string;
};

export const stats: StatsCHild[] = [
  { value: "12,400+", label: "Registered Residents" },
  { value: "3,200+", label: "Documents Issued" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "24h", label: "Average Processing" },
];

export type ServiceChild = {
  title: string;
  description: string;
  tag: string | null;
  fee: string;
  processing: string;
  category: string;
  icon: ComponentType<IconProps>;
};

export const services: ServiceChild[] = [
  {
    title: "Barangay Clearance",
    description:
      "Required for employment, business permits, and legal transactions.",
    tag: "Most Requested",
    fee: "₱50",
    processing: "Same day",
    category: "Certificates & Documents",
    icon: DocIcon,
  },
  {
    title: "Certificate of Indigency",
    description:
      "For residents qualifying for government assistance and scholarships.",
    tag: null,
    fee: "Free",
    processing: "Same day",
    category: "Assistance Programs",
    icon: PeopleIcon,
  },
  {
    title: "Community Tax Certificate",
    description: "Annual cedula issued to all residents and businesses.",
    tag: null,
    fee: "₱30 and up",
    processing: "Same day",
    category: "Certificates & Documents",
    icon: TaxIcon,
  },
  {
    title: "Barangay ID",
    description:
      "Official identification card for Barangay San Isidro residents.",
    tag: null,
    fee: "₱100",
    processing: "3–5 days",
    category: "Certificates & Documents",
    icon: IdIcon,
  },
  {
    title: "Certificate of Residency",
    description: "Proof of residence for legal, academic, and personal use.",
    tag: null,
    fee: "₱50",
    processing: "Same day",
    category: "Certificates & Documents",
    icon: HomeIcon,
  },
  {
    title: "Good Moral Certificate",
    description:
      "Character reference issued for academic and professional applications.",
    tag: null,
    fee: "₱50",
    processing: "Same day",
    category: "Certificates & Documents",
    icon: StarIcon,
  },
  {
    title: "Business Permit Endorsement",
    description:
      "Barangay-level clearance required before applying for a City Hall business permit.",
    tag: null,
    fee: "₱200 and up",
    processing: "1–2 days",
    category: "Permits & Registration",
    icon: BriefcaseIcon,
  },
  {
    title: "Certificate for Travel Abroad",
    description:
      "Supporting document for OFWs and first-time travelers applying for a passport or visa.",
    tag: "Popular",
    fee: "₱50",
    processing: "Same day",
    category: "Certificates & Documents",
    icon: PlaneIcon,
  },
  {
    title: "First-Time Jobseeker Certificate",
    description:
      "Fee-free certificate under RA 11261 for first-time applicants.",
    tag: "Free",
    fee: "Free",
    processing: "Same day",
    category: "Assistance Programs",
    icon: SeedlingIcon,
  },
  {
    title: "Senior Citizen Registration",
    description:
      "Registers residents aged 60 and above for national and local senior citizen benefits.",
    tag: null,
    fee: "Free",
    processing: "3–5 days",
    category: "Assistance Programs",
    icon: PeopleIcon,
  },
  {
    title: "Solo Parent Registration",
    description:
      "ID and registration for solo parents to access welfare benefits under RA 11861.",
    tag: null,
    fee: "Free",
    processing: "3–5 days",
    category: "Assistance Programs",
    icon: HandHeartIcon,
  },
  {
    title: "Blotter / Incident Report",
    description:
      "Official filing and record of disputes, complaints, or incidents within the barangay.",
    tag: null,
    fee: "Free",
    processing: "Same day",
    category: "Permits & Registration",
    icon: ReportIcon,
  },
];

export type StepProps = {
  step: string;
  title: string;
  description: string;
};

export const steps: StepProps[] = [
  {
    step: "01",
    title: "Create an Account",
    description:
      "Register online and verify your identity with a valid government ID.",
  },
  {
    step: "02",
    title: "Submit a Request",
    description:
      "Choose your document type and fill in the required information.",
  },
  {
    step: "03",
    title: "Track Your Request",
    description:
      "Monitor real-time status updates via your personal dashboard.",
  },
  {
    step: "04",
    title: "Pick Up Your Document",
    description:
      "Collect your signed and sealed document at the barangay hall.",
  },
];

export type MileStoneProps = {
  year: string;
  label: string;
};

export const milestone: MileStoneProps[] = [
  { year: "1820s", label: "Founded as a farming settlement" },
  { year: "1946", label: "Officially constituted as a barangay" },
  { year: "2024", label: "Launched online document portal" },
];

export type BarangayFactProps = {
  label: string;
  value: string;
};

export const barangayFacts: BarangayFactProps[] = [
  { label: "Land Area", value: "2.4 km²" },
  { label: "Population", value: "12,400+" },
  { label: "Households", value: "3,100+" },
  { label: "Puroks", value: "8 zones" },
];

export type NewsCardProps = {
  category: string;
  date: string;
  title: string;
  desc: string;
};

export const news: NewsCardProps[] = [
  {
    category: "Health",
    date: "Jun 18, 2025",
    title: "Free Medical Mission This Saturday",
    desc: "A free check-up and medicine distribution event will be held at the barangay covered court.",
  },
  {
    category: "Infrastructure",
    date: "Jun 10, 2025",
    title: "Road Repair on Rizal Street Begins",
    desc: "Expect minor traffic rerouting along Rizal Street for the next two weeks.",
  },
  {
    category: "Notice",
    date: "Jun 5, 2025",
    title: "Updated Office Hours for June",
    desc: "The barangay hall will operate on a modified schedule during the June 12 holiday week.",
  },
];
