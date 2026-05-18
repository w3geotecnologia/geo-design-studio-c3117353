import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Check, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

type Cliente = {
  id: string;
  nome: string | null;
  email: string | null;
  telefone: string | null;
};

type ItemPedido = {
  produto_id: string;
  nome: string | null;
  preco: number;
  qty: number;
  subtotal: number;
};

type Pedido = {
  id: string;
  cliente_id: string;
  itens: ItemPedido[];
  subtotal: number;
  frete: number;
  total: number;
  cep: string | null;
  status: string;
  criado_em: string;
  cadastro_clientes?: Cliente | null;
};

const formatBRL = (v: number) =>
  (v ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const AdminPedidos = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [selecionado, setSelecionado] = useState<Pedido | null>(null);
  const [editando, setEditando] = useState<Pedido | null>(null);
  const [busy, setBusy] = useState(false);

  const carregar = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pedidos")
      .select(
        "id,cliente_id,itens,subtotal,frete,total,cep,status,criado_em,cadastro_clientes(id,nome,email,telefone)",
      )
      .order("criado_em", { ascending: false });
    if (error) toast({ title: "Erro ao carregar pedidos", description: error.message, variant: "destructive" });
    setPedidos((data as any) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    carregar();
  }, []);

  const recalcular = (itens: ItemPedido[], frete: number) => {
    const subtotal = itens.reduce((s, it) => s + (Number(it.preco) || 0) * (Number(it.qty) || 0), 0);
    const itensFix = itens.map((it) => ({
      ...it,
      subtotal: Number(((Number(it.preco) || 0) * (Number(it.qty) || 0)).toFixed(2)),
    }));
    return { itens: itensFix, subtotal: Number(subtotal.toFixed(2)), total: Number((subtotal + (Number(frete) || 0)).toFixed(2)) };
  };

  const confirmar = async (p: Pedido) => {
    if (p.status === "concluido") return;
    if (!confirm("Confirmar pedido? Isso reduzirá o estoque dos produtos.")) return;
    setBusy(true);
    try {
      // Atualiza estoque de cada item
      for (const it of p.itens ?? []) {
        if (!it.produto_id) continue;
        const { data: prod, error: eGet } = await supabase
          .from("produtos")
          .select("estoque")
          .eq("id", it.produto_id)
          .maybeSingle();
        if (eGet) throw eGet;
        const atual = Number(prod?.estoque ?? 0);
        const novo = Math.max(0, atual - Number(it.qty || 0));
        const { error: eUpd } = await supabase
          .from("produtos")
          .update({ estoque: novo, esgotado: novo <= 0 })
          .eq("id", it.produto_id);
        if (eUpd) throw eUpd;
      }
      const { error } = await supabase.from("pedidos").update({ status: "concluido" }).eq("id", p.id);
      if (error) throw error;
      toast({ title: "Pedido confirmado" });
      await carregar();
    } catch (e: any) {
      toast({ title: "Erro ao confirmar", description: e.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const excluir = async (p: Pedido) => {
    if (!confirm("Deletar este pedido?")) return;
    const { error } = await supabase.from("pedidos").delete().eq("id", p.id);
    if (error) return toast({ title: "Erro ao deletar", description: error.message, variant: "destructive" });
    toast({ title: "Pedido removido" });
    await carregar();
  };

  const salvarEdicao = async () => {
    if (!editando) return;
    const { itens, subtotal, total } = recalcular(editando.itens ?? [], editando.frete);
    setBusy(true);
    const { error } = await supabase
      .from("pedidos")
      .update({
        itens,
        subtotal,
        total,
        frete: editando.frete,
        cep: editando.cep,
        status: editando.status,
      })
      .eq("id", editando.id);
    setBusy(false);
    if (error) return toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    toast({ title: "Pedido atualizado" });
    setEditando(null);
    await carregar();
  };

  const atualizarItemEdit = (idx: number, campo: "qty" | "preco", valor: string) => {
    if (!editando) return;
    const itens = [...(editando.itens ?? [])];
    const num = Number(valor.replace(",", ".")) || 0;
    itens[idx] = { ...itens[idx], [campo]: num };
    const r = recalcular(itens, editando.frete);
    setEditando({ ...editando, itens: r.itens, subtotal: r.subtotal, total: r.total });
  };

  const removerItemEdit = (idx: number) => {
    if (!editando) return;
    const itens = (editando.itens ?? []).filter((_, i) => i !== idx);
    const r = recalcular(itens, editando.frete);
    setEditando({ ...editando, itens: r.itens, subtotal: r.subtotal, total: r.total });
  };

  return (
    <AdminLayout title="Pedidos">
      <div className="rounded-lg border bg-card">
        {loading ? (
          <p className="p-6 text-muted-foreground">Carregando...</p>
        ) : pedidos.length === 0 ? (
          <p className="p-6 text-muted-foreground">Nenhum pedido registrado.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedidos.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="whitespace-nowrap text-sm">
                    {new Date(p.criado_em).toLocaleString("pt-BR")}
                  </TableCell>
                  <TableCell className="font-medium">{p.cadastro_clientes?.nome ?? "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div>{p.cadastro_clientes?.email ?? "—"}</div>
                    <div>{p.cadastro_clientes?.telefone ?? "—"}</div>
                  </TableCell>
                  <TableCell>{p.itens?.length ?? 0}</TableCell>
                  <TableCell className="text-right font-semibold">{formatBRL(p.total)}</TableCell>
                  <TableCell>
                    <Badge variant={p.status === "concluido" ? "default" : "secondary"}>{p.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="outline" onClick={() => setSelecionado(p)}>Ver</Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => confirmar(p)}
                        disabled={busy || p.status === "concluido"}
                        title="Confirmar pedido"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditando({ ...p, itens: [...(p.itens ?? [])] })} title="Alterar">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => excluir(p)}
                        className="text-destructive hover:bg-destructive/10"
                        title="Deletar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Detalhes */}
      <Dialog open={!!selecionado} onOpenChange={(o) => !o && setSelecionado(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido</DialogTitle>
          </DialogHeader>
          {selecionado && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-muted-foreground">Cliente</p><p className="font-semibold">{selecionado.cadastro_clientes?.nome ?? "—"}</p></div>
                <div><p className="text-muted-foreground">Data</p><p className="font-semibold">{new Date(selecionado.criado_em).toLocaleString("pt-BR")}</p></div>
                <div><p className="text-muted-foreground">E-mail</p><p>{selecionado.cadastro_clientes?.email ?? "—"}</p></div>
                <div><p className="text-muted-foreground">Telefone</p><p>{selecionado.cadastro_clientes?.telefone ?? "—"}</p></div>
                <div><p className="text-muted-foreground">CEP</p><p>{selecionado.cep ?? "—"}</p></div>
                <div><p className="text-muted-foreground">Status</p><p>{selecionado.status}</p></div>
              </div>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead className="text-center">Qtd</TableHead>
                      <TableHead className="text-right">Preço</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selecionado.itens?.map((it, i) => (
                      <TableRow key={i}>
                        <TableCell>{it.nome ?? it.produto_id}</TableCell>
                        <TableCell className="text-center">{it.qty}</TableCell>
                        <TableCell className="text-right">{formatBRL(it.preco)}</TableCell>
                        <TableCell className="text-right">{formatBRL(it.subtotal)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex flex-col items-end gap-1 text-sm">
                <div>Subtotal: <strong>{formatBRL(selecionado.subtotal)}</strong></div>
                <div>Frete: <strong>{formatBRL(selecionado.frete)}</strong></div>
                <div className="text-base">Total: <strong className="text-primary">{formatBRL(selecionado.total)}</strong></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edição */}
      <Dialog open={!!editando} onOpenChange={(o) => !o && setEditando(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Alterar Pedido</DialogTitle>
          </DialogHeader>
          {editando && (
            <div className="space-y-4">
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead className="w-24 text-center">Qtd</TableHead>
                      <TableHead className="w-32 text-right">Preço</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {editando.itens?.map((it, i) => (
                      <TableRow key={i}>
                        <TableCell>{it.nome ?? it.produto_id}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={1}
                            value={it.qty}
                            onChange={(e) => atualizarItemEdit(i, "qty", e.target.value)}
                            className="h-8 text-center"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={it.preco}
                            onChange={(e) => atualizarItemEdit(i, "preco", e.target.value)}
                            className="h-8 text-right"
                          />
                        </TableCell>
                        <TableCell className="text-right">{formatBRL((it.preco || 0) * (it.qty || 0))}</TableCell>
                        <TableCell>
                          <Button size="icon" variant="ghost" onClick={() => removerItemEdit(i)} className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <label className="text-muted-foreground">CEP</label>
                  <Input value={editando.cep ?? ""} onChange={(e) => setEditando({ ...editando, cep: e.target.value })} />
                </div>
                <div>
                  <label className="text-muted-foreground">Frete (R$)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editando.frete}
                    onChange={(e) => {
                      const frete = Number(e.target.value) || 0;
                      const r = recalcular(editando.itens, frete);
                      setEditando({ ...editando, frete, subtotal: r.subtotal, total: r.total, itens: r.itens });
                    }}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-muted-foreground">Status</label>
                  <select
                    value={editando.status}
                    onChange={(e) => setEditando({ ...editando, status: e.target.value })}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  >
                    <option value="pendente">pendente</option>
                    <option value="concluido">concluido</option>
                    <option value="cancelado">cancelado</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 text-sm">
                <div>Subtotal: <strong>{formatBRL(editando.subtotal)}</strong></div>
                <div>Total: <strong className="text-primary">{formatBRL(editando.total)}</strong></div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditando(null)}>Cancelar</Button>
            <Button onClick={salvarEdicao} disabled={busy}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminPedidos;
