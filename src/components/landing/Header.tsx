import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Menu, Users, Heart, DollarSign, Tv, Building2 } from "lucide-react";

const products = [
  {
    title: "FairHire AI",
    description: "HR & hiring bias testing and compliance",
    href: "/dashboard",
    icon: Users,
    active: true,
  },
  {
    title: "MedParity",
    description: "Healthcare AI governance",
    href: "/products/medparity",
    icon: Heart,
    comingSoon: true,
  },
  {
    title: "FinParity",
    description: "Financial AI governance",
    href: "/products/finparity",
    icon: DollarSign,
    comingSoon: true,
  },
  {
    title: "ContentGuard",
    description: "Media & content AI governance",
    href: "/products/contentguard",
    icon: Tv,
    comingSoon: true,
  },
  {
    title: "Enterprise",
    description: "General AI governance",
    href: "/products/enterprise",
    icon: Building2,
    comingSoon: true,
  },
];

const solutions = [
  { title: "Compliance Monitoring", href: "#compliance" },
  { title: "Bias Testing", href: "#bias-testing" },
  { title: "Model Inventory", href: "#model-inventory" },
  { title: "Incident Management", href: "#incident-management" },
];

const resources = [
  { title: "Documentation", href: "#docs" },
  { title: "API Reference", href: "#api" },
  { title: "Blog", href: "#blog" },
  { title: "Support", href: "#support" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between" aria-label="Main navigation">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
            aria-label="Parity AI Home"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-md shadow-primary/20">
              <span className="text-lg font-bold text-primary-foreground">P</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Parity AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-sm font-medium">
                  Platform
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-2 p-4 md:w-[500px] md:grid-cols-2">
                    {products.map((product) => (
                      <li key={product.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={product.href}
                            className={cn(
                              "group flex select-none items-start gap-3 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
                              product.comingSoon && "opacity-60 pointer-events-none"
                            )}
                            tabIndex={product.comingSoon ? -1 : 0}
                            aria-disabled={product.comingSoon}
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                              <product.icon className="h-4 w-4 text-primary" aria-hidden="true" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium leading-none text-foreground">
                                  {product.title}
                                </span>
                                {product.active && (
                                  <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
                                    Active
                                  </span>
                                )}
                                {product.comingSoon && (
                                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                    Soon
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-xs leading-snug text-muted-foreground">
                                {product.description}
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-sm font-medium">
                  Solutions
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[220px] gap-1 p-2">
                    {solutions.map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink asChild>
                          <a
                            href={item.href}
                            className="block select-none rounded-md px-3 py-2.5 text-sm font-medium leading-none no-underline outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            {item.title}
                          </a>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-sm font-medium">
                  Resources
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[180px] gap-1 p-2">
                    {resources.map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink asChild>
                          <a
                            href={item.href}
                            className="block select-none rounded-md px-3 py-2.5 text-sm font-medium leading-none no-underline outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            {item.title}
                          </a>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <a
                  href="#about"
                  className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  About
                </a>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/auth">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-sm font-medium"
            >
              Sign In
            </Button>
          </Link>
          <Link to="/auth">
            <Button 
              size="sm" 
              className="shadow-md shadow-primary/20 transition-shadow hover:shadow-lg hover:shadow-primary/30"
            >
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col gap-6 pt-6">
              {/* Mobile Logo */}
              <Link 
                to="/" 
                className="flex items-center gap-2.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
                  <span className="text-lg font-bold text-primary-foreground">P</span>
                </div>
                <span className="text-xl font-bold text-foreground">Parity AI</span>
              </Link>

              {/* Mobile Navigation */}
              <nav className="flex flex-col gap-4" aria-label="Mobile navigation">
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Platform
                  </h3>
                  <ul className="space-y-1">
                    {products.map((product) => (
                      <li key={product.title}>
                        <Link
                          to={product.href}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent",
                            product.comingSoon && "opacity-60 pointer-events-none"
                          )}
                          onClick={() => setMobileMenuOpen(false)}
                          tabIndex={product.comingSoon ? -1 : 0}
                        >
                          <product.icon className="h-4 w-4 text-primary" aria-hidden="true" />
                          {product.title}
                          {product.active && (
                            <span className="ml-auto rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
                              Active
                            </span>
                          )}
                          {product.comingSoon && (
                            <span className="ml-auto text-[10px] text-muted-foreground">
                              Soon
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Solutions
                  </h3>
                  <ul className="space-y-1">
                    {solutions.map((item) => (
                      <li key={item.title}>
                        <a
                          href={item.href}
                          className="block rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Resources
                  </h3>
                  <ul className="space-y-1">
                    {resources.map((item) => (
                      <li key={item.title}>
                        <a
                          href={item.href}
                          className="block rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </nav>

              {/* Mobile CTA */}
              <div className="mt-auto flex flex-col gap-2 border-t border-border pt-4">
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
