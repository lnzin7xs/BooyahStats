"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session && pathname !== "/login") {
        router.push("/login");
        return;
      }

      if (session && pathname === "/login") {
        router.push("/");
        return;
      }

      setLoading(false);
    }

    checkUser();

    const { data } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] text-white flex items-center justify-center">
        <p className="text-orange-500 font-black text-xl">
          Carregando...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}