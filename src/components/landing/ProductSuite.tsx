import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const products = [
  { name: "FairHire AI", category: "HR", status: "Active" },
  { name: "MedParity", category: "Healthcare", status: "Soon" },
  { name: "FinParity", category: "Finance", status: "Soon" },
  { name: "ContentGuard", category: "Media", status: "Soon" },
  { name: "Enterprise", category: "General", status: "Soon" },
];

// Duplicate for seamless loop
const allProducts = [...products, ...products, ...products, ...products];

export function ProductSuite() {
  return (
    <section id="products" className="relative overflow-hidden bg-background py-24">
      <div className="container mb-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-4xl font-light text-foreground sm:text-5xl">
              All Products, One Platform
            </h2>
            <p className="max-w-md text-muted-foreground">
              Monitor, audit, and govern all your AI systems on a single platform.
              A seamless experience with no compromises.
            </p>
            <Link 
              to="/dashboard" 
              className="mt-8 inline-flex items-center gap-2 text-primary transition-colors hover:text-primary/80"
            >
              Start monitoring now
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scrolling product ticker */}
      <div className="relative">
        {/* Gradient overlays */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-background to-transparent" />
        
        {/* Scrolling rows */}
        <div className="space-y-4">
          {[0, 1, 2, 3].map((rowIndex) => (
            <div key={rowIndex} className="flex gap-4 overflow-hidden">
              <motion.div
                className="flex shrink-0 gap-4"
                animate={{ x: rowIndex % 2 === 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {allProducts.map((product, index) => (
                  <div
                    key={`${product.name}-${index}`}
                    className="flex shrink-0 items-center gap-3 rounded-xl border border-border bg-card px-5 py-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                      <span className="text-sm font-medium text-foreground">
                        {product.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                    {product.status === "Active" && (
                      <span className="ml-2 text-xs text-primary">+Active</span>
                    )}
                  </div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
