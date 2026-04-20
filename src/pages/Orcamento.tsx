import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const servicosOptions = [
  "Assistência Técnica",
  "Locação de Equipamentos",
  "Topografia e Georreferenciamento",
  "Consultoria Técnica",
  "Calibração de Equipamentos",
];

const Orcamento = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    nome: "", empresa: "", telefone: "", email: "", servico: "", produto: "", descricao: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveOrcamento = async (action: "cadastrar" | "alterar") => {
    if (!form.nome || !form.telefone) {
      toast({ title: action === "cadastrar" ? "Preencha os campos obrigatórios" : "Preencha os campos obrigatórios para alterar", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    const request = action === "cadastrar"
      ? supabase.from("orcamentos").insert(form)
      : supabase.from("orcamentos").update(form).eq("nome", form.nome).eq("telefone", form.telefone);

    const { error } = await request;
    setIsSaving(false);

    if (error) {
      toast({ title: "Erro ao salvar orçamento", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: action === "cadastrar" ? "Solicitação de orçamento enviada com sucesso!" : "Orçamento alterado com sucesso!" });
    navigate("/");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveOrcamento("cadastrar");
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'hsl(210 20% 88%)' }}>
      <TopBar />
      <Navbar />
      <main className="flex-1 container py-12">
        <div className="max-w-2xl mx-auto bg-card rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Solicitar Orçamento</h1>
          <p className="text-muted-foreground mb-6">Preencha o formulário abaixo e nossa equipe entrará em contato com o orçamento.</p>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input name="nome" value={form.nome} onChange={handleChange} placeholder="Seu nome" required />
            </div>
            <div>
              <Label htmlFor="empresa">Empresa</Label>
              <Input name="empresa" value={form.empresa} onChange={handleChange} placeholder="Nome da empresa" />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone *</Label>
              <Input name="telefone" value={form.telefone} onChange={handleChange} placeholder="(19) 99999-9999" required />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="email">E-mail</Label>
              <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="seu@email.com" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="servico">Serviço Desejado</Label>
              <select
                name="servico"
                value={form.servico}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="">Selecione um serviço...</option>
                {servicosOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="produto">Produto (se aplicável)</Label>
              <Input name="produto" value={form.produto} onChange={handleChange} placeholder="Ex: GPS RTK, Estação Total..." />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="descricao">Descrição do Serviço / Observações</Label>
              <Textarea name="descricao" value={form.descricao} onChange={handleChange} placeholder="Descreva o que você precisa..." rows={4} />
            </div>
            <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 mt-4">
              <Button type="submit" disabled={isSaving} className="flex-1 bg-primary text-primary-foreground font-semibold">Cadastrar Orçamento</Button>
              <Button
                type="button"
                variant="outline"
                disabled={isSaving}
                onClick={() => saveOrcamento("alterar")}
                className="flex-1 font-semibold"
              >
                Alterar Orçamento
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

export default Orcamento;
