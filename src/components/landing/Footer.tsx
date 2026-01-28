import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

const navigation = [
  { label: "Why Parity?", href: "#why-parity" },
  { label: "Products", href: "#products" },
  { label: "How it works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

const socials = [
  { label: "Twitter (X)", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "GitHub", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-16">
      <div className="container">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link to="/" className="mb-6 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">Parity AI</span>
            </Link>
            <p className="mb-8 max-w-sm text-sm text-muted-foreground">
              Secure, fast, and seamless AI governance.
              <br />
              Parity AI makes compliance effortless.
            </p>
            <p className="text-sm text-muted-foreground">
              Built with ❤️ by the Parity AI Team
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3">
            <h4 className="mb-4 font-medium text-foreground">Navigation</h4>
            <ul className="space-y-3">
              {navigation.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div className="md:col-span-3">
            <h4 className="mb-4 font-medium text-foreground">Socials</h4>
            <ul className="space-y-3">
              {socials.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
