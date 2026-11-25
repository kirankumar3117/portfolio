import { Check, LockKeyhole, MapPin, Plus, Search, ShieldCheck, Users } from 'lucide-react';
import styles from './SelectedWork.module.css';

function NewgasPreview() {
  return (
    <div className={`${styles.preview} ${styles.newgas}`} aria-hidden="true">
      <div className={styles.newgasScreen}>
        <div className={styles.screenBar}>
          <span className={styles.indicator} />
          <span>Admin &amp; distributor</span>
        </div>
        <div className={styles.newgasContent}>
          <div className={styles.screenNav}>
            <span>Overview</span>
            <span>Orders</span>
            <span>Inventory</span>
            <span>Exchanges</span>
          </div>
          <div className={styles.orderPanel}>
            <div className={styles.tabs}><span>Order entry</span><span>Inventory</span></div>
            <strong>Distributor orders</strong>
            <div className={styles.orderRow}><span /> Cylinder exchange <i>Ready</i></div>
            <div className={styles.orderRow}><span /> Stock transfer <i>In review</i></div>
            <div className={styles.orderRow}><span /> Standby cylinder <i>Draft</i></div>
          </div>
        </div>
      </div>
      <div className={styles.readout}><strong>−15%</strong><span>Initial bundle size</span></div>
    </div>
  );
}

function HrmsPreview() {
  return (
    <div className={`${styles.preview} ${styles.hrms}`} aria-hidden="true">
      <div className={styles.matrix}>
        <div className={styles.matrixHeader}><ShieldCheck /><span>Role permissions</span></div>
        <div className={styles.matrixGrid}>
          <span /><span>HR</span><span>Employee</span>
          <span>Employee record</span><Check /><Check />
          <span>Payroll</span><Check /><LockKeyhole />
          <span>Appraisals</span><Check /><LockKeyhole />
        </div>
      </div>
    </div>
  );
}

function PromylinkPreview() {
  return (
    <div className={`${styles.preview} ${styles.promylink}`} aria-hidden="true">
      <div className={styles.workspace}>
        <div className={styles.screenBar}>
          <span className={styles.indicator} />
          <span>Organization workspace</span>
        </div>
        <div className={styles.workspaceBody}>
          <strong>Collaborations</strong>
          <div className={styles.workspaceTile}><Users /><span>Creators</span></div>
          <div className={styles.workspaceTile}><ShieldCheck /><span>Team access</span></div>
        </div>
      </div>
      <div className={`${styles.phone} ${styles.workspacePhone}`}>
        <div className={styles.phoneScreen}>
          <span className={styles.phoneLens} />
          <Users className={styles.phoneIcon} />
          <strong>Workspace</strong>
          <div className={styles.phoneRow}>Collaborations</div>
          <div className={styles.phoneRow}>Team access</div>
        </div>
      </div>
    </div>
  );
}

function KiggidiPreview() {
  return (
    <div className={`${styles.preview} ${styles.kiggidi}`} aria-hidden="true">
      <div className={styles.map}>
        <div className={styles.mapRings}><MapPin /></div>
      </div>
      <div className={`${styles.phone} ${styles.searchPhone}`}>
        <div className={styles.phoneScreen}>
          <span className={styles.phoneLens} />
          <strong>Find nearby.</strong>
          <div className={styles.searchField}><Search /> Fresh bread</div>
          <div className={styles.phoneRow}><MapPin /> Local bakery</div>
          <div className={styles.phoneRow}><MapPin /> Corner shop</div>
        </div>
      </div>
    </div>
  );
}

const projects = [
  {
    id: 'newgas',
    name: 'NEWGAS',
    role: 'Production ERP · Frontend',
    summary: 'Admin and distributor applications for managing orders, inventory, and LPG cylinder exchanges across Ghana.',
    stack: ['Vue 3', 'Nuxt', 'Pinia', 'Jest'],
    preview: NewgasPreview,
    detail: 'My work across the two applications covered product management, employee onboarding, inventory, and orders. I owned the distributor module and used Vue Router and Pinia to preserve a distributor’s work across tabs. I worked with backend engineers and QA to make the reason for a standby-cylinder order available in the order details.',
    outcome: 'Code splitting and lazy loading cut the initial bundle size by 15% and improved time to interactive by about two seconds.',
  },
  {
    id: 'internal-hrms',
    name: 'Internal HRMS',
    role: 'Internal software · Full-stack',
    summary: 'Employee, payroll, and appraisal workflows for the team at Blue Ray Automation.',
    stack: ['React', 'Redux Toolkit', 'Node.js', 'Express'],
    preview: HrmsPreview,
    detail: 'I built React screens and the Express APIs they use. For payroll and appraisals, I implemented JWT authentication and server-side role checks so each request was authorized before accessing employee data.',
    outcome: 'Shared React components kept common interactions consistent across HR modules.',
  },
  {
    id: 'promylink',
    name: 'PromyLink',
    role: 'Independent project · In development',
    summary: 'A shared workspace for creators and businesses to manage collaborations across web and mobile.',
    stack: ['Next.js', 'React Native', 'NestJS', 'Supabase'],
    preview: PromylinkPreview,
    detail: 'I’m building organization workspaces with shared authentication and role-based access. I use Next.js and React Native for the two client experiences and NestJS for the backend.',
  },
  {
    id: 'kiggidi',
    name: 'Kiggidi',
    role: 'Independent project · Local commerce',
    summary: 'A way to find what nearby shops carry before making the trip.',
    stack: ['FastAPI', 'PostgreSQL', 'Supabase', 'TypeScript'],
    preview: KiggidiPreview,
    detail: 'I’m building the backend with FastAPI and PostgreSQL through Supabase, and exploring natural-language product search so customers can describe what they need in their own words.',
    link: 'https://about.kiggidi.com/',
  },
] as const;

export default function SelectedWork() {
  return (
    <section id="projects" aria-labelledby="work-title" className={styles.section}>
      <h2 id="work-title" className={styles.heading}>Selected work</h2>

      <div className={styles.grid}>
        {projects.map(({ id, name, role, summary, stack, preview: Preview, detail, ...project }) => (
          <article key={id} id={id} aria-labelledby={`${id}-title`} className={styles.card}>
            <Preview />
            <div className={styles.cardBody}>
              <p className={styles.role}>{role}</p>
              <h3 id={`${id}-title`}>{name}</h3>
              <p className={styles.summary}>{summary}</p>
              <ul className={styles.stack} aria-label="Technology stack">
                {stack.map((tool) => <li key={tool}>{tool}</li>)}
              </ul>
              <details className={styles.details}>
                <summary>Case study<span className={styles.srOnly}> for {name}</span><Plus aria-hidden="true" size={18} /></summary>
                <div className={styles.detailsReveal}>
                  <div className={styles.detailsBody}>
                    <p>{detail}</p>
                    {'outcome' in project && <p>{project.outcome}</p>}
                    {'link' in project && <a href={project.link} target="_blank" rel="noreferrer">Project site</a>}
                  </div>
                </div>
              </details>
            </div>
          </article>
        ))}
      </div>

      <article id="d-tracker" aria-labelledby="d-tracker-title" className={styles.tracker}>
        <div>
          <p className={styles.role}>Independent project · Next.js and Node.js</p>
          <h3 id="d-tracker-title">D-Tracker</h3>
          <p>A deployed weekly checklist with inline editing. Enter saves an edit and Escape cancels it.</p>
        </div>
        <div className={styles.trackerActions}>
          <a href="https://d-tracker-iota.vercel.app/" target="_blank" rel="noreferrer">Open app</a>
          <a href="https://github.com/kirankumar3117/tracker-frontend" target="_blank" rel="noreferrer">Source</a>
        </div>
      </article>
    </section>
  );
}
