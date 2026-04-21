import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AdminLayout from "@/components/AdminLayout";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

type Orcamento = {
  id: string;
  nome: string | null;
  empresa: string | null;
  telefone: string | null;
  email: string | null;
  servico: string | null;
  produto: string | null;
  descricao: string | null;
  created_at?: string | null;
};

const servicosOptions = [
  "Assistência Técnica",
  "Locação de Equipamentos",
  "Topografia e Georreferenciamento",
  "Consultoria Técnica",
  "Calibração de Equipamentos",
];

const emptyForm = {
  nome: "",
  empresa: "",
  telefone: "",
  email: "",
  servico: "",
  produto: "",
  descricao: "",
};

const AdminOrcamentos = () => {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fillForm = (orcamento: Orcamento) => {
    setSelectedId(orcamento.id);
    setForm({
      nome: orcamento.nome ?? "",
      empresa: orcamento.empresa ?? "",
      telefone: orcamento.telefone ?? "",
      email: orcamento.email ?? "",
      servico: orcamento.servico ?? "",
      produto: orcamento.produto ?? "",
      descricao: orcamento.descricao ?? "",
    });
  };

  const loadOrcamentos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orcamentos")
      .select("id,nome,empresa,telefone,email,servico,produto,descricao,created_at")
      .order("created_at", { ascending: false });
    setLoading(false);

    if (error) {
      toast({ title: "Erro ao carregar orçamentos", description: error.message, variant: "destructive" });
      return;
    }

    const rows = data ?? [];
    setOrcamentos(rows);
    if (rows.length > 0) fillForm(rows[0]);
  };

  useEffect(() => {
    loadOrcamentos();
  }, []);

  const filteredOrcamentos = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return orcamentos;
    return orcamentos.filter((o) =>
      [o.nome, o.empresa, o.telefone, o.email, o.servico, o.produto]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(term)),
    );
  }, [orcamentos, search]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedId) return;

    setSaving(true);
    const { error } = await supabase.from("orcamentos").update(form).eq("id", selectedId);
    setSaving(false);

    if (error) {
      toast({ title: "Erro ao alterar orçamento", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Orçamento alterado com sucesso" });
    await loadOrcamentos();
  };

  return (
    <AdminLayout title="Orçamentos">
      <form onSubmit={handleSubmit} className="mb-6 rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label htmlFor="nome">Nome Completo</Label>
            <Input id="nome" name="nome" value={form.nome} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="empresa">Empresa</Label>
            <Input id="empresa" name="empresa" value={form.empresa} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="telefone">Telefone</Label>
            <Input id="telefone" name="telefone" value={form.telefone} onChange={handleChange} required />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="servico">Serviço</Label>
            <select
              id="servico"
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
            <Label htmlFor="produto">Produto</Label>
            <Input id="produto" name="produto" value={form.produto} onChange={handleChange} />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="descricao">Descrição / Observações</Label>
            <Textarea id="descricao" name="descricao" value={form.descricao} onChange={handleChange} rows={4} />
          </div>
        </div>
        <Button type="submit" disabled={saving || loading || !selectedId} className="mt-6 font-semibold">
          Salvar Alteração
        </Button>
      </form>

      <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-heading text-lg font-bold">Orçamentos cadastrados</h2>
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Pesquisar orçamento..." className="sm:max-w-xs" />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Serviço</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrcamentos.map((o) => (
              <TableRow key={o.id} className={selectedId === o.id ? "bg-secondary" : "cursor-pointer"} onClick={() => fillForm(o)}>
                <TableCell className="font-semibold">{o.nome}</TableCell>
                <TableCell>{o.empresa}</TableCell>
                <TableCell>{o.telefone}</TableCell>
                <TableCell>{o.servico}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </AdminLayout>
  );
};

export default AdminOrcamentos;
