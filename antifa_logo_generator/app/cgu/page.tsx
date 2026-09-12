import Link from "next/link";

export default function CGU() {
  return (
    <div className="panel cgu">
      <h1 className="text-2xl font-bold text-red">Terms of Service</h1>
      <h2>1. Service</h2>
      <p>
        The Antifascist Logo Generator is a free online tool that lets you
        create antifascist logos in SVG format. The tool is provided free of
        charge, with no guarantee of availability or uptime.
      </p>

      <h2>2. Ownership of created logos</h2>
      <p>
        You are free to use, modify, share, and reproduce any logo created with
        this tool, including for commercial purposes. No claim of ownership is
        made over user-generated content.
      </p>

      <h2>3. Prohibited use</h2>
      <p>You may not use this tool or the logos generated from it to:</p>
      <ul>
        <li>
          Promote fascist, racist, xenophobic, or discriminatory ideologies
        </li>
        <li>Harm the antifascist cause or its organizations</li>
        <li>Impersonate any antifascist group or organization</li>
        <li>Violate applicable laws</li>
      </ul>

      <h2>4. Uploaded content</h2>
      <p>
        Images uploaded to the tool stay on your device. No data is transmitted
        to any server. You are solely responsible for the content you import.
      </p>

      <h2>5. Liability</h2>
      <p>
        The tool is provided as-is. The site author cannot be held liable for
        misuse of the tool or for logos created by users.
      </p>

      <h2>6. Contact</h2>
      <p>
        For any questions: open an issue on the
        <Link
          className="text-red hover:text-red-300"
          href="https://github.com/noanwastaken/antifa_logo_generator/issues"
        >
          &nbsp;GitHub repository
        </Link>
        .
      </p>

      <p className="back-link">
        <Link className="text-red hover:text-red-300" href="/">
          ← Back to the generator
        </Link>
      </p>
    </div>
  );
}
