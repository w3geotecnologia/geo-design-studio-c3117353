import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

type Produto = {
  id: string;
  nome: string | null;
  categoria: string | null;
  imagem_url: string | null;
  preco_original: number | null;
  preco: number | null;
  esgotado: boolean | null;
  link_externo: string | null;
  estoque: number | null;
};

const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const ProductsSection = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("produtos")
        .select("id,nome,categoria,imagem_url,preco_original,preco,esgotado,estoque,link_externo")
        .eq("ativo", true)
        .order("nome", { ascending: true });
      setProdutos(data ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <section id="produtos" className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            Alguns produtos e Acessórios
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Equipamentos de alta precisão das melhores marcas do mercado
          </p>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">Carregando produtos...</p>
        ) : produtos.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Nenhum produto cadastrado no momento.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {produtos.map((p, i) => {
              const indisponivel = p.esgotado || (p.estoque ?? 0) <= 0;
              const action = indisponivel && p.link_externo ? (
                <a href={p.link_externo} target="_blank" rel="noopener noreferrer">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Leia mais
                </a>
              ) : indisponivel ? (
                <a href="/orcamento">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Solicitar Orçamento
                </a>
              ) : (
                <a href={`/checkout?produto=${p.id}`}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Comprar
                </a>
              );

              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="relative border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all group bg-card flex flex-col"
                >
                  {p.esgotado && (
                    <span className="absolute top-3 left-3 z-10 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
                      Esgotado
                    </span>
                  )}
                  <div className="aspect-square bg-white overflow-hidden flex items-center justify-center">
                    {p.imagem_url ? (
                      <img
                        src={p.imagem_url}
                        alt={p.nome ?? ""}
                        loading="lazy"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="text-muted-foreground text-sm">Sem imagem</div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    {p.categoria && (
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full self-start mb-2">
                        {p.categoria}
                      </span>
                    )}
                    <h3 className="font-heading font-semibold text-sm text-foreground mb-3 line-clamp-2 min-h-[2.5rem]">
                      {p.nome}
                    </h3>
                    <div className="mb-2">
                      {p.preco_original != null && p.preco != null && p.preco_original > p.preco && (
                        <span className="text-xs text-muted-foreground line-through mr-2">
                          {formatBRL(p.preco_original)}
                        </span>
                      )}
                      <span className="text-base font-bold text-primary">
                        {p.preco != null ? formatBRL(p.preco) : "Sob consulta"}
                      </span>
                    </div>
                    <div className="mb-3">
                      {(p.estoque ?? 0) > 0 && !p.esgotado ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
                          <span className="h-2 w-2 rounded-full bg-green-600" />
                          Disponível ({p.estoque} em estoque)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-destructive">
                          <span className="h-2 w-2 rounded-full bg-destructive" />
                          Fora de estoque
                        </span>
                      )}
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="mt-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {action}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
