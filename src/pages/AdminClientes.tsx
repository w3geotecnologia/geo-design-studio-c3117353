import { useEffect, useMemo, useState } from "react";
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

  const fillForm = (cliente: Cliente) => {
    setSelectedId(cliente.id);
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

    const rows = data ?? [];
    setClientes(rows);
    if (rows.length > 0) fillForm(rows[0]);
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
    if (!selectedId) return;

    setSaving(true);
    const { error } = await supabase.from("cadastro_clientes").update(form).eq("id", selectedId);
    setSaving(false);

    if (error) {
      toast({ title: "Erro ao alterar cliente", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Cliente alterado com sucesso" });
    await loadClientes();
  };

  return (
    <AdminLayout title="Cadastro Clientes">
      <form onSubmit={handleSubmit} className="mb-6 rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label htmlFor="nome">Nome Completo</Label>
            <Input id="nome" name="nome" value={form.nome} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="documento">CPF ou CNPJ</Label>
            <Input id="documento" name="documento" value={form.documento} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="telefone">Telefone</Label>
            <Input id="telefone" name="telefone" value={form.telefone} onChange={handleChange} required />
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
        <Button type="submit" disabled={saving || loading || !selectedId} className="mt-6 font-semibold">
          Salvar Alteração
        </Button>
      </form>

      <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-heading text-lg font-bold">Clientes cadastrados</h2>
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Pesquisar cliente..." className="sm:max-w-xs" />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Cidade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClientes.map((cliente) => (
              <TableRow key={cliente.id} className={selectedId === cliente.id ? "bg-secondary" : "cursor-pointer"} onClick={() => fillForm(cliente)}>
                <TableCell className="font-semibold">{cliente.nome}</TableCell>
                <TableCell>{cliente.documento}</TableCell>
                <TableCell>{cliente.telefone}</TableCell>
                <TableCell>{cliente.cidade}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </AdminLayout>
  );
};

export default AdminClientes;