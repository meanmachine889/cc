import About from "@/components/about";
import FAQsThree from "@/components/faq";
import Features from "@/components/features";
import FooterSection from "@/components/footer";
import { Hero } from "@/components/hero";
import Onboarding from "@/components/onboarding";
import { Navigation } from "@/components/navigation";

export default function Home() {
  return (
    <div className="min-w-screen min-h-screen flex flex-col items-center justify-center bg-black">
      <Navigation />
      {/* Hero Section */}
      <section className="w-full flex h-screen items-center justify-center min-h-screen p-2 md:p-5">
        <Hero />
      </section>

      {/* About */}
      <section className="w-full pt-20">
        <About />
      </section>

      {/* Onboarding */}
      <section className="w-full pt-20">
        <Onboarding />
      </section>

      {/* Features */}
      <section className="w-full pt-20">
        <Features />
      </section>

      {/* FAQ Section */}
      <section className="w-full flex items-center justify-center pt-20 px-2 md:px-5 bg-black">
        <FAQsThree />
      </section>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
