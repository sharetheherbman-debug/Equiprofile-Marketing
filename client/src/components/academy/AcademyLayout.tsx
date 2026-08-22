/**
 * AcademyLayout — Layout wrapper for Academy public marketing pages
 */
import { ReactNode } from "react";
import { AcademyNavbar } from "./AcademyNavbar";
import { AcademyFooter } from "./AcademyFooter";
import { PageTransition } from "@/components/PageTransition";

interface AcademyLayoutProps {
  children: ReactNode;
}

export function AcademyLayout({ children }: AcademyLayoutProps) {
  return (
    <>
      <AcademyNavbar />
      <PageTransition>{children}</PageTransition>
      <AcademyFooter />
    </>
  );
}
