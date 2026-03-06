import { Link } from "react-router-dom";

const navigation = [
  { label: "About", href: "/about", isRoute: true },
  { label: "Try Demo", href: "/dashboard", isRoute: true },
  { label: "Products", href: "#products", isRoute: false },
  { label: "How it works", href: "#how-it-works", isRoute: false },
];

const resources = [
  { label: "Documentation", href: "#" },
  { label: "GitHub", href: "https://github.com/parity-ai" },
  { label: "EU AI Act Guide", href: "#" },
];

const socials = [
  { label: "Twitter (X)", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "GitHub", href: "https://github.com/parity-ai" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background py-16">
      <div className="container">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link to="/" className="mb-6 flex items-center gap-2">
              <img src="/logo-icon.svg" alt="Parity AI" className="h-8 w-8" />
              <span className="text-lg font-semibold text-foreground">Parity AI</span>
            </Link>
            <p className="mb-8 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Open infrastructure for democratic AI accountability.
              <br />
              Built for the EU AI Act. Free for public institutions.
            </p>
            <p className="text-sm text-muted-foreground">
              Open Source | Apache 2.0 License
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-2">
            <h4 className="mb-4 text-sm font-medium text-foreground">Platform</h4>
            <ul className="space-y-3">
              {navigation.map((item) => (
                <li key={item.label}>
                  {item.isRoute ? (
                    <Link
                      to={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-2">
            <h4 className="mb-4 text-sm font-medium text-foreground">Resources</h4>
            <ul className="space-y-3">
              {resources.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div className="md:col-span-2">
            <h4 className="mb-4 text-sm font-medium text-foreground">Connect</h4>
            <ul className="space-y-3">
              {socials.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>© 2026 Parity AI. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-foreground">Privacy Policy</a>
            <a href="#" className="transition-colors hover:text-foreground">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
