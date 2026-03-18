"use client";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Cpu, ShieldCheck, Sparkles } from "lucide-react";

import { Container } from "@/components/site/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ParticlesBackground = dynamic(
  () => import("@/components/three/particles").then((m) => m.ParticlesBackground),
  { ssr: false },
);

const WHATSAPP_LINK =
  "https://wa.me/5500000000000?text=Ol%C3%A1!%20Quero%20um%20site%20premium%20para%20meu%20estabelecimento%20ou%20cl%C3%ADnica%20com%20a%20Codity%20Tecnologia.";

function FuturisticMockup() {
  return (
    <div className="relative w-full max-w-[560px]">
      <div className="absolute -inset-6 rounded-[32px] bg-gradient-to-r from-neon-blue/20 via-accent/10 to-neon-blue/10 blur-2xl" />

      <div className="glass relative overflow-hidden rounded-[32px] p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
              <Sparkles className="h-4 w-4 text-neon-blue" />
            </span>
            <span className="font-medium">Dashboard Inteligente</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-neon-blue/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {[
            { icon: BarChart3, label: "Receita", value: "+38%" },
            { icon: Cpu, label: "Automação", value: "2.4x" },
            { icon: ShieldCheck, label: "Confiabilidade", value: "99.9%" },
            { icon: Sparkles, label: "Clareza", value: "Premium" },
          ].map((item) => (
            <div
              key={item.label}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4"
            >
              <div className="absolute inset-0 opacity-30">
                <div className="absolute -left-full top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </div>
              <div className="relative flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-neon-blue/10 border border-neon-blue/20">
                  <item.icon className="h-5 w-5 text-neon-blue" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-muted">{item.label}</p>
                  <p className="truncate text-lg font-semibold tracking-tight">
                    {item.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Tarefas automatizadas hoje</p>
            <p className="text-sm font-semibold text-foreground">128</p>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/5">
            <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-neon-blue to-accent shadow-glow" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section id="topo" className="relative overflow-hidden pt-28 sm:pt-32">
      <ParticlesBackground />

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-muted backdrop-blur"
            >
              <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_24px_rgba(34,197,94,.55)]" />
              Alta conversão • Visual premium • Entrega rápida
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.05, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl"
            >
              <span className="block bg-gradient-to-r from-neon-blue via-foreground to-accent bg-clip-text text-transparent">
                Sua empresa com presença digital de elite e processos
                inteligentes.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.12, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="mt-5 max-w-xl text-lg leading-relaxed text-muted"
            >
              Desenvolvemos sites de alta conversão para clínicas e comércios, e
              transformamos suas planilhas complexas em softwares sob medida com
              dashboards intuitivos.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.18, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="mt-7 flex flex-col gap-3 sm:flex-row"
            >
              <Button size="lg" asChild>
                <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
                  Falar no WhatsApp <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <a href="#solucao">
                  Ver soluções
                  <span className="ml-2 inline-flex h-7 w-7 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                    <ArrowRight className="h-4 w-4 text-muted" />
                  </span>
                </a>
              </Button>
            </motion.div>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-muted">
              {[
                "Sites para estabelecimentos",
                "Sites para clínicas",
                "Sistemas sob medida",
                "Automação de processos",
              ].map((pill) => (
                <span
                  key={pill}
                  className={cn(
                    "rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur",
                    "hover:border-neon-blue/30 hover:bg-white/10 transition-colors",
                  )}
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.12, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="relative"
          >
            <div className="absolute -top-10 left-1/2 h-24 w-[520px] -translate-x-1/2 rounded-full bg-neon-blue/20 blur-3xl" />
            <div className="absolute -bottom-10 left-1/2 h-24 w-[520px] -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />
            <div className="animate-float">
              <FuturisticMockup />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

