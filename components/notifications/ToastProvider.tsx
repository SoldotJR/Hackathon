"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      visibleToasts={3}
      gap={8}
      offset={20}
      duration={4000}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "pointer-events-auto",
        },
      }}
    />
  );
}
