"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/site/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
        scrolled ? "py-2" : "py-3",
      )}
      initial={false}
      animate={{ y: 0, opacity: 1 }}
    >
      <Container>
        <div
          className={cn(
            "flex items-center justify-between rounded-2xl px-3 py-2 sm:rounded-3xl sm:px-4 sm:py-3",
            scrolled ? "glass" : "bg-transparent",
          )}
        >
          <Link
            href="#topo"
            className="group inline-flex min-w-0 max-w-[70%] items-center gap-2 rounded-2xl py-1 pr-1 text-sm font-semibold tracking-tight text-foreground/95 sm:max-w-none sm:px-2"
          >
            <span className="relative grid h-8 w-8 shrink-0 place-items-center sm:h-9 sm:w-9">
              <Image
                src="/logo-codity.png"
                alt="Codity Tecnologia"
                width={36}
                height={36}
                className="h-8 w-8 object-contain sm:h-9 sm:w-9"
                priority
              />
            </span>
            <span className="min-w-0 truncate leading-none sm:truncate-none">
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

          <div className="flex shrink-0 items-center gap-2">
            <Button
              asChild
              className="h-9 shrink-0 px-3 text-xs font-semibold md:hidden"
            >
              <a href="#cta">Entrar em contato</a>
            </Button>
            <Button
              variant="secondary"
              asChild
              className="hidden text-xs sm:text-sm md:inline-flex"
            >
              <a href="#demo">Ver portfólio</a>
            </Button>
          </div>
        </div>
      </Container>
    </motion.header>
  );
}
