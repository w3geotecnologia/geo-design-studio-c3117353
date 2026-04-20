import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { signIn, isAdmin, isLoading } = useAdminAuth();
  const [email, setEmail] = useState("ivandelima@gmail.com");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isLoading && isAdmin) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);

    if (error) {
      toast({ title: "Erro ao entrar", description: error, variant: "destructive" });
      return;
    }

    toast({ title: "Administrador conectado" });
    navigate("/dashboard");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <section className="w-full max-w-md rounded-lg bg-card p-8 shadow-lg">
        <h1 className="mb-6 font-heading text-2xl font-bold text-foreground">Acesso Administrativo</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>
          <Button type="submit" disabled={submitting || isLoading} className="w-full font-semibold">
            Entrar
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={() => navigate("/")}>Voltar ao site</Button>
        </form>
      </section>
    </main>
  );
};

export default AdminLogin;