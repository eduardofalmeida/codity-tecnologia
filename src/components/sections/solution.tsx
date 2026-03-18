"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Bot, LayoutDashboard, MonitorSmartphone, Settings2 } from "lucide-react";

import { Container } from "@/components/site/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGsapReveal } from "@/hooks/use-gsap-reveal";
import { cn } from "@/lib/utils";

const solutions = [
  {
    icon: MonitorSmartphone,
    title: "Sites profissionais",
    desc: "Carro‑chefe: sites premium para estabelecimentos e clínicas, feitos para converter.",
  },
  {
    icon: Settings2,
    title: "Sistemas sob medida",
    desc: "Seu processo do jeito certo: simples, rápido e escalável.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboards inteligentes",
    desc: "KPIs claros, relatórios automáticos e decisões melhores.",
  },
  {
    icon: Bot,
    title: "Automação de processos",
    desc: "Menos cliques, menos erros, mais tempo para operar e vender.",
  },
] as const;

export function SolutionSection() {
  const ref = React.useRef<HTMLElement>(null);
  useGsapReveal(ref);

  return (
    <section id="solucao" ref={ref} className="relative py-16 sm:py-20">
      <Container>
        <div data-reveal className="max-w-2xl">
          <p className="text-sm font-semibold tracking-wide text-accent/90">
            A solução em 4 pilares
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Design premium + engenharia que funciona.
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            Tudo pensado para reduzir atrito, aumentar produtividade e gerar resultado.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {solutions.map((s) => (
            <motion.div
              key={s.title}
              data-reveal
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="group"
            >
              <Card
                className={cn(
                  "relative overflow-hidden",
                  "hover:border-neon-blue/25 hover:shadow-[0_0_0_1px_rgba(59,130,246,.18),0_30px_90px_rgba(0,0,0,.55)]",
                )}
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute -inset-20 bg-gradient-to-r from-neon-blue/20 via-transparent to-accent/15 blur-2xl" />
                </div>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <motion.span
                      className="grid h-12 w-12 place-items-center rounded-2xl bg-neon-blue/10 border border-neon-blue/20"
                      whileHover={{ rotate: 6 }}
                      transition={{ type: "spring", stiffness: 260, damping: 16 }}
                    >
                      <s.icon className="h-6 w-6 text-neon-blue" />
                    </motion.span>
                    <div>
                      <CardTitle className="text-xl">{s.title}</CardTitle>
                      <CardDescription className="mt-1 text-base">
                        {s.desc}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <p className="mt-4 text-sm text-muted">
                    Resultado: menos esforço operacional, mais clareza e um produto que
                    transmite valor no primeiro segundo.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

