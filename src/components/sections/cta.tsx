"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, MessageCircle, Send } from "lucide-react";

import { Container } from "@/components/site/container";
import { Button } from "@/components/ui/button";

const WHATSAPP_LINK =
  "https://wa.me/5500000000000?text=Quero%20um%20or%C3%A7amento%20para%20um%20site%20premium%20para%20meu%20estabelecimento%20ou%20cl%C3%ADnica%20(com%20poss%C3%ADvel%20sistema)%20com%20a%20Codity%20Tecnologia.";

export function CtaSection() {
  return (
    <section id="cta" className="relative py-16 sm:py-24">
      <Container>
        <div className="glass relative overflow-hidden rounded-[36px] p-8 sm:p-12">
          <div className="pointer-events-none absolute -inset-24 bg-gradient-to-r from-neon-blue/25 via-transparent to-accent/15 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1.25fr_.75fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold tracking-wide text-neon-blue/90">
                CTA
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Pronto para evoluir seu negócio?
              </h2>
              <p className="mt-4 text-muted leading-relaxed">
                Conte em 2 minutos o que você faz hoje. A gente devolve com um plano
                claro, visual premium e uma solução sob medida — com foco em sites
                para estabelecimentos e clínicas.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-3"
            >
              <Button size="lg" asChild>
                <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
                  <Send className="h-4 w-4" />
                  Solicitar orçamento
                </a>
              </Button>
              <p className="text-xs text-muted">
                Resposta rápida • Sem enrolação • Foco em resultado
              </p>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}

