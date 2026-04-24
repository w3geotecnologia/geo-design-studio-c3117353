import { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AdminLayout from "@/components/AdminLayout";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

type Produto = {
  id: string;
  nome: string | null;
  categoria: string | null;
  descricao: string | null;
  imagem_url: string | null;
  preco_original: number | null;
  preco: number | null;
  esgotado: boolean | null;
  ativo: boolean | null;
  link_externo: string | null;
};

const emptyForm = {
  nome: "",
  categoria: "",
  descricao: "",
  imagem_url: "",
  preco_original: "",
  preco: "",
  esgotado: false,
  ativo: true,
  link_externo: "",
};

type FormState = typeof emptyForm;

const toNumber = (value: string): number | null => {
  if (!value.trim()) return null;
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) ? n : null;
};

const AdminProdutos = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isEditing = Boolean(selectedId);

  const fillForm = (produto: Produto) => {
    setSelectedId(produto.id);
    setForm({
      nome: produto.nome ?? "",
      categoria: produto.categoria ?? "",
      descricao: produto.descricao ?? "",
      imagem_url: produto.imagem_url ?? "",
      preco_original: produto.preco_original?.toString() ?? "",
      preco: produto.preco?.toString() ?? "",
      esgotado: Boolean(produto.esgotado),
      ativo: produto.ativo ?? true,
      link_externo: produto.link_externo ?? "",
    });
  };

  const resetForm = () => {
    setSelectedId(null);
    setForm(emptyForm);
  };

  const loadProdutos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("produtos")
      .select("id,nome,categoria,descricao,imagem_url,preco_original,preco,esgotado,ativo,link_externo")
      .order("nome", { ascending: true });
    setLoading(false);

    if (error) {
      toast({ title: "Erro ao carregar produtos", description: error.message, variant: "destructive" });
      return;
    }
    setProdutos(data ?? []);
  };

  useEffect(() => {
    loadProdutos();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return produtos;
    return produtos.filter((p) =>
      [p.nome, p.categoria, p.descricao].filter(Boolean).some((v) => v!.toLowerCase().includes(term)),
    );
  }, [produtos, search]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = event.target;
    const value = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;
    setForm((current) => ({ ...current, [target.name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.nome.trim()) {
      toast({ title: "Informe o nome do produto", variant: "destructive" });
      return;
    }
    setSaving(true);

    const payload = {
      nome: form.nome.trim(),
      categoria: form.categoria.trim() || null,
      descricao: form.descricao.trim() || null,
      imagem_url: form.imagem_url.trim() || null,
      preco_original: toNumber(form.preco_original),
      preco: toNumber(form.preco),
      esgotado: form.esgotado,
      ativo: form.ativo,
      link_externo: form.link_externo.trim() || null,
    };

    const query = selectedId
      ? supabase.from("produtos").update(payload).eq("id", selectedId)
      : supabase.from("produtos").insert(payload);

    const { error } = await query;
    setSaving(false);

    if (error) {
      toast({ title: "Erro ao salvar produto", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: selectedId ? "Produto alterado com sucesso" : "Produto cadastrado com sucesso" });
    resetForm();
    await loadProdutos();
  };

  const handleDelete = async (produto: Produto, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!window.confirm(`Remover o produto "${produto.nome ?? "sem nome"}"?`)) return;

    const { error } = await supabase.from("produtos").delete().eq("id", produto.id);
    if (error) {
      toast({ title: "Erro ao remover produto", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Produto removido com sucesso" });
    if (selectedId === produto.id) resetForm();
    await loadProdutos();
  };

  return (
    <AdminLayout title="Cadastro Produtos">
      <form onSubmit={handleSubmit} className="mb-6 rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold">
            {isEditing ? "Alterar dados do produto" : "Cadastrar novo produto"}
          </h2>
          {isEditing && (
            <Button type="button" variant="outline" size="sm" onClick={resetForm}>
              Cancelar edição
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label htmlFor="nome">Nome do produto *</Label>
            <Input id="nome" name="nome" value={form.nome} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="categoria">Categoria</Label>
            <Input id="categoria" name="categoria" value={form.categoria} onChange={handleChange} placeholder="Ex.: Receptores, Acessórios" />
          </div>
          <div>
            <Label htmlFor="imagem_url">URL da imagem</Label>
            <Input id="imagem_url" name="imagem_url" value={form.imagem_url} onChange={handleChange} placeholder="https://..." />
          </div>
          <div>
            <Label htmlFor="preco_original">Preço original (R$)</Label>
            <Input id="preco_original" name="preco_original" type="number" step="0.01" value={form.preco_original} onChange={handleChange} placeholder="630.00" />
          </div>
          <div>
            <Label htmlFor="preco">Preço de venda (R$)</Label>
            <Input id="preco" name="preco" type="number" step="0.01" value={form.preco} onChange={handleChange} placeholder="600.00" />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="link_externo">Link externo (opcional)</Label>
            <Input id="link_externo" name="link_externo" value={form.link_externo} onChange={handleChange} placeholder="https://..." />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea id="descricao" name="descricao" value={form.descricao} onChange={handleChange} rows={3} />
          </div>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" name="esgotado" checked={form.esgotado} onChange={handleChange} className="h-4 w-4" />
            Produto esgotado
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" name="ativo" checked={form.ativo} onChange={handleChange} className="h-4 w-4" />
            Visível no site
          </label>
        </div>

        <Button type="submit" disabled={saving} className="mt-6 font-semibold">
          {saving ? "Salvando..." : isEditing ? "Salvar Alteração" : "Cadastrar Produto"}
        </Button>
      </form>

      <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-heading text-lg font-bold">Produtos cadastrados ({filtered.length})</h2>
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar produto..." className="sm:max-w-xs" />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Imagem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-16 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">Carregando...</TableCell></TableRow>
            )}
            {!loading && filtered.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">Nenhum produto cadastrado.</TableCell></TableRow>
            )}
            {filtered.map((p) => (
              <TableRow key={p.id} className={selectedId === p.id ? "bg-secondary" : "cursor-pointer"} onClick={() => fillForm(p)}>
                <TableCell>
                  {p.imagem_url ? (
                    <img src={p.imagem_url} alt={p.nome ?? ""} className="h-10 w-10 rounded object-contain bg-white" />
                  ) : (
                    <div className="h-10 w-10 rounded bg-muted" />
                  )}
                </TableCell>
                <TableCell className="font-semibold">{p.nome}</TableCell>
                <TableCell>{p.categoria}</TableCell>
                <TableCell>{p.preco != null ? `R$ ${p.preco.toFixed(2)}` : "—"}</TableCell>
                <TableCell>
                  <span className={`text-xs font-semibold ${p.esgotado ? "text-destructive" : "text-primary"}`}>
                    {p.esgotado ? "Esgotado" : p.ativo ? "Ativo" : "Oculto"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button type="button" variant="ghost" size="icon" onClick={(e) => handleDelete(p, e)} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </AdminLayout>
  );
};

export default AdminProdutos;
