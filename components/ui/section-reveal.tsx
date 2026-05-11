"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

type SectionRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function SectionReveal({ children, className, delay = 0 }: SectionRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const resolvedClassName = className ? `min-w-0 ${className}` : "min-w-0";

  if (shouldReduceMotion) {
    return <div className={resolvedClassName}>{children}</div>;
  }

  return (
    <motion.div
      className={resolvedClassName}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.65, 0.3, 0.9] }}
    >
      {children}
    </motion.div>
  );
}
