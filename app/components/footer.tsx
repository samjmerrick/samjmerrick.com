export default function Footer() {
  return (
    <footer className="mb-16">
      <p className="mt-8 text-neutral-600 text-center">
        © {new Date().getFullYear()} Sam Merrick |{" "}
        <a
          href="https://github.com/samjmerrick/samjmerrick.com"
          className="hover:text-neutral-400 transition-colors"
        >
          Site Repo
        </a>
      </p>
    </footer>
  );
}
