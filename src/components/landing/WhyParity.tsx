import { motion } from "framer-motion";
import { Shield, Zap, TrendingDown, Tv } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Maximum Compliance",
    description: "Your AI systems are protected with cutting-edge governance protocols.",
  },
  {
    icon: Zap,
    title: "Instant Audits",
    description: "Execute your compliance audits in real-time, without delays.",
  },
  {
    icon: TrendingDown,
    title: "Reduced Risk",
    description: "Benefit from industry-leading bias detection and mitigation.",
  },
  {
    icon: Tv,
    title: "Premium Interface",
    description: "An elegant, intuitive design that's easy to use, even for beginners.",
  },
];

export function WhyParity() {
  return (
    <section id="why-parity" className="relative bg-background py-24">
      {/* Top border gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 text-4xl font-light text-foreground sm:text-5xl">
            Why Choose Parity AI?
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Benefits designed to provide a seamless, secure, and accessible experience for all users.
          </p>
        </motion.div>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-card p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-secondary">
                <feature.icon className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
