import { useState } from "react";
import { Search, User, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import logo from "@/assets/logo.png";

const navLinks = [
  { label: "Início", href: "/" },
  { label: "Serviços", href: "/#servicos" },
  { label: "Produtos", href: "/#produtos" },
  { label: "Contato", href: "/#contato" },
  { label: "Sobre", href: "/#sobre" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { isAdmin, signOut } = useAdminAuth();

  const handleUserIconClick = () => {
    navigate(isAdmin ? "/dashboard" : "/admin");
  };

  const handleExit = async () => {
    if (isAdmin) {
      await signOut();
      navigate("/");
      return;
    }
    window.close();
  };

  return (
    <>
      <header className="bg-background shadow-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between py-2">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img src={logo} alt="W3 Geo-Tecnologias" className="h-14 md:h-16 w-auto" />
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
          <div className="hidden md:flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2 text-sm">
              <button
                type="button"
                onClick={handleUserIconClick}
                aria-label={isAdmin ? "Abrir Dashboard" : "Entrar como administrador"}
                title={isAdmin ? "Abrir Dashboard" : "Entrar como administrador"}
                className="p-1.5 rounded-md hover:bg-secondary transition-colors"
              >
                <User className="w-5 h-5 text-muted-foreground" />
              </button>
              <div className="leading-tight">
                <p className="font-semibold text-foreground">Seja Bem Vindo</p>
                <button
                  type="button"
                  onClick={() => navigate(isAdmin ? "/dashboard" : "/entrar")}
                  className="text-primary text-xs hover:underline"
                >
                  {isAdmin ? "Alterações" : "Entrar"}
                </button>
              </div>
              <button
                type="button"
                onClick={handleExit}
                aria-label="Sair"
                title="Sair"
                className="ml-1 p-1.5 rounded-md hover:bg-secondary transition-colors"
              >
                <LogOut className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
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
            <Button className="w-full" onClick={() => { navigate(isAdmin ? "/dashboard" : "/entrar"); setMobileOpen(false); }}>{isAdmin ? "Alterações" : "Entrar"}</Button>
            
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
