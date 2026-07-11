
import { navLinks } from "@/constant";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-2">
            <p className="text-white font-bold text-sm mb-1">
              Barangay San Isidro
            </p>
            <p className="text-slate-500 text-xs mb-4">
              Taytay, Rizal · CALABARZON (Region IV-A)
            </p>
            <p className="text-slate-500 text-[13px] leading-relaxed max-w-xs">
              Committed to transparent governance and efficient delivery of
              public services to our community.
            </p>
          </div>

          <div>
            <p className="text-slate-300 text-xs font-semibold tracking-[0.12em] uppercase mb-4">
              Navigation
            </p>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-500 hover:text-slate-200 text-[13px] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-slate-300 text-xs font-semibold tracking-[0.12em] uppercase mb-4">
              Contact
            </p>
            <ul className="space-y-3 text-[13px]">
              <li className="text-slate-500">
                Aquarius Street, Brgy. San Isidro, Taytay Rizal
              </li>
              <li className="text-slate-500"><span>Barangay Hall</span> (02) 8650-0139</li>
              <li className="text-slate-500"><span>Tanod</span> (02) 8 669-1096</li>
              <li className="text-slate-500"><span>Rescue Team</span>  0999-882-8218</li>
              <li className="text-slate-500">Mon–Fri, 8:30 AM – 4:30 PM</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-slate-600 text-xs">
            © Develop by <a href="https://web.facebook.com/alvaran.alfren/">Alfren Alvaran</a>, Student of Saint John Paul II. All rights reserved.
          </p>
          <p className="text-slate-700 text-xs">
            Republic of the Philippines · Local Government Unit
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
