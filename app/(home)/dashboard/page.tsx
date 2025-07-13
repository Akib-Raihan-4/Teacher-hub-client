"use client";
import ThemeSwitcher from "@/components/ui/theme-swticher";
import { useAuth } from "@/lib/hooks/useAuth";

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <div>
      <h1>{user?.name}</h1>
      <ThemeSwitcher />
    </div>
  );
}
