import { Link } from "react-router-dom";
import { ArrowUpRight, Plus } from "lucide-react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is Parity AI?",
    answer: "Parity AI is a comprehensive AI governance platform that helps organizations monitor, audit, and ensure compliance of their AI systems across multiple regulatory frameworks including NYC Local Law 144, EU AI Act, and more.",
  },
  {
    question: "Is Parity AI secure?",
    answer: "Absolutely. We employ enterprise-grade security measures including end-to-end encryption, SOC 2 compliance, and regular security audits to ensure your data and AI systems are protected.",
  },
  {
    question: "Which compliance frameworks are supported?",
    answer: "We support NYC Local Law 144, EU AI Act, Colorado AI Act, Illinois AIVOIA, ISO 42001, NIST AI RMF, and more. Our platform is continuously updated as new regulations emerge.",
  },
  {
    question: "What are the fees for audits?",
    answer: "We offer flexible pricing based on the number of AI models and complexity of audits. Contact our sales team for a customized quote that fits your organization's needs.",
  },
  {
    question: "How fast are audits?",
    answer: "Most audits are completed in real-time. Complex bias analyses may take a few minutes depending on the dataset size, but you'll receive immediate insights and actionable recommendations.",
  },
  {
    question: "Do I need to verify my organization?",
    answer: "For enterprise features and compliance reporting, we require basic organization verification. This ensures the integrity of audit trails and compliance documentation.",
  },
  {
    question: "Can I access Parity AI on mobile?",
    answer: "Yes! Our platform is fully responsive and works seamlessly on desktop, tablet, and mobile devices, so you can monitor your AI governance on the go.",
  },
  {
    question: "How can I contact support?",
    answer: "Our support team is available 24/7 via email, chat, or phone. Enterprise customers also have access to dedicated account managers and priority support channels.",
  },
];

const leftColumn = faqs.slice(0, 4);
const rightColumn = faqs.slice(4, 8);

export function FAQ() {
  return (
    <section id="faq" className="relative bg-background py-24">
      {/* Top border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container">
        <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-4xl font-light text-foreground sm:text-5xl">
              Your Questions, Answered
            </h2>
            <p className="max-w-lg text-muted-foreground">
              Find everything you need to know about Parity AI, from security to supported frameworks.
            </p>
          </motion.div>
          
          <Link 
            to="/auth" 
            className="inline-flex items-center gap-2 text-primary transition-colors hover:text-primary/80"
          >
            Create account now
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-0 md:grid-cols-2">
          {/* Left Column */}
          <div className="border-b border-r-0 border-border md:border-b-0 md:border-r">
            <Accordion type="single" collapsible className="divide-y divide-border">
              {leftColumn.map((faq, index) => (
                <AccordionItem key={index} value={`left-${index}`} className="border-0">
                  <AccordionTrigger className="flex items-center justify-between px-0 py-6 text-left hover:no-underline [&[data-state=open]>svg]:rotate-45">
                    <span className="pr-4 text-base text-foreground">{faq.question}</span>
                    <Plus className="h-5 w-5 shrink-0 text-primary transition-transform duration-200" />
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pr-8 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Right Column */}
          <div>
            <Accordion type="single" collapsible className="divide-y divide-border md:pl-8">
              {rightColumn.map((faq, index) => (
                <AccordionItem key={index} value={`right-${index}`} className="border-0">
                  <AccordionTrigger className="flex items-center justify-between px-0 py-6 text-left hover:no-underline [&[data-state=open]>svg]:rotate-45">
                    <span className="pr-4 text-base text-foreground">{faq.question}</span>
                    <Plus className="h-5 w-5 shrink-0 text-primary transition-transform duration-200" />
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pr-8 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
