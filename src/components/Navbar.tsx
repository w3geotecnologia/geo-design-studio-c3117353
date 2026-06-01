import { useEffect, useState } from "react";
import { Search, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { setProductSearch, useProductSearch } from "@/hooks/useProductSearch";
import { supabase } from "@/lib/supabase";
import logo from "@/assets/logo.png";
import parceiroLogo from "@/assets/parceiro-negociotopografico.jpeg";


const navLinks = [
  { label: "Início", href: "/" },
  { label: "Serviços", href: "/#servicos" },
  { label: "Produtos", href: "/#produtos" },
  { label: "Solicitar Orçamento", href: "/orcamento" },
  { label: "Contato", href: "/#contato" },
  { label: "Sobre", href: "/sobre" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { isAdmin, signOut } = useAdminAuth();
  const { query } = useProductSearch();
  const [produtosNomes, setProdutosNomes] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("produtos")
        .select("nome")
        .eq("ativo", true);
      setProdutosNomes(
        (data ?? [])
          .map((r: { nome: string | null }) => (r.nome ?? "").toLowerCase())
          .filter(Boolean)
      );
    })();
  }, []);

  const handleSearchChange = (value: string) => {
    setProductSearch({ query: value });
    const q = value.trim().toLowerCase();
    if (!q) return;
    const hasMatch = produtosNomes.some((n) => n.includes(q));
    if (hasMatch) {
      document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" });
    }
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
        <div className="container flex items-center gap-6 py-2">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 shrink-0">
            <img src={logo} alt="W3 Geo-Tecnologias" className="h-14 md:h-16 w-auto" />
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-border">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Parceria
              </span>
              <img
                src={parceiroLogo}
                alt="Negócio Topográfico — Parceiro"
                title="Parceria: Negócio Topográfico"
                className="h-20 md:h-24 w-auto object-contain"
              />
            </div>
          </a>

          {/* Search produtos */}
          <div className="hidden md:flex items-center bg-secondary rounded-lg px-3 py-2 ml-auto w-72 lg:w-96">
            <Search className="w-4 h-4 text-muted-foreground mr-2" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Buscar produto pelo nome..."
              className="bg-transparent outline-none text-sm flex-1 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-2 text-sm">
              <div className="leading-tight">
                <p className="font-semibold text-foreground">Seja Bem Vindo</p>
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
                onClick={(e) => {
                  if (link.label === "Contato") {
                    setTimeout(() => {
                      document.getElementById("contato-nome")?.focus({ preventScroll: false });
                    }, 400);
                  }
                }}
                className="relative text-primary-foreground font-heading font-semibold text-sm transition-all duration-300 hover:text-white group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-1/2 h-0.5 w-0 bg-white rounded-full transition-all duration-300 group-hover:w-full group-hover:left-0" />
              </a>
            ))}
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-background border-t border-border px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block text-foreground font-semibold py-2"
                onClick={() => {
                  setMobileOpen(false);
                  if (link.label === "Contato") {
                    setTimeout(() => document.getElementById("contato-nome")?.focus(), 400);
                  }
                }}
              >
                {link.label}
              </a>
            ))}
            <Button className="w-full" onClick={() => { navigate(isAdmin ? "/dashboard" : "/cadastro"); setMobileOpen(false); }}>{isAdmin ? "Alterações" : "Cadastro"}</Button>
            
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
