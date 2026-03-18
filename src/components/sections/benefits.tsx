"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CalendarCheck, Users, Timer, BugOff } from "lucide-react";

import { Container } from "@/components/site/container";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGsapReveal } from "@/hooks/use-gsap-reveal";

const benefits = [
  { icon: CalendarCheck, title: "Mais organização", desc: "Tudo centralizado e fácil de acompanhar." },
  { icon: Users, title: "Mais clientes", desc: "Site com cara de premium que converte mais." },
  { icon: Timer, title: "Mais tempo livre", desc: "Automação tira tarefas repetitivas do caminho." },
  { icon: BugOff, title: "Menos erro", desc: "Processo padronizado, dados confiáveis." },
] as const;

export function BenefitsSection() {
  const ref = React.useRef<HTMLElement>(null);
  useGsapReveal(ref);

  return (
    <section ref={ref} className="relative py-16 sm:py-20">
      <Container>
        <div data-reveal className="max-w-2xl">
          <p className="text-sm font-semibold tracking-wide text-accent/90">
            Benefícios
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Resultado que você sente na rotina.
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            Menos caos operacional, mais clareza e um fluxo que escala.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <motion.div
              key={b.title}
              data-reveal
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/5 border border-white/10">
                    <b.icon className="h-5 w-5 text-foreground" />
                  </span>
                  <CardTitle className="mt-3">{b.title}</CardTitle>
                  <CardDescription className="mt-1">{b.desc}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

