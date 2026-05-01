import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

type Mode = "login" | "signup" | "registered";

const Entrar = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      setSubmitting(false);
      if (error) {
        toast({ title: "Erro ao entrar", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Bem-vindo!" });
      navigate("/");
    } else {
      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { emailRedirectTo: `${window.location.origin}/` },
      });
      setSubmitting(false);
      if (error) {
        toast({ title: "Erro ao cadastrar", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Cadastro criado com sucesso!" });
      setMode("registered");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/50" style={{ background: "hsl(210 20% 88%)" }}>
      <TopBar />
      <Navbar />
      <main className="flex-1 container py-12">
        <div className="max-w-md mx-auto bg-card rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
            {mode === "login" && "Entrar"}
            {mode === "signup" && "Criar conta"}
            {mode === "registered" && "Cadastro realizado"}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {mode === "login" && "Acesse com seu e-mail e senha ou cadastre-se."}
            {mode === "signup" && "Informe seu e-mail e crie uma senha."}
            {mode === "registered" && "Deseja completar seu cadastro de cliente agora?"}
          </p>

          {mode !== "registered" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  autoComplete="email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    className="pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={submitting} className="w-full font-semibold">
                {mode === "login" ? "Entrar" : "Cadastrar"}
              </Button>

              <div className="text-center text-sm">
                {mode === "login" ? (
                  <>
                    Não tem conta?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("signup")}
                      className="text-primary font-semibold hover:underline"
                    >
                      Se cadastrar
                    </button>
                  </>
                ) : (
                  <>
                    Já tem conta?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="text-primary font-semibold hover:underline"
                    >
                      Entrar
                    </button>
                  </>
                )}
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <Button onClick={() => navigate("/cadastro")} className="w-full font-semibold">
                Cadastro completo
              </Button>
              <Button variant="outline" onClick={() => navigate("/")} className="w-full">
                Talvez depois
              </Button>
            </div>
          )}

          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-primary text-sm hover:underline"
            >
              ← Voltar ao site
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Entrar;
