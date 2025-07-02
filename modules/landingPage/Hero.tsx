import { ArrowRight } from "lucide-react";
import AuthModal from "./AuthModal";

export default function Hero() {
  return (
    <section className="container mx-auto px-6 py-20 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Simplify Your
          <span className="text-blue-600 dark:text-yellow-500 block">
            Teaching Finances
          </span>
        </h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Manage student fees, automate payment reminders, and track expenses.
          Focus on teaching while we handle the finances.
        </p>
        <AuthModal
          buttonText="Start Free Trial"
          spanClassName="dark:text-black font-bold"
          buttonClassname="px-8 py-6"
          icon=<ArrowRight className="ml-2 h-5 w-5" />
        />
      </div>
    </section>
  );
}
