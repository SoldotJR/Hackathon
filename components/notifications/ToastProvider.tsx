"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      expand
      visibleToasts={4}
      gap={10}
      offset={16}
      duration={4500}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "pointer-events-auto",
        },
      }}
    />
  );
}
