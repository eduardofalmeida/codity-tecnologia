"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { LayoutGrid, LineChart, Shield, Stethoscope } from "lucide-react";

import { Container } from "@/components/site/container";
import { Card } from "@/components/ui/card";
import { useGsapReveal } from "@/hooks/use-gsap-reveal";
import { cn } from "@/lib/utils";

type Demo = {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: "neon" | "green" | "deep";
};

const demos: Demo[] = [
  {
    title: "Site para clínica",
    subtitle: "Visual premium, agendamento e páginas que passam confiança.",
    icon: Stethoscope,
    accent: "green",
  },
  {
    title: "Dashboard de performance",
    subtitle: "Indicadores, metas e relatórios automáticos em tempo real.",
    icon: LineChart,
    accent: "neon",
  },
  {
    title: "Site institucional",
    subtitle: "Aparência premium para gerar confiança e conversão.",
    icon: Shield,
    accent: "deep",
  },
];

function AccentClass(accent: Demo["accent"]) {
  if (accent === "green") return "from-accent/25 via-transparent to-neon-blue/15";
  if (accent === "deep") return "from-deep-blue/25 via-transparent to-neon-blue/10";
  return "from-neon-blue/25 via-transparent to-accent/10";
}

function MiniMockup({ accent, title }: { accent: Demo["accent"]; title: string }) {
  const isPerformance = title === "Dashboard de performance";
  const isClinic = title === "Site para clínica";
  const isInstitucional = title === "Site institucional";

  if (isClinic) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <div
          className={cn(
            "pointer-events-none absolute -inset-16 bg-gradient-to-r blur-2xl opacity-60",
            AccentClass(accent),
          )}
        />
        <div className="relative">
          <Image
            src="/site-clinica.png"
            alt="Site premium para clínica em notebook"
            width={1024}
            height={454}
            className="h-auto w-full object-cover"
            priority={false}
          />
        </div>
      </div>
    );
  }

  if (isInstitucional) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <div
          className={cn(
            "pointer-events-none absolute -inset-16 bg-gradient-to-r blur-2xl opacity-60",
            AccentClass(accent),
          )}
        />
        <div className="relative">
          <Image
            src="/site-institucional.png"
            alt="Site institucional moderno em notebook"
            width={1024}
            height={682}
            className="h-auto w-full object-cover"
            priority={false}
          />
        </div>
      </div>
    );
  }

  if (isPerformance) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <div
          className={cn(
            "pointer-events-none absolute -inset-16 bg-gradient-to-r blur-2xl opacity-60",
            AccentClass(accent),
          )}
        />
        <div className="relative">
          <Image
            src="/dashboard-performance.png"
            alt="Dashboard de performance com gráficos e indicadores"
            width={1024}
            height={682}
            className="h-auto w-full object-cover"
            priority={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4">
      <div
        className={cn(
          "pointer-events-none absolute -inset-16 bg-gradient-to-r blur-2xl opacity-70",
          AccentClass(accent),
        )}
      />
      <div className="relative grid gap-3">
        <div className="flex items-center justify-between">
          <div className="h-3 w-24 rounded-full bg-white/10" />
          <div className="flex gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-white/25" />
            <div className="h-2.5 w-2.5 rounded-full bg-white/25" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2 h-20 rounded-2xl bg-gradient-to-br from-white/10 to-white/5" />
          <div className="h-20 rounded-2xl bg-white/5 border border-white/10" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="h-10 rounded-2xl bg-white/5 border border-white/10" />
          <div className="h-10 rounded-2xl bg-white/5 border border-white/10" />
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
          <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-neon-blue to-accent shadow-glow" />
        </div>
      </div>
    </div>
  );
}

export function DemoSection() {
  const ref = React.useRef<HTMLElement>(null);
  useGsapReveal(ref);

  return (
    <section id="demo" ref={ref} className="relative py-16 sm:py-20">
      <Container>
        <div data-reveal className="max-w-2xl">
          <p className="text-sm font-semibold tracking-wide text-neon-blue/90">
            Demonstração
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Visual de produto. Experiência de startup milionária.
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            Um portfólio em estilo premium, com microinterações e layout moderno.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {demos.map((d) => (
            <motion.div
              key={d.title}
              data-reveal
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="group"
            >
              <Card className="relative h-full overflow-hidden p-0">
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted">{d.subtitle}</p>
                      <h3 className="mt-2 text-xl font-semibold tracking-tight">
                        {d.title}
                      </h3>
                    </div>
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/5 border border-white/10">
                      <d.icon className="h-6 w-6 text-neon-blue" />
                    </span>
                  </div>
                  <div className="mt-6 origin-center transition-transform duration-300 group-hover:scale-[1.02]">
                    <MiniMockup accent={d.accent} title={d.title} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

