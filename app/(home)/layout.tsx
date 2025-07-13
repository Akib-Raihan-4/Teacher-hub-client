import { ProtectedRoute } from "@/lib/guard/protected-routes";
import HomeSidebar from "@/modules/homePage/shared/HomeSidebar/HomeSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex flex-col md:flex-row h-screen">
        <HomeSidebar />
        <main className="sm:pl-12 pl-2 sm:pt-8 pt-2 flex-1 overflow-y-auto bg-white dark:bg-neutral-900">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
