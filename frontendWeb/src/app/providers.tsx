"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { I18nProvider } from "@/components/I18nProvider";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { setAuth, logout } = useAuthStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { user } = await authApi.me();
        setAuth(user);
      } catch {
        logout();
      } finally {
        setInitialized(true);
      }
    };

    loadUser();
  }, [setAuth, logout]);

  if (!initialized) {
    return null;
  }

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <I18nProvider>
          <AuthInitializer>{children}</AuthInitializer>
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
