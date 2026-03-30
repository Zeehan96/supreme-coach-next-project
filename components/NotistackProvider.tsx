"use client";

import { SnackbarProvider } from "notistack";

export default function NotistackProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3500}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      {children}
    </SnackbarProvider>
  );
}
