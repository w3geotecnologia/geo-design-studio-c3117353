import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

type Produto = {
  id: string;
  nome: string | null;
  imagem_url: string | null;
  preco: number | null;
  preco_original: number | null;
  estoque: number | null;
  esgotado: boolean | null;
  descricao: string | null;
};

type CartItem = { produtoId: string; qty: number };

const CART_KEY = "checkout_cart";

const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const loadCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
};

const saveCart = (cart: CartItem[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

const Checkout = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const produtoIdParam = params.get("produto");

  const [cart, setCart] = useState<CartItem[]>([]);
  const [produtos, setProdutos] = useState<Record<string, Produto>>({});
  const [loading, setLoading] = useState(true);
  const [cep, setCep] = useState("");
  const [frete, setFrete] = useState<number | null>(null);
  const [calculandoFrete, setCalculandoFrete] = useState(false);
  const [showQuickRegister, setShowQuickRegister] = useState(false);
  const [quickForm, setQuickForm] = useState({ nome: "", email: "", telefone: "" });
  const [savingQuick, setSavingQuick] = useState(false);

  // Inicializa carrinho: combina o existente + produto novo via URL
  useEffect(() => {
    const existing = loadCart();
    let next = existing;
    if (produtoIdParam) {
      const found = existing.find((i) => i.produtoId === produtoIdParam);
      if (found) {
        next = existing.map((i) =>
          i.produtoId === produtoIdParam ? { ...i, qty: i.qty + 1 } : i,
        );
      } else {
        next = [...existing, { produtoId: produtoIdParam, qty: 1 }];
      }
      saveCart(next);
      // limpa o parâmetro da URL para evitar duplicar ao recarregar
      window.history.replaceState({}, "", "/checkout");
    }
    setCart(next);
  }, [produtoIdParam]);

  // Carrega dados dos produtos do carrinho
  useEffect(() => {
    (async () => {
      if (cart.length === 0) {
        setProdutos({});
        setLoading(false);
        return;
      }
      const ids = cart.map((c) => c.produtoId);
      const { data } = await supabase
        .from("produtos")
        .select("id,nome,imagem_url,preco,preco_original,estoque,esgotado,descricao")
        .in("id", ids);
      const map: Record<string, Produto> = {};
      (data ?? []).forEach((p: any) => (map[p.id] = p as Produto));
      setProdutos(map);
      setLoading(false);
    })();
  }, [cart]);

  const updateQty = (produtoId: string, delta: number) => {
    setCart((prev) => {
      const next = prev
        .map((i) => {
          if (i.produtoId !== produtoId) return i;
          const prod = produtos[produtoId];
          const max = prod?.estoque ?? 999;
          const novo = Math.min(Math.max(i.qty + delta, 1), max);
          if (delta > 0 && i.qty >= max) {
            toast({
              title: "Estoque insuficiente",
              description: `Apenas ${max} unidade(s) disponível(is).`,
              variant: "destructive",
            });
          }
          return { ...i, qty: novo };
        });
      saveCart(next);
      return next;
    });
  };

  const removeItem = (produtoId: string) => {
    setCart((prev) => {
      const next = prev.filter((i) => i.produtoId !== produtoId);
      saveCart(next);
      return next;
    });
  };

  const subtotal = useMemo(
    () =>
      cart.reduce((acc, i) => {
        const preco = produtos[i.produtoId]?.preco ?? 0;
        return acc + preco * i.qty;
      }, 0),
    [cart, produtos],
  );
  const total = useMemo(() => subtotal + (frete ?? 0), [subtotal, frete]);

  const calcularFrete = async () => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) {
      toast({ title: "CEP inválido", description: "Informe um CEP com 8 dígitos.", variant: "destructive" });
      return;
    }
    setCalculandoFrete(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();
      if (data.erro) {
        toast({ title: "CEP não encontrado", variant: "destructive" });
        setFrete(null);
      } else {
        const uf = (data.uf || "").toUpperCase();
        const valor = uf === "SP" ? 25.0 : ["RJ", "MG", "PR", "SC", "RS", "ES"].includes(uf) ? 45.0 : 75.0;
        setFrete(valor);
        toast({ title: "Frete calculado", description: `${data.localidade}/${uf}` });
      }
    } catch {
      toast({ title: "Erro ao calcular frete", variant: "destructive" });
    } finally {
      setCalculandoFrete(false);
    }
  };

  const gravarPedido = async (clienteId: string) => {
    const itens = cart.map((i) => {
      const p = produtos[i.produtoId];
      return {
        produto_id: i.produtoId,
        nome: p?.nome ?? null,
        preco: p?.preco ?? 0,
        qty: i.qty,
        subtotal: (p?.preco ?? 0) * i.qty,
      };
    });
    const { error } = await supabase.from("pedidos").insert({
      cliente_id: clienteId,
      itens,
      subtotal,
      frete: frete ?? 0,
      total,
      cep: cep || null,
      status: "pendente",
    });
    if (error) {
      toast({
        title: "Erro ao registrar pedido",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const concluirPedido = async (clienteIdParam?: string) => {
    const clienteId = clienteIdParam ?? localStorage.getItem("cliente_id");
    if (clienteId) await gravarPedido(clienteId);
    localStorage.removeItem("cliente_id");
    localStorage.removeItem(CART_KEY);
    setCart([]);
    toast({
      title: "Pedido recebido!",
      description: "Em breve entraremos em contato para concluir o pagamento.",
    });
    navigate("/");
  };

  const finalizarCompra = () => {
    if (cart.length === 0) {
      toast({ title: "Carrinho vazio", variant: "destructive" });
      return;
    }
    const clienteId = localStorage.getItem("cliente_id");
    if (!clienteId) {
      setShowQuickRegister(true);
      return;
    }
    concluirPedido();
  };

  const limparCarrinho = () => {
    localStorage.removeItem(CART_KEY);
    setCart([]);
    toast({ title: "Carrinho esvaziado" });
  };

  const salvarCadastroRapido = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickForm.nome.trim() || !quickForm.email.trim() || !quickForm.telefone.trim()) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }
    setSavingQuick(true);
    const payload = {
      nome: quickForm.nome,
      email: quickForm.email,
      telefone: quickForm.telefone,
      documento: "",
      endereco: "",
      numero: "",
      cep: "",
      bairro: "",
      cidade: "",
      estado: "",
    };
    const { data, error } = await supabase
      .from("cadastro_clientes")
      .insert(payload)
      .select("id")
      .single();
    setSavingQuick(false);
    if (error) {
      toast({ title: "Erro ao cadastrar", description: error.message, variant: "destructive" });
      return;
    }
    const novoId = data?.id ? String(data.id) : null;
    if (novoId) localStorage.setItem("cliente_id", novoId);
    setShowQuickRegister(false);
    await concluirPedido(novoId ?? undefined);
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/40">
      <TopBar />
      <Navbar />
      <main className="flex-1 container py-10">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-6">
          Finalização de Compra
        </h1>

        {loading ? (
          <p className="text-muted-foreground">Carregando...</p>
        ) : cart.length === 0 ? (
          <div className="bg-card rounded-xl p-8 text-center">
            <p className="text-muted-foreground mb-4">Seu carrinho está vazio.</p>
            <Button onClick={() => navigate("/#produtos")}>Ver produtos</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Itens + Frete */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-xl shadow-sm p-6">
                <h2 className="font-heading font-semibold text-lg mb-4">
                  Itens do Pedido ({cart.length})
                </h2>
                <div className="space-y-6">
                  {cart.map((item) => {
                    const p = produtos[item.produtoId];
                    if (!p) return null;
                    const max = p.estoque ?? 0;
                    return (
                      <div
                        key={item.produtoId}
                        className="pb-6 border-b last:border-b-0 last:pb-0"
                      >
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="w-full sm:w-56 h-56 bg-white rounded-lg border overflow-hidden flex items-center justify-center shrink-0">
                            {p.imagem_url ? (
                              <img
                                src={p.imagem_url}
                                alt={p.nome ?? ""}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <span className="text-xs text-muted-foreground">Sem imagem</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col">
                            <h3 className="font-semibold text-foreground">{p.nome}</h3>
                            {p.preco_original != null &&
                              p.preco != null &&
                              p.preco_original > p.preco && (
                                <span className="text-xs text-muted-foreground line-through block mt-1">
                                  {formatBRL(p.preco_original)}
                                </span>
                              )}
                            <p className="text-xl font-bold text-primary mt-1">
                              {p.preco != null ? formatBRL(p.preco) : "Sob consulta"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {max > 0 ? `${max} em estoque` : "Sem estoque"}
                            </p>

                            <div className="flex items-center gap-3 mt-3">
                              <div className="flex items-center border rounded-md">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQty(item.produtoId, -1)}
                                  disabled={item.qty <= 1}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="w-10 text-center text-sm font-semibold">
                                  {item.qty}
                                </span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQty(item.produtoId, 1)}
                                  disabled={item.qty >= max}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.produtoId)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Remover
                              </Button>
                            </div>

                            <p className="text-sm text-muted-foreground mt-2">
                              Subtotal:{" "}
                              <strong className="text-foreground">
                                {formatBRL((p.preco ?? 0) * item.qty)}
                              </strong>
                            </p>
                            <a
                              href={`#desc-${item.produtoId}`}
                              className="text-sm text-primary hover:underline mt-1 self-start"
                            >
                              Ver descrição completa →
                            </a>
                          </div>
                        </div>

                        <div
                          id={`desc-${item.produtoId}`}
                          className="mt-4 bg-muted/30 rounded-lg p-4 scroll-mt-24"
                        >
                          <h4 className="font-heading font-semibold text-sm text-foreground mb-2">
                            Descrição completa
                          </h4>
                          {p.descricao ? (
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {p.descricao}
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">
                              Sem descrição disponível para este produto.
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>


            {/* Resumo */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl shadow-sm p-6 sticky top-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading font-semibold text-lg">Resumo</h2>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={limparCarrinho}
                    className="text-destructive hover:text-destructive h-8 px-2"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Limpar
                  </Button>
                </div>
                <div className="space-y-2 text-sm">
                  {cart.map((item) => {
                    const p = produtos[item.produtoId];
                    if (!p) return null;
                    return (
                      <div key={item.produtoId} className="flex justify-between text-xs">
                        <span className="text-muted-foreground truncate pr-2">
                          {p.nome} × {item.qty}
                        </span>
                        <span className="text-foreground shrink-0">
                          {formatBRL((p.preco ?? 0) * item.qty)}
                        </span>
                      </div>
                    );
                  })}
                  <div className="border-t pt-2 mt-2 flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">{formatBRL(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-muted-foreground">Frete</span>
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="0,00"
                      className="h-8 w-28 text-right"
                      value={frete === null ? "" : frete.toString().replace(".", ",")}
                      onChange={(e) => {
                        const v = e.target.value.replace(/[^\d,.-]/g, "").replace(",", ".");
                        if (v === "") setFrete(null);
                        else {
                          const n = parseFloat(v);
                          setFrete(isNaN(n) ? null : n);
                        }
                      }}
                    />
                  </div>
                  <div className="border-t pt-3 mt-3 flex justify-between text-base">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="font-bold text-primary text-lg">{formatBRL(total)}</span>
                  </div>
                </div>
                <Button
                  className="w-full mt-6 bg-primary text-primary-foreground font-semibold"
                  onClick={finalizarCompra}
                >
                  Finalizar Compra
                </Button>
                <button
                  type="button"
                  onClick={() => navigate("/#produtos")}
                  className="w-full text-center text-primary text-sm hover:underline mt-3"
                >
                  ← Continuar comprando
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Dialog open={showQuickRegister} onOpenChange={setShowQuickRegister}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cadastro rápido</DialogTitle>
            <DialogDescription>
              Informe seus dados para finalizar a compra.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={salvarCadastroRapido} className="space-y-3">
            <div>
              <Label htmlFor="q-nome">Nome</Label>
              <Input
                id="q-nome"
                value={quickForm.nome}
                onChange={(e) => setQuickForm({ ...quickForm, nome: e.target.value })}
                placeholder="Seu nome"
              />
            </div>
            <div>
              <Label htmlFor="q-email">E-mail</Label>
              <Input
                id="q-email"
                type="email"
                value={quickForm.email}
                onChange={(e) => setQuickForm({ ...quickForm, email: e.target.value })}
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <Label htmlFor="q-tel">Telefone</Label>
              <Input
                id="q-tel"
                value={quickForm.telefone}
                onChange={(e) => setQuickForm({ ...quickForm, telefone: e.target.value })}
                placeholder="(19) 99999-9999"
              />
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={async () => {
                  // se já preencheu algo no cadastro rápido, salva primeiro para edição
                  if (
                    !localStorage.getItem("cliente_id") &&
                    (quickForm.nome || quickForm.email || quickForm.telefone)
                  ) {
                    const { data } = await supabase
                      .from("cadastro_clientes")
                      .insert({
                        nome: quickForm.nome,
                        email: quickForm.email,
                        telefone: quickForm.telefone,
                        documento: "",
                        endereco: "",
                        numero: "",
                        cep: "",
                        bairro: "",
                        cidade: "",
                        estado: "",
                      })
                      .select("id")
                      .single();
                    if (data?.id) localStorage.setItem("cliente_id", String(data.id));
                  }
                  setShowQuickRegister(false);
                  navigate(`/cadastro?redirect=/checkout`);
                }}
              >
                Cadastro completo
              </Button>
              <Button type="submit" disabled={savingQuick}>
                {savingQuick ? "Salvando..." : "Finalizar Compra"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Checkout;
