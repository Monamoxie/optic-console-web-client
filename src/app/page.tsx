import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Optic Console</h1>
      <p className={styles.description}>Analytics platform admin console</p>
    </main>
  );
}
