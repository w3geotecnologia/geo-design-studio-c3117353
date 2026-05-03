import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
};

const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const Checkout = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const produtoId = params.get("produto");
  const [produto, setProduto] = useState<Produto | null>(null);
  const [loading, setLoading] = useState(true);
  const [cep, setCep] = useState("");
  const [frete, setFrete] = useState<number | null>(null);
  const [calculandoFrete, setCalculandoFrete] = useState(false);

  useEffect(() => {
    (async () => {
      if (!produtoId) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("produtos")
        .select("id,nome,imagem_url,preco,preco_original,estoque,esgotado")
        .eq("id", produtoId)
        .maybeSingle();
      setProduto(data as Produto | null);
      setLoading(false);
    })();
  }, [produtoId]);

  const subtotal = produto?.preco ?? 0;
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
        // Cálculo simples baseado em UF
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

  const finalizarCompra = () => {
    const clienteId = localStorage.getItem("cliente_id");
    if (!clienteId) {
      toast({
        title: "Cadastro necessário",
        description: "Você precisa se cadastrar para finalizar a compra.",
      });
      navigate(`/cadastro?redirect=/checkout?produto=${produtoId}`);
      return;
    }
    localStorage.removeItem("cliente_id");
    toast({
      title: "Pedido recebido!",
      description: "Em breve entraremos em contato para concluir o pagamento.",
    });
    navigate("/");
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
          <p className="text-muted-foreground">Carregando produto...</p>
        ) : !produto ? (
          <div className="bg-card rounded-xl p-8 text-center">
            <p className="text-muted-foreground mb-4">Produto não encontrado.</p>
            <Button onClick={() => navigate("/#produtos")}>Voltar aos produtos</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Produto + Frete */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-xl shadow-sm p-6">
                <h2 className="font-heading font-semibold text-lg mb-4">Item do Pedido</h2>
                <div className="flex gap-4">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white rounded-lg border overflow-hidden flex items-center justify-center shrink-0">
                    {produto.imagem_url ? (
                      <img
                        src={produto.imagem_url}
                        alt={produto.nome ?? ""}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">Sem imagem</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{produto.nome}</h3>
                    {produto.preco_original != null &&
                      produto.preco != null &&
                      produto.preco_original > produto.preco && (
                        <span className="text-xs text-muted-foreground line-through block mt-1">
                          {formatBRL(produto.preco_original)}
                        </span>
                      )}
                    <p className="text-xl font-bold text-primary mt-1">
                      {produto.preco != null ? formatBRL(produto.preco) : "Sob consulta"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Quantidade: 1</p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl shadow-sm p-6">
                <h2 className="font-heading font-semibold text-lg mb-4">Frete</h2>
                <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                  <div className="flex-1">
                    <Label htmlFor="cep">CEP de entrega</Label>
                    <Input
                      id="cep"
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      placeholder="00000-000"
                      maxLength={9}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={calcularFrete}
                    disabled={calculandoFrete}
                  >
                    {calculandoFrete ? "Calculando..." : "Calcular Frete"}
                  </Button>
                </div>
                {frete !== null && (
                  <p className="text-sm text-foreground mt-3">
                    Valor do frete: <strong>{formatBRL(frete)}</strong>
                  </p>
                )}
              </div>
            </div>

            {/* Resumo */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl shadow-sm p-6 sticky top-4">
                <h2 className="font-heading font-semibold text-lg mb-4">Resumo</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
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
      <Footer />
    </div>
  );
};

export default Checkout;
