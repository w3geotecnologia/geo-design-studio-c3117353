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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

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

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("pedidos")
        .select(
          "id,cliente_id,itens,subtotal,frete,total,cep,status,criado_em,cadastro_clientes(id,nome,email,telefone)",
        )
        .order("criado_em", { ascending: false });
      if (!error) setPedidos((data as any) ?? []);
      setLoading(false);
    })();
  }, []);

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
                  <TableCell className="font-medium">
                    {p.cadastro_clientes?.nome ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div>{p.cadastro_clientes?.email ?? "—"}</div>
                    <div>{p.cadastro_clientes?.telefone ?? "—"}</div>
                  </TableCell>
                  <TableCell>{p.itens?.length ?? 0}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatBRL(p.total)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{p.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => setSelecionado(p)}>
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={!!selecionado} onOpenChange={(o) => !o && setSelecionado(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido</DialogTitle>
          </DialogHeader>
          {selecionado && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Cliente</p>
                  <p className="font-semibold">
                    {selecionado.cadastro_clientes?.nome ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Data</p>
                  <p className="font-semibold">
                    {new Date(selecionado.criado_em).toLocaleString("pt-BR")}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">E-mail</p>
                  <p>{selecionado.cadastro_clientes?.email ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Telefone</p>
                  <p>{selecionado.cadastro_clientes?.telefone ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">CEP</p>
                  <p>{selecionado.cep ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p>{selecionado.status}</p>
                </div>
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
                <div className="text-base">
                  Total: <strong className="text-primary">{formatBRL(selecionado.total)}</strong>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminPedidos;
