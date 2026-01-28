import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    quote: "Parity AI makes compliance effortless. Fast audits, comprehensive reports, and a sleek interface—exactly what I needed.",
    name: "Sarah Chen",
    role: "VP of AI Ethics at TechCorp",
    avatar: "SC",
  },
  {
    quote: "The multi-framework compliance tracking saved us months of work. NYC LL144 certification was a breeze.",
    name: "Michael Rodriguez",
    role: "Chief Compliance Officer at HireRight",
    avatar: "MR",
  },
  {
    quote: "Finally, a platform that understands the complexity of AI governance. The bias metrics are incredibly detailed.",
    name: "Dr. Emily Foster",
    role: "Head of Responsible AI at DataFlow",
    avatar: "EF",
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="testimonials" className="relative bg-background py-24">
      {/* Top border */}
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
            Trusted by AI Leaders Worldwide
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Join a growing community of organizations who choose Parity AI for its seamless experience, security, and premium design.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Testimonial Card */}
          <div className="lg:col-span-8">
            <div className="glass rounded-2xl p-8 sm:p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Avatar */}
                  <div className="mb-8 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/80 text-sm font-medium text-foreground">
                      {testimonials[currentIndex].avatar}
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                      <span className="text-xs font-bold text-primary-foreground">✓</span>
                    </div>
                  </div>

                  {/* Quote */}
                  <blockquote className="mb-8 text-2xl font-light leading-relaxed text-foreground sm:text-3xl">
                    "{testimonials[currentIndex].quote}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{testimonials[currentIndex].name}</p>
                      <p className="text-sm text-muted-foreground">{testimonials[currentIndex].role}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {currentIndex + 1}/{testimonials.length}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col justify-center gap-3 lg:col-span-4">
            <button
              onClick={handlePrevious}
              className="glass flex items-center justify-between rounded-xl px-6 py-4 text-foreground transition-all hover:border-primary/30 hover:bg-card"
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Previous</span>
            </button>
            <button
              onClick={handleNext}
              className="glass flex items-center justify-between rounded-xl px-6 py-4 text-foreground transition-all hover:border-primary/30 hover:bg-card"
            >
              <span>Next</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
