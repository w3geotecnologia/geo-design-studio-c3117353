import { ClipboardList, FileText, LogOut, Mail, Package, Phone, ShieldCheck, ShoppingCart, Users, Wrench } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/hooks/useAdminAuth";

type MenuItem = { label: string; href: string; icon: typeof Users; children?: { label: string; href: string; icon: typeof Users }[] };

const menuItems: MenuItem[] = [
  { label: "Cadastro Clientes", href: "/dashboard/clientes", icon: Users },
  { label: "Orçamentos", href: "/dashboard/orcamentos", icon: ClipboardList },
  { label: "Pedidos", href: "/dashboard/pedidos", icon: ShoppingCart },
  { label: "Produtos", href: "/dashboard/produtos", icon: Package },
  { label: "Serviços", href: "/dashboard/servicos", icon: Wrench },
  {
    label: "Contato", href: "/dashboard/contato", icon: Phone,
    children: [{ label: "Mensagens", href: "/dashboard/contato/mensagens", icon: Mail }],
  },
];

const AdminLayout = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const { signOut } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-muted/50 text-foreground">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 border-r border-border bg-card p-4 md:block">
          <Link to="/dashboard" className="mb-6 flex items-center gap-2 font-heading text-lg font-bold text-primary">
            <FileText className="h-5 w-5" /> Dashboard
          </Link>
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const active = location.pathname === item.href;
              return (
                <div key={item.href}>
                  <Link
                    to={item.href}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"}`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.children.map((c) => {
                        const cActive = location.pathname === c.href;
                        return (
                          <Link
                            key={c.href}
                            to={c.href}
                            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${cActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
                          >
                            <c.icon className="h-3.5 w-3.5" />
                            {c.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex flex-col gap-3 border-b border-border bg-card px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="font-heading text-2xl font-bold">{title}</h1>
            <div className="flex flex-wrap gap-2">
              {menuItems.map((item) => (
                <Button key={item.href} asChild variant="outline" size="sm" className="md:hidden">
                  <Link to={item.href}>{item.label}</Link>
                </Button>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" /> Sair
              </Button>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;