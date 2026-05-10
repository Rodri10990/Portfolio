"use client";

import { ReadmeModal } from "@/components/ui/readme-modal";
import { ReadmeModalProvider } from "@/contexts/readme-modal-context";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReadmeModalProvider>
      {children}
      <ReadmeModal />
    </ReadmeModalProvider>
  );
}
