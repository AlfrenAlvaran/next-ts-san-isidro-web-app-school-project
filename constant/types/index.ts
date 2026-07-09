export type NavChild = {
  label: string;
  href: string;
};

export type NavLink = {
  label: string;
  href: string;
  children?: NavChild[];
};



// models
export type UserRole = "resident" | "admin" | "superadmin" 