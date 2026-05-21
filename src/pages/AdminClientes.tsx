import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AdminLayout from "@/components/AdminLayout";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

type Cliente = {
  id: string;
  nome: string | null;
  endereco: string | null;
  numero: string | null;
  cep: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  documento: string | null;
  telefone: string | null;
  email: string | null;
};

const emptyForm = {
  nome: "",
  endereco: "",
  numero: "",
  cep: "",
  bairro: "",
  cidade: "",
  estado: "",
  documento: "",
  telefone: "",
  email: "",
};

const AdminClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const isEditing = Boolean(selectedId);

  const fillForm = (cliente: Cliente) => {
    setSelectedId(cliente.id);
    setShowForm(true);
    setForm({
      nome: cliente.nome ?? "",
      endereco: cliente.endereco ?? "",
      numero: cliente.numero ?? "",
      cep: cliente.cep ?? "",
      bairro: cliente.bairro ?? "",
      cidade: cliente.cidade ?? "",
      estado: cliente.estado ?? "",
      documento: cliente.documento ?? "",
      telefone: cliente.telefone ?? "",
      email: cliente.email ?? "",
    });
  };

  const resetForm = () => {
    setSelectedId(null);
    setShowForm(false);
    setForm(emptyForm);
  };

  const loadClientes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("cadastro_clientes")
      .select("id,nome,endereco,numero,cep,bairro,cidade,estado,documento,telefone,email")
      .order("nome", { ascending: true });
    setLoading(false);

    if (error) {
      toast({ title: "Erro ao carregar clientes", description: error.message, variant: "destructive" });
      return;
    }
    setClientes(data ?? []);
  };

  useEffect(() => {
    loadClientes();
  }, []);

  const filteredClientes = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return clientes;
    return clientes.filter((cliente) =>
      [cliente.nome, cliente.documento, cliente.telefone, cliente.email, cliente.cidade]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(term)),
    );
  }, [clientes, search]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.nome.trim()) {
      toast({ title: "Informe o nome do cliente", variant: "destructive" });
      return;
    }
    setSaving(true);
    const query = selectedId
      ? supabase.from("cadastro_clientes").update(form).eq("id", selectedId)
      : supabase.from("cadastro_clientes").insert(form);
    const { error } = await query;
    setSaving(false);

    if (error) {
      toast({ title: "Erro ao salvar cliente", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: selectedId ? "Cliente alterado com sucesso" : "Cliente cadastrado com sucesso" });
    resetForm();
    await loadClientes();
  };

  const handleDelete = async (cliente: Cliente, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!window.confirm(`Remover o cliente "${cliente.nome ?? "sem nome"}"?`)) return;

    const { error } = await supabase.from("cadastro_clientes").delete().eq("id", cliente.id);

    if (error) {
      toast({ title: "Erro ao remover cliente", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Cliente removido com sucesso" });
    if (selectedId === cliente.id) resetForm();
    await loadClientes();
  };

  return (
    <AdminLayout title="Cadastro Clientes">
      <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-heading text-lg font-bold">Clientes cadastrados ({filteredClientes.length})</h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Pesquisar cliente..." className="sm:max-w-xs" />
            <Button onClick={() => { setSelectedId(null); setForm(emptyForm); setShowForm(true); }} className="font-semibold">
              <Plus className="mr-2 h-4 w-4" /> Novo Cliente
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead className="w-16 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Carregando...</TableCell></TableRow>
            )}
            {!loading && filteredClientes.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Nenhum cliente cadastrado.</TableCell></TableRow>
            )}
            {filteredClientes.map((cliente) => (
              <TableRow key={cliente.id} className={selectedId === cliente.id ? "bg-secondary" : "cursor-pointer"} onClick={() => fillForm(cliente)}>
                <TableCell className="font-semibold">{cliente.nome}</TableCell>
                <TableCell>{cliente.documento}</TableCell>
                <TableCell>{cliente.telefone}</TableCell>
                <TableCell>{cliente.cidade}</TableCell>
                <TableCell className="text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={(event) => handleDelete(cliente, event)}
                    aria-label={`Remover ${cliente.nome ?? "cliente"}`}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={resetForm}>
          <aside className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-border bg-card p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSubmit}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-heading text-base font-bold">
                  {isEditing ? "Alterar cliente" : "Cadastrar cliente"}
                </h2>
                <Button type="button" variant="outline" size="sm" onClick={resetForm}>
                  <X className="mr-1 h-4 w-4" /> Fechar
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input id="nome" name="nome" value={form.nome} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="documento">CPF ou CNPJ</Label>
                  <Input id="documento" name="documento" value={form.documento} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" name="telefone" value={form.telefone} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="cep">CEP</Label>
                  <Input id="cep" name="cep" value={form.cep} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input id="endereco" name="endereco" value={form.endereco} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="numero">Número</Label>
                  <Input id="numero" name="numero" value={form.numero} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input id="bairro" name="bairro" value={form.bairro} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input id="cidade" name="cidade" value={form.cidade} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Input id="estado" name="estado" value={form.estado} onChange={handleChange} />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
                </div>
              </div>
              <Button type="submit" disabled={saving} className="mt-6 w-full font-semibold">
                {saving ? "Salvando..." : isEditing ? "Salvar Alteração" : "Cadastrar Cliente"}
              </Button>
            </form>
          </aside>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminClientes;
