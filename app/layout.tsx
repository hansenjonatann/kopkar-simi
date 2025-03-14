"use client";
import "./globals.css";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import { store } from "@/lib/statemanagement/item/store";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const dashboardPath = pathname.startsWith("/dashboard/");
  return (
    <Provider store={store}>
      <html lang="en">
        <body>
          <SessionProvider>
            {dashboardPath ? null : <Toaster position="top-center" />}
            {children}
          </SessionProvider>
        </body>
      </html>
    </Provider>
  );
}
