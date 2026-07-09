import { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

const baseProps: Partial<IconProps> = {
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  strokeWidth: 1.5,
};

export function DocIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg className={className} {...baseProps} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

export function PeopleIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg className={className} {...baseProps} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

export function TaxIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg className={className} {...baseProps} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
      />
    </svg>
  );
}

export function IdIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg className={className} {...baseProps} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0"
      />
    </svg>
  );
}

export function HomeIconSvg({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg className={className} {...baseProps} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  );
}

export function StarIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg className={className} {...baseProps} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z"
      />
    </svg>
  );
}

export function ArrowRightIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg className={className} {...baseProps} strokeWidth={2} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 8l4 4m0 0l-4 4m4-4H3"
      />
    </svg>
  );
}

export function EyeIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return (
    <svg className={className} {...baseProps} {...props} strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

export function HandIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return (
    <svg className={className} {...baseProps} {...props} strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3"
      />
    </svg>
  );
}

export function ShieldIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return (
    <svg className={className} {...baseProps} {...props} strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    </svg>
  );
}

export function GroupIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return (
    <svg className={className} {...baseProps} {...props} strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
      />
    </svg>
  );
}
export function BriefcaseIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg className={className} {...baseProps} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"
      />
    </svg>
  );
}

export function PlaneIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg className={className} {...baseProps} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
      />
    </svg>
  );
}

export function SeedlingIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg className={className} {...baseProps} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21a9 9 0 100-18 9 9 0 000 18zm0-14v10m-3-6c1.657 0 3-1.343 3-3m0 3c0-1.657 1.343-3 3-3"
      />
    </svg>
  );
}

export function HandHeartIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg className={className} {...baseProps} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.3 0a2.251 2.251 0 015.3 0m-5.3 0c-.478.1-.949.223-1.41.368C9.033 4.588 8 5.884 8 7.362V17.5A2.5 2.5 0 0010.5 20h3a2.5 2.5 0 002.5-2.5V7.362c0-1.478-1.033-2.774-2.44-3.158-.461-.145-.932-.268-1.41-.368z"
      />
    </svg>
  );
}

export function ReportIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg className={className} {...baseProps} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
      />
    </svg>
  );
}

export function CheckIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg className={className} {...baseProps} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  );
}

export function GridIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg className={className} {...baseProps} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z"
      />
    </svg>
  );
}

export function GearIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg className={className} {...baseProps} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

export function SearchIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg className={className} {...baseProps} strokeWidth={2} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-4.35-4.35M18 11a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

export function BellIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg className={className} {...baseProps} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
      />
    </svg>
  );
}

export function CalendarIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg className={className} {...baseProps} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 3.75v3m7.5-3v3M3.75 9.75h16.5M5.25 5.25h13.5A1.5 1.5 0 0120.25 6.75v12A1.5 1.5 0 0118.75 20.25H5.25a1.5 1.5 0 01-1.5-1.5v-12a1.5 1.5 0 011.5-1.5z"
      />
    </svg>
  );
}

export function FolderIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg className={className} {...baseProps} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75A2.25 2.25 0 016 4.5h4.19a2.25 2.25 0 011.59.659l.811.811a2.25 2.25 0 001.59.659H18A2.25 2.25 0 0120.25 9v9A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6.75z"
      />
    </svg>
  );
}

export function ClockIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg className={className} {...baseProps} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
      />
    </svg>
  );
}

export function TrashIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg className={className} {...baseProps} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 7.5h10.5m-9.75 0l.75 11.25A1.5 1.5 0 009.75 20.25h4.5a1.5 1.5 0 001.5-1.5L16.5 7.5M9.75 7.5V5.25A1.5 1.5 0 0111.25 3.75h1.5a1.5 1.5 0 011.5 1.5V7.5"
      />
    </svg>
  );
}

export function EditIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg className={className} {...baseProps} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.862 4.487a2.25 2.25 0 113.182 3.182L8.25 19.463l-4.5 1.125 1.125-4.5L16.862 4.487z"
      />
    </svg>
  );
}

export function LogoutIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg className={className} {...baseProps} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-6-3h12m0 0l-3-3m3 3l-3 3"
      />
    </svg>
  );
}
export function ApprovalIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg className={className} {...baseProps} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 4.5V3.75A2.25 2.25 0 0014.25 1.5h-4.5A2.25 2.25 0 007.5 3.75V4.5m9 0h.75A2.25 2.25 0 0119.5 6.75v13.5a2.25 2.25 0 01-2.25 2.25h-10.5A2.25 2.25 0 014.5 20.25V6.75A2.25 2.25 0 016.75 4.5h.75m9 0h-9"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75l2.25 2.25L15.75 10.5"
      />
    </svg>
  );
}