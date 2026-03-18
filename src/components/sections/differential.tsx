"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, HeartHandshake, Puzzle, Wand2 } from "lucide-react";

import { Container } from "@/components/site/container";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGsapReveal } from "@/hooks/use-gsap-reveal";

const items = [
  {
    icon: Wand2,
    title: "Simples de usar",
    desc: "Interface limpa, fluxo natural e zero complexidade desnecessária.",
  },
  {
    icon: Puzzle,
    title: "Feito sob medida",
    desc: "Cada detalhe nasce do seu processo — nada genérico.",
  },
  {
    icon: CheckCircle2,
    title: "Pensado no seu negócio",
    desc: "Decisões guiadas por resultado, não por “features”.",
  },
  {
    icon: HeartHandshake,
    title: "Suporte próximo",
    desc: "Contato direto, ajustes rápidos e parceria real.",
  },
] as const;

export function DifferentialSection() {
  const ref = React.useRef<HTMLElement>(null);
  useGsapReveal(ref);

  return (
    <section id="diferencial" ref={ref} className="relative py-16 sm:py-20">
      <Container>
        <div data-reveal className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="max-w-xl">
            <p className="text-sm font-semibold tracking-wide text-neon-blue/90">
              Diferencial
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Não criamos apenas sistemas.
              <span className="block text-muted">
                Criamos soluções que fazem seu negócio crescer.
              </span>
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              A combinação de design premium, engenharia sólida e foco em conversão.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((it) => (
              <motion.div
                key={it.title}
                data-reveal
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent/10 border border-accent/20">
                        <it.icon className="h-5 w-5 text-accent" />
                      </span>
                      <div>
                        <CardTitle>{it.title}</CardTitle>
                        <CardDescription>{it.desc}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

