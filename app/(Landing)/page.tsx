import Features from "@/modules/landingPage/Feature";
import Hero from "@/modules/landingPage/Hero";
import Navbar from "@/modules/landingPage/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex flex-col justify-center items-center text-center">
        <Hero />
        <Features />
      </div>
    </div>
  );
}
