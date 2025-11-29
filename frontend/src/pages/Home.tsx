import { Navbar } from "../components/home/Navbar";
import { Hero } from "../components/home/Hero";
import { Stats } from "../components/home/Stats";
import { Features } from "../components/home/Features";
import { Testimonials } from "../components/home/Testimonials";
import { CTA } from "../components/home/CTA";
import { Footer } from "../components/home/Footer";

export const Home = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-pink-100 selection:text-pink-900">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};
