import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const Cadastro = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    nome: "", endereco: "", numero: "", cep: "", bairro: "", cidade: "", estado: "", documento: "", telefone: "", email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveCadastro = async (action: "cadastrar" | "alterar") => {
    if (!form.nome || !form.documento || !form.telefone) {
      toast({ title: action === "cadastrar" ? "Preencha os campos obrigatórios" : "Preencha os campos obrigatórios para alterar", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    const request = action === "cadastrar"
      ? supabase.from("cadastro_clientes").insert(form)
      : supabase.from("cadastro_clientes").update(form).eq("documento", form.documento);

    const { error } = await request;
    setIsSaving(false);

    if (error) {
      toast({ title: "Erro ao salvar cadastro", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: action === "cadastrar" ? "Cadastro realizado com sucesso!" : "Cadastro alterado com sucesso!" });
    navigate("/");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveCadastro("cadastrar");
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/50" style={{ background: 'hsl(210 20% 88%)' }}>
      <TopBar />
      <Navbar />
      <main className="flex-1 container py-12">
        <div className="max-w-2xl mx-auto bg-card rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-6">Cadastro de Cliente</h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input name="nome" value={form.nome} onChange={handleChange} placeholder="Seu nome completo" required />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="documento">CPF ou CNPJ *</Label>
              <Input name="documento" value={form.documento} onChange={handleChange} placeholder="000.000.000-00 ou 00.000.000/0000-00" required />
            </div>
            <div>
              <Label htmlFor="cep">CEP</Label>
              <Input name="cep" value={form.cep} onChange={handleChange} placeholder="00000-000" />
            </div>
            <div>
              <Label htmlFor="endereco">Endereço</Label>
              <Input name="endereco" value={form.endereco} onChange={handleChange} placeholder="Rua, Avenida..." />
            </div>
            <div>
              <Label htmlFor="numero">Número</Label>
              <Input name="numero" value={form.numero} onChange={handleChange} placeholder="Nº" />
            </div>
            <div>
              <Label htmlFor="bairro">Bairro</Label>
              <Input name="bairro" value={form.bairro} onChange={handleChange} placeholder="Bairro" />
            </div>
            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input name="cidade" value={form.cidade} onChange={handleChange} placeholder="Cidade" />
            </div>
            <div>
              <Label htmlFor="estado">Estado</Label>
              <Input name="estado" value={form.estado} onChange={handleChange} placeholder="SP" />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone *</Label>
              <Input name="telefone" value={form.telefone} onChange={handleChange} placeholder="(19) 99999-9999" required />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="seu@email.com" />
            </div>
            <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 mt-4">
              <Button type="submit" name="acao" value="cadastrar" disabled={isSaving} className="flex-1 bg-primary text-primary-foreground font-semibold">Cadastrar</Button>
              <Button
                type="button"
                variant="outline"
                disabled={isSaving}
                onClick={() => saveCadastro("alterar")}
                className="flex-1 font-semibold"
              >
                Alterar
              </Button>
            </div>
            <div className="md:col-span-2 text-center mt-2">
              <button type="button" onClick={() => navigate("/")} className="text-primary text-sm hover:underline">
                ← Voltar ao site
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cadastro;
