import { useState } from "react";
import { Search, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Início", href: "#" },
  { label: "Serviços", href: "#servicos" },
  { label: "Produtos", href: "#produtos" },
  { label: "Contato", href: "#contato" },
  { label: "Sobre", href: "#sobre" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Main nav */}
      <header className="bg-background shadow-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between py-3">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <span className="text-primary font-heading font-extrabold text-2xl tracking-tight">
              W3<span className="text-foreground text-base font-semibold ml-0.5">GEO-TECNOLOGIAS</span>
            </span>
          </a>

          {/* Search */}
          <div className="hidden md:flex items-center bg-secondary rounded-lg px-4 py-2 w-80">
            <input
              type="text"
              placeholder="Buscar produtos ou serviços..."
              className="bg-transparent outline-none text-sm flex-1 text-foreground placeholder:text-muted-foreground"
            />
            <Search className="w-4 h-4 text-muted-foreground" />
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-semibold text-foreground leading-tight">Seja Bem Vindo</p>
                <p className="text-muted-foreground text-xs">alterar cadastro</p>
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary-dark text-primary-foreground font-semibold px-6">
              Orçamento
            </Button>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Nav links bar */}
        <nav className="bg-navbar hidden md:block">
          <div className="container flex items-center gap-8 py-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-primary-foreground font-heading font-semibold text-sm hover:opacity-80 transition-opacity"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-background border-t border-border px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="block text-foreground font-semibold py-2" onClick={() => setMobileOpen(false)}>
                {link.label}
              </a>
            ))}
            <Button className="w-full bg-primary text-primary-foreground font-semibold">Orçamento</Button>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
