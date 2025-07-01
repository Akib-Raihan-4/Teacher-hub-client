import ThemeSwitcher from "@/components/ui/theme-swticher";
import { BookOpen } from "lucide-react";
import RegisterModal from "./RegisterModal";

export default function Navbar() {
  return (
    <nav>
      <header className="container mx-auto px-6 py-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="sm:h-8 sm:w-8 text-blue-600 dark:text-yellow-500" />
            <span className="sm:text-2xl font-bold">Teacher Hub</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeSwitcher />
            <RegisterModal />
          </div>
        </nav>
      </header>
    </nav>
  );
}
