"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";

import { Container } from "@/components/site/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const WHATSAPP_LINK =
  "https://wa.me/5500000000000?text=Ol%C3%A1!%20Quero%20evoluir%20meu%20neg%C3%B3cio%20com%20a%20Codity%20Tecnologia.";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all",
        scrolled ? "py-3" : "py-5",
      )}
      initial={false}
      animate={{ y: 0, opacity: 1 }}
    >
      <Container>
        <div
          className={cn(
            "flex items-center justify-between rounded-3xl px-4 py-3",
            scrolled ? "glass" : "bg-transparent",
          )}
        >
          <Link
            href="#topo"
            className="group inline-flex items-center gap-2 rounded-2xl px-2 py-1 text-sm font-semibold tracking-tight text-foreground/95"
          >
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-white/5 border border-white/10">
              <Sparkles className="h-4 w-4 text-neon-blue" />
            </span>
            <span className="leading-none">
              Codity <span className="text-muted">Tecnologia</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
            <a className="hover:text-foreground transition-colors" href="#solucao">
              Solução
            </a>
            <a className="hover:text-foreground transition-colors" href="#diferencial">
              Diferencial
            </a>
            <a className="hover:text-foreground transition-colors" href="#demo">
              Demonstrações
            </a>
            <a className="hover:text-foreground transition-colors" href="#cta">
              Contato
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="secondary" asChild className="hidden md:inline-flex">
              <a href="#demo">Ver portfólio</a>
            </Button>
            <Button asChild>
              <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
                Falar no WhatsApp <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </Container>
    </motion.header>
  );
}

