import { ClipboardList, FileText, LogOut, Package, Users, Wrench } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const menuItems = [
  { label: "Cadastro Clientes", href: "/dashboard/clientes", icon: Users },
  { label: "Orçamentos", href: "/dashboard/orcamentos", icon: ClipboardList },
  { label: "Produtos", href: "/dashboard/produtos", icon: Package },
  { label: "Serviços", href: "/dashboard/servicos", icon: Wrench },
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
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"}`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
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