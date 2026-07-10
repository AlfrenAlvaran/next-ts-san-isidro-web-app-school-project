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