"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type FadeInProps = {
  children: ReactNode;
  /** Aynı grubu kademeli göstermek için: 0, 1, 2… */
  index?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
};

/**
 * Görünüm alanına girince aşağıdan yukarı yumuşak geçiş.
 *
 * `once: true` — bölüm bir kez göründükten sonra tekrar animasyon oynatmaz;
 * yukarı aşağı kaydıran kullanıcıyı yormaz.
 * Hareket hassasiyeti açıksa animasyon tamamen atlanır, içerik anında görünür.
 */
export function FadeIn({ children, index = 0, className, as = "div" }: FadeInProps) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.6,
        delay: Math.min(index * 0.08, 0.4),
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </MotionTag>
  );
}
