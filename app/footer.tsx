import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="footer-quote">
        <span className="q">“</span> Fascism is not to be debated, it is to be
        destroyed!<span className="q">”</span>
        <span className="attr">- Buenaventura Durruti</span>
      </div>
      <div className="footer-links">
        <Link href="/cgu">Terms of Service</Link>
        <Link
          target="_blank"
          href="https://github.com/NoanWasTaken/antifa_logo_generator"
        >
          GitHub Repo
        </Link>
      </div>
    </footer>
  );
}
