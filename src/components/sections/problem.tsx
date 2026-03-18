"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Clock3, LineChart, XCircle } from "lucide-react";

import { Container } from "@/components/site/container";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGsapReveal } from "@/hooks/use-gsap-reveal";

const problems = [
  { icon: LineChart, title: "Falta de organização", desc: "Dados espalhados e visão zero do todo." },
  { icon: Clock3, title: "Perda de tempo", desc: "Horas por semana repetindo tarefas manuais." },
  { icon: XCircle, title: "Erros manuais", desc: "Retrabalho, números errados e decisões ruins." },
  { icon: AlertTriangle, title: "Falta de crescimento", desc: "O processo trava quando o negócio acelera." },
] as const;

export function ProblemSection() {
  const ref = React.useRef<HTMLElement>(null);
  useGsapReveal(ref);

  return (
    <section ref={ref} className="relative py-16 sm:py-20">
      <Container>
        <div data-reveal className="max-w-2xl">
          <p className="text-sm font-semibold tracking-wide text-neon-blue/90">
            A dor que trava seu crescimento
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Você ainda usa Excel para controlar seu negócio?
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            Se o processo depende de planilhas, o negócio vira refém de retrabalho,
            ruído e falta de previsibilidade — seja você serviço, comércio ou indústria.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((p) => (
            <motion.div
              key={p.title}
              data-reveal
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-neon-blue/10 border border-neon-blue/20">
                      <p.icon className="h-5 w-5 text-neon-blue" />
                    </span>
                    <div>
                      <CardTitle>{p.title}</CardTitle>
                      <CardDescription>{p.desc}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

