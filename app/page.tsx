import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import GitHubContributions from "@/components/GitHubContributions";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <GitHubContributions />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
