import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";

const products = [
  { name: "FairHire AI", category: "HR", status: "active", color: "bg-emerald-500" },
  { name: "MedParity", category: "Healthcare", status: "soon", color: "bg-rose-500" },
  { name: "FinParity", category: "Finance", status: "soon", color: "bg-amber-500" },
  { name: "ContentGuard", category: "Media", status: "soon", color: "bg-violet-500" },
  { name: "Enterprise", category: "General", status: "soon", color: "bg-blue-500" },
];

const ProductCard = ({ product }: { product: typeof products[0] }) => (
  <div className="mx-2 flex shrink-0 items-center gap-3 rounded-xl border border-border bg-card px-5 py-3">
    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${product.color}/20`}>
      <span className={`text-sm font-semibold ${product.color.replace('bg-', 'text-')}`}>
        {product.name.charAt(0)}
      </span>
    </div>
    <div>
      <p className="font-medium text-foreground">{product.name}</p>
      <p className="text-xs text-muted-foreground">{product.category}</p>
    </div>
    {product.status === "active" && (
      <span className="ml-2 text-xs font-medium text-primary">+Active</span>
    )}
  </div>
);

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

      {/* Scrolling product ticker with react-fast-marquee */}
      <div className="relative">
        {/* Gradient overlays */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-background to-transparent" />
        
        {/* Scrolling rows */}
        <div className="space-y-4">
          <Marquee speed={30} gradient={false}>
            {[...products, ...products, ...products].map((product, index) => (
              <ProductCard key={`row1-${index}`} product={product} />
            ))}
          </Marquee>
          
          <Marquee speed={25} gradient={false} direction="right">
            {[...products, ...products, ...products].map((product, index) => (
              <ProductCard key={`row2-${index}`} product={product} />
            ))}
          </Marquee>
          
          <Marquee speed={35} gradient={false}>
            {[...products, ...products, ...products].map((product, index) => (
              <ProductCard key={`row3-${index}`} product={product} />
            ))}
          </Marquee>
          
          <Marquee speed={28} gradient={false} direction="right">
            {[...products, ...products, ...products].map((product, index) => (
              <ProductCard key={`row4-${index}`} product={product} />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
