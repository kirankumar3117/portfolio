import styles from './Career.module.css';

export function Career() {
  return (
    <section id="experience" className={styles.section} aria-labelledby="experience-title">
      <h2 id="experience-title" className={styles.heading}>Experience</h2>

      <div className={styles.entries}>
        <article className={styles.entry}>
          <div className={styles.role}>
            <p className={styles.date}>
              <time dateTime="2023-02">Feb 2023</time> – Present
            </p>
            <h3>Frontend Developer</h3>
            <p className={styles.company}>Blue Ray Automation</p>
          </div>
          <p className={styles.description}>
            I build Vue and Nuxt features for both the NEWGAS admin and distributor applications,
            supporting LPG inventory and orders in Ghana. I also work across our internal HR
            platform, from React screens to Express APIs and permissions for payroll and
            appraisals. I’ve mentored two junior developers and review pull requests.
          </p>
        </article>

        <article className={styles.entry}>
          <div className={styles.role}>
            <p className={styles.date}>
              <time dateTime="2022-01">Jan 2022</time> – <time dateTime="2022-10">Oct 2022</time>
            </p>
            <h3>Full-stack Developer Trainee &amp; Intern</h3>
            <p className={styles.company}>Masai Coding School</p>
          </div>
          <p className={styles.description}>
            I completed 1,200+ hours of MERN stack training while studying mechanical engineering.
            In five-day team sprints, I built responsive interfaces, Express APIs, and JWT
            authentication for full-stack applications.
          </p>
        </article>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="about" className={styles.section} aria-labelledby="about-title">
      <h2 id="about-title" className={styles.heading}>About me</h2>

      <div className={styles.aboutGrid}>
        <div className={styles.bio}>
          <p>
            I started building web apps while studying mechanical engineering at Lakkireddy
            Balireddy College of Engineering. I liked following a feature from the button someone
            presses to the API that handles it and the record it leaves behind. That’s still how
            I think about building software.
          </p>
          <p>
            I learn by working through small examples until I can explain what happens. One of
            my favorites is seeing what V8 does when a function that’s been receiving numbers
            suddenly gets a string. I bring that same curiosity to the products I build and the
            talks I give.
          </p>
        </div>

        <dl className={styles.notes}>
          <div>
            <dt>Speaking · 2025 &amp; 2026</dt>
            <dd>
              VueVerse Connect at T-Hub and Draper Startup House. My 2026 talk,{' '}
              <em>From Idea to Impact</em>, covered how to take a product from idea to first release.
            </dd>
          </div>
          <div>
            <dt>Recognition · 2024</dt>
            <dd>
              Best Employee of the Month at Blue Ray Automation for delivering the Vue distributor
              module two weeks ahead of schedule with zero critical production bugs.
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
