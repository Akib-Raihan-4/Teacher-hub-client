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
        <main className="sm:pl-12 pl-4 sm:pr-6 pr-4 sm:pt-8 pt-2 flex-1 overflow-y-auto bg-white dark:bg-neutral-800">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
