import { motion } from "framer-motion";

const integrations = [
  { name: "AWS", color: "from-orange-500 to-orange-600" },
  { name: "Azure", color: "from-blue-500 to-blue-600" },
  { name: "GCP", color: "from-red-500 to-yellow-500" },
  { name: "Snowflake", color: "from-cyan-400 to-blue-500" },
  { name: "Databricks", color: "from-red-500 to-red-600" },
  { name: "OpenAI", color: "from-emerald-500 to-teal-600" },
];

export function Integrations() {
  return (
    <section className="relative bg-background py-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm uppercase tracking-wider text-muted-foreground">
            Integrates with your stack
          </p>
        </motion.div>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-6 md:gap-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {integrations.map((integration, index) => (
            <motion.div
              key={integration.name}
              className="glass flex h-14 w-28 items-center justify-center rounded-xl transition-all hover:border-primary/30"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <span className={`bg-gradient-to-r ${integration.color} bg-clip-text text-sm font-semibold text-transparent`}>
                {integration.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
