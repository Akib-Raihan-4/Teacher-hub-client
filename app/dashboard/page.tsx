"use client";
import { useAuth } from "@/lib/hooks/useAuth";

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <div>
      <h1>{user?.name}</h1>
    </div>
  );
}
