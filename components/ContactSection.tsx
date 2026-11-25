import { Github, Linkedin, Mail } from 'lucide-react';
import ContactForm from '@/components/portfolio/ContactForm';
import { profile } from '@/data/profile';
import styles from '@/components/portfolio/Portfolio.module.css';

export default function ContactSection() {
  return (
    <div className={styles.contactWrap}>
      <section id="contact" className={`${styles.shell} ${styles.contact}`} aria-labelledby="contact-heading">
        <div className={styles.contactIntro}>
          <h2 id="contact-heading">Let’s talk<span>.</span></h2>
          <p>I’m interested in full-stack roles where I can take a feature from the first conversation through to release.</p>
          <div className={styles.contactLinks}>
            <a className={styles.emailLink} href={`mailto:${profile.email}`}>
              <Mail size={19} aria-hidden="true" />
              {profile.email}
            </a>
            <div className={styles.socials}>
              <a href={profile.github}><Github size={17} aria-hidden="true" /> GitHub</a>
              <a href={profile.linkedin}><Linkedin size={17} aria-hidden="true" /> LinkedIn</a>
            </div>
          </div>
        </div>
        <ContactForm />
      </section>
    </div>
  );
}
