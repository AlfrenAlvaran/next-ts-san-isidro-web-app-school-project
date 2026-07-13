export type NavChild = {
  label: string;
  href: string;
};

export type NavLink = {
  label: string;
  href: string;
  children?: NavChild[];
};


// hero section
export type HeroProps = {
   minHeight?: string;         
  eyebrow?: string;            
  title: React.ReactNode;      
  description?: React.ReactNode;
  maxWidth?: string;           
  actions?: React.ReactNode;
  showScrollCue?: boolean;   
  footer?: React.ReactNode;    
  className?: string;          
}


// models
export type UserRole = "resident" | "admin" | "superadmin" 



import type { LucideIcon } from "lucide-react";
import React from "react";

// ---------------------------------------------------------------------------
// Shared type definitions
// ---------------------------------------------------------------------------

export interface CertType {
  key: string;
  name: string;
  icon: LucideIcon;
  blurb: string;
  fee: string;
  turnaround: string;
}

export type RequestStatus = "active" | "released" | "rejected";

export type Page = 'home' | 'profile'

export interface RequestItem {
  id: string;
  type: string;
  purpose: string;
  submitted: string;
  stage: number;
  status: RequestStatus;
  note?: string;
}

export interface HouseholdMember {
  id: string;
  name: string;
  relation: string;
  age: number;
}

export interface Notice {
  title: string;
  date: string;
  tag: string;
}

export type DocumentStatus = "verified" | "pending";

export interface DocumentItem {
  name: string;
  status: DocumentStatus;
  date: string;
}


// types.ts (wherever your Profile/HouseholdMember/DocumentItem/RequestItem live)
export interface Profile {
  fullName: string;
  email: string;
  phone: string;

  birthdate: string;
  sex: string;
  civilStatus: string;

  address: string;
  purok: string;
  yearsResiding: string;

  contactNumber: string;

  emergencyName: string;
  emergencyRelation: string;
  emergencyContact: string;

  idNumber: string;
  householdNo: string;
  memberSince: string;
  validThru: string;

  isVerified: boolean;
  isApproved: boolean;

  houseHoldMembers: HouseholdMember[]
}

export interface RecordField {
  key: keyof Profile;
  label: string;
  value: string;
  type?: "text" | "date" | "email" | "select";
  options?: string[];
  wide?: boolean;
  display?: (value: string) => string;
}
export interface ProfilePageProps {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>
  houseHold: HouseholdMember[]
  documents: DocumentItem[]
  request: RequestItem[]
  onBack: ()=>void
}