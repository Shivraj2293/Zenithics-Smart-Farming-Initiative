// src/app/(admin)/layout.tsx
'use client';

import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token, _hasHydrated } = useAuthStore();
  const router = useRouter();

  // This guard's job is to protect this section of the app.
  // The initial routing after login is handled by the /dashboard page.
  useEffect(() => {
    // Wait until the user's session has been loaded from storage.
    if (!_hasHydrated) {
      return; 
    }

    // If, after loading, there's no token or the user is not an admin,
    // then they are not allowed here. Redirect them away.
    if (!token) {
      router.push('/login');
    } else if (user?.role !== 'admin') {
      router.push('/dashboard'); 
    }
  }, [_hasHydrated, user, token, router]);

  // While waiting for the session to load OR if the user is not a valid admin,
  // show a loading screen. This prevents the admin UI from ever flashing for a non-admin user.
  if (!_hasHydrated || user?.role !== 'admin') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <p className="text-lg font-semibold animate-pulse">Verifying Access...</p>
      </div>
    );
  }
  
  // If all checks pass, the user is a verified admin. Render the layout.
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}