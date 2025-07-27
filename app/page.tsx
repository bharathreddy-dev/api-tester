import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ApiHandler from "@/components/ApiHandler";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <ApiHandler />
      <Features />
      <Testimonials />
      <Cta />
      <Footer />
    </main>
  );
}
