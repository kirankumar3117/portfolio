import styles from '@/components/portfolio/Portfolio.module.css';

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <div className={styles.portfolio}>{children}</div>;
}
