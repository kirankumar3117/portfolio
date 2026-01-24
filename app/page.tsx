import Navbar from '@/components/Navbar';
import Hero3D from '@/components/Hero3D';
import ProjectShowcase from '@/components/ProjectShowcase';
import ReleaseFeed from '@/components/ReleaseFeed';
import ContactSection from '@/components/ContactSection';

export default function Home() {
  return (
    <main className="bg-black min-h-screen selection:bg-purple-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section id="home">
        <Hero3D />
      </section>

      {/* Work Section -> Matches href="#work" */}
      <section id="work">
        <ProjectShowcase />
      </section>

      {/* Notes Section -> Matches href="#journey" */}
      <section id="journey">
        <ReleaseFeed />
      </section>

      {/* Contact Section -> Matches href="#contact" */}
      <section id="contact">
        <ContactSection />
      </section>
    </main>
  );
}