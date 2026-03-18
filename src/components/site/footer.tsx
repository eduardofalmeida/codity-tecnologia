import { Instagram } from "lucide-react";

import { Container } from "@/components/site/container";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="pb-10 pt-6">
      <Container>
        <Separator className="mb-8" />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-tight text-foreground">
              Codity <span className="text-muted">Tecnologia</span>
            </p>
            <p className="mt-1 text-sm text-muted">
              Transformamos presença digital e processos em crescimento real.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com/codity.tecnologia"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-foreground/95 backdrop-blur transition-all hover:border-neon-blue/30 hover:bg-white/10"
            >
              <Instagram className="h-4 w-4 text-neon-blue" />
              Instagram
            </a>
          </div>
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Codity Tecnologia. Todos os direitos
            reservados.
          </p>
        </div>
      </Container>
    </footer>
  );
}

