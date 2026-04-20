import { Link } from "react-router-dom";
import { ClipboardList, Package, Users, Wrench } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

const cards = [
  { label: "Cadastro Clientes", href: "/dashboard/clientes", icon: Users },
  { label: "Orçamentos", href: "/dashboard/orcamentos", icon: ClipboardList },
  { label: "Produtos", href: "/dashboard/produtos", icon: Package },
  { label: "Serviços", href: "/dashboard/servicos", icon: Wrench },
];

const Dashboard = () => (
  <AdminLayout title="Dashboard">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Link key={card.href} to={card.href} className="rounded-lg border border-border bg-card p-6 shadow-sm transition-colors hover:bg-secondary">
          <card.icon className="mb-4 h-8 w-8 text-primary" />
          <h2 className="font-heading text-lg font-bold text-foreground">{card.label}</h2>
        </Link>
      ))}
    </div>
  </AdminLayout>
);

export default Dashboard;