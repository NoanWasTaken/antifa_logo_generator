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
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/legal">Legal Notice</Link>
        <Link
          target="_blank"
          href="https://github.com/NoanWasTaken/antifa_logo_generator"
        >
          GitHub Repo
        </Link>
        <a
          href="https://ko-fi.com/Z8Z31XR0GH"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://storage.ko-fi.com/cdn/kofi1.png?v=6"
            alt="Buy Me a Coffee at ko-fi.com"
            height={36}
            style={{ height: 36, border: 0 }}
          />
        </a>
      </div>
    </footer>
  );
}
