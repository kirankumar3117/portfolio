import Image from 'next/image';
import { FileText, MapPin } from 'lucide-react';
import ContactSection from '@/components/ContactSection';
import BottomNinja from '@/components/portfolio/BottomNinja';
import { About, Career } from '@/components/portfolio/Career';
import PortraitLights from '@/components/portfolio/PortraitLights';
import SelectedWork from '@/components/portfolio/SelectedWork';
import { profile } from '@/data/profile';
import styles from '@/components/portfolio/Portfolio.module.css';

const navLinks = [
  { label: 'Work', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

const results = [
  { value: '15%', label: 'Smaller initial bundle', context: 'NEWGAS' },
  { value: '~2s', label: 'Faster time to interactive', context: 'NEWGAS' },
  { value: '2', label: 'VueVerse Connect talks', context: '2025 / 2026' },
];

const resumeHref = '/Kiran-Kumar-Challagiri-Resume.pdf';
const homeUrl = new URL('/', profile.url);
const personId = new URL('#person', homeUrl).href;
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': new URL('#website', homeUrl).href,
      name: profile.siteName,
      alternateName: homeUrl.hostname,
      url: homeUrl.href,
      publisher: { '@id': personId },
    },
    {
      '@type': 'Person',
      '@id': personId,
      name: profile.name,
      url: homeUrl.href,
      jobTitle: profile.role,
      worksFor: { '@type': 'Organization', name: 'Blue Ray Automation' },
      sameAs: [profile.github, profile.linkedin],
    },
  ],
};

function Portrait() {
  return (
    <div className={styles.portraitDevice}>
      <span className={styles.deviceFastener} aria-hidden="true" />
      <span className={styles.deviceFastener} aria-hidden="true" />
      <div className={styles.portraitPhoto}>
        <Image
          src="/images/kiran.webp"
          alt="Kiran Kumar Challagiri"
          fill
          preload
          sizes="(max-width: 650px) 72vw, (max-width: 1100px) 29vw, 300px"
        />
      </div>
      <PortraitLights />
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
      />
      <a className={styles.skipLink} href="#main">Skip to content</a>
      <header className={styles.header}>
        <div className={`${styles.shell} ${styles.headerInner}`}>
          <a className={styles.brand} href="#home" aria-label="Kiran Kumar Challagiri, home">
            <span className={styles.brandMark} aria-hidden="true">KK<span>.</span></span>
            <span className={styles.brandName}>Kiran Kumar</span>
          </a>
          <nav className={styles.nav} aria-label="Main navigation">
            {navLinks.map(({ href, label }) => <a key={href} href={href}>{label}</a>)}
          </nav>
          <a className={styles.headerResume} href={resumeHref} download>
            <FileText size={16} aria-hidden="true" />
            <span>Résumé</span>
          </a>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        <section className={styles.hero} id="home" aria-labelledby="intro-heading">
          <div className={`${styles.shell} ${styles.heroInner}`}>
            <div className={styles.heroCopy}>
              <p className={styles.heroRole}>
                <span aria-hidden="true" />
                {profile.role}
              </p>
              <h1 id="intro-heading" className={styles.heroTitle}>
                <span>Kiran Kumar</span>{' '}
                <span>Challagiri<span className={styles.titleDot}>.</span></span>
              </h1>
              <p className={styles.heroDescription}>
                At Blue Ray Automation, I build features for the NEWGAS admin and distributor
                applications used in Ghana’s LPG supply chain. I also work across our internal
                HR platform, from React screens to Node.js APIs.
              </p>
              <div className={styles.heroActions}>
                <a className={styles.primaryButton} href="#projects">Explore my work</a>
                <a className={styles.secondaryButton} href={resumeHref} download>
                  <FileText size={17} aria-hidden="true" />
                  Download résumé
                </a>
              </div>
              <p className={styles.location}><MapPin size={15} aria-hidden="true" /> India</p>
            </div>
            <Portrait />
          </div>
        </section>

        <div className={styles.shell}>
          <dl className={styles.results} aria-label="Selected achievements">
            {results.map(({ value, label, context }) => (
              <div key={label} className={styles.result}>
                <dt>{label}</dt>
                <dd className={styles.resultValue}>{value}</dd>
                <dd className={styles.resultContext}>{context}</dd>
              </div>
            ))}
          </dl>

          <div className={styles.section}>
            <SelectedWork />
          </div>
          <div className={styles.section}>
            <Career />
          </div>
          <div className={styles.section}>
            <About />
          </div>
        </div>

        <div id="hire">
          <ContactSection />
        </div>
      </main>
      <footer className={styles.footer}>
        <div className={styles.shell}>
          <span>{profile.siteName}</span>
          <a href="#home">Back to top</a>
        </div>
      </footer>
      <BottomNinja />
    </>
  );
}
