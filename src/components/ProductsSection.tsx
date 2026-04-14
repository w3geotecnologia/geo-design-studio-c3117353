import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

const products = [
  { name: "GPS/GNSS RTK", price: "Sob consulta", category: "Receptores" },
  { name: "Estação Total", price: "Sob consulta", category: "Topografia" },
  { name: "Nível Laser", price: "Sob consulta", category: "Nivelamento" },
  { name: "Drone Profissional", price: "Sob consulta", category: "Aerofotogrametria" },
  { name: "Acessórios GPS", price: "A partir de R$ 199", category: "Acessórios" },
  { name: "Bastão e Bipé", price: "A partir de R$ 349", category: "Acessórios" },
];

const ProductsSection = () => (
  <section id="produtos" className="py-20 bg-background">
    <div className="container">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">Produtos</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Equipamentos de alta precisão das melhores marcas do mercado
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="border border-border rounded-xl p-6 hover:border-primary/40 hover:shadow-lg transition-all group"
          >
            <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">{p.category}</span>
            <h3 className="font-heading font-bold text-lg text-foreground mt-4 mb-2">{p.name}</h3>
            <p className="text-muted-foreground text-sm mb-5">{p.price}</p>
            <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
              <ShoppingCart className="w-4 h-4 mr-2" /> Solicitar Orçamento
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProductsSection;
