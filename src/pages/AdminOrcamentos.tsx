import { useEffect, useMemo, useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [mode, setMode] = useState<"view" | "edit" | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

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
    setOrcamentos(data ?? []);
  };

  useEffect(() => {
    loadOrcamentos();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return orcamentos;
    return orcamentos.filter((o) =>
      [o.nome, o.empresa, o.telefone, o.email, o.servico, o.produto]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(term)),
    );
  }, [orcamentos, search]);

  const openDialog = (o: Orcamento, m: "view" | "edit") => {
    setSelectedId(o.id);
    setMode(m);
    setForm({
      nome: o.nome ?? "",
      empresa: o.empresa ?? "",
      telefone: o.telefone ?? "",
      email: o.email ?? "",
      servico: o.servico ?? "",
      produto: o.produto ?? "",
      descricao: o.descricao ?? "",
    });
  };

  const closeDialog = () => {
    setMode(null);
    setSelectedId(null);
    setForm(emptyForm);
  };

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
    closeDialog();
    await loadOrcamentos();
  };

  const handleDelete = async (o: Orcamento, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!window.confirm(`Remover o orçamento de "${o.nome ?? "sem nome"}"?`)) return;
    const { error } = await supabase.from("orcamentos").delete().eq("id", o.id);
    if (error) {
      toast({ title: "Erro ao remover orçamento", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Orçamento removido com sucesso" });
    await loadOrcamentos();
  };

  const readOnly = mode === "view";

  return (
    <AdminLayout title="Orçamentos">
      <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-heading text-lg font-bold">Orçamentos cadastrados</h2>
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Pesquisar orçamento..."
            className="sm:max-w-xs"
          />
        </div>
        {loading ? (
          <p className="text-muted-foreground">Carregando...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead className="w-32 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-semibold">{o.nome}</TableCell>
                  <TableCell>{o.empresa}</TableCell>
                  <TableCell>{o.telefone}</TableCell>
                  <TableCell>{o.servico}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button type="button" variant="ghost" size="icon" onClick={() => openDialog(o, "view")} aria-label="Ver">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" onClick={() => openDialog(o, "edit")} aria-label="Editar">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(event) => handleDelete(o, event)}
                        aria-label="Excluir"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Nenhum orçamento encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </section>

      <Dialog open={mode !== null} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{readOnly ? "Visualizar orçamento" : "Editar orçamento"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input id="nome" name="nome" value={form.nome} onChange={handleChange} disabled={readOnly} />
            </div>
            <div>
              <Label htmlFor="empresa">Empresa</Label>
              <Input id="empresa" name="empresa" value={form.empresa} onChange={handleChange} disabled={readOnly} />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input id="telefone" name="telefone" value={form.telefone} onChange={handleChange} disabled={readOnly} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} disabled={readOnly} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="servico">Serviço</Label>
              <select
                id="servico"
                name="servico"
                value={form.servico}
                onChange={handleChange}
                disabled={readOnly}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Selecione um serviço...</option>
                {servicosOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="produto">Produto</Label>
              <Input id="produto" name="produto" value={form.produto} onChange={handleChange} disabled={readOnly} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="descricao">Descrição / Observações</Label>
              <Textarea id="descricao" name="descricao" value={form.descricao} onChange={handleChange} rows={4} disabled={readOnly} />
            </div>
            <DialogFooter className="md:col-span-2">
              <Button type="button" variant="outline" onClick={closeDialog}>
                {readOnly ? "Fechar" : "Cancelar"}
              </Button>
              {!readOnly && (
                <Button type="submit" disabled={saving}>
                  {saving ? "Salvando..." : "Salvar Alteração"}
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminOrcamentos;
