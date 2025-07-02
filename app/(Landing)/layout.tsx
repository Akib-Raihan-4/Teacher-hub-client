import { PublicRoute } from "@/lib/guard/public-routes";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicRoute>{children}</PublicRoute>;
}
