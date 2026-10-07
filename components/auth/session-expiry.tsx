"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function SessionExpiry({ expiresAt }: { expiresAt: number }) {
  const router = useRouter();

  useEffect(() => {
    let expired = false;

    const logout = async () => {
      if (expired) return;
      expired = true;

      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } finally {
        router.replace("/login");
        router.refresh();
      }
    };

    const remainingTime = expiresAt - Date.now();
    if (remainingTime <= 0) {
      void logout();
      return;
    }

    const timeout = window.setTimeout(() => void logout(), remainingTime);
    return () => window.clearTimeout(timeout);
  }, [expiresAt, router]);

  return null;
}
