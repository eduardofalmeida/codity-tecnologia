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
              Menos planilhas. Mais resultado.
            </p>
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

