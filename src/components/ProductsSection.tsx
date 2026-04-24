import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

type Product = {
  name: string;
  image: string;
  originalPrice?: string;
  price: string;
  soldOut?: boolean;
  link: string;
};

const products: Product[] = [
  {
    name: "Bateria Receptor Gps Topcon Hiper II, Srx Grx 7.2V 5600mAh",
    image: "https://w3-geotecnologia.com.br/wp-content/uploads/2023/08/bateria_hiperII-450x450.jpg",
    originalPrice: "R$ 630,00",
    price: "R$ 600,00",
    soldOut: true,
    link: "https://w3-geotecnologia.com.br/produto/bateria-topcon-hiperii-grx1/",
  },
  {
    name: "Bateria Coletora Topcon FC 100 200 250",
    image: "https://w3-geotecnologia.com.br/wp-content/uploads/2023/08/tos-tc033.jpg",
    originalPrice: "R$ 670,00",
    price: "R$ 645,00",
    soldOut: true,
    link: "https://w3-geotecnologia.com.br/produto/bateri-topcon-fc250/",
  },
  {
    name: "Cabo de Rádio Pacific Crest UHF para Receptores Topcon",
    image: "https://w3-geotecnologia.com.br/wp-content/uploads/2025/05/231-450x450.jpg",
    originalPrice: "R$ 840,00",
    price: "R$ 695,00",
    link: "https://w3-geotecnologia.com.br/produto/cabo-de-radio-pacific-crest-uhf-para-receptores-topcon/",
  },
  {
    name: "Cabo Rádio RTK UHF Pacific Crest para GPS Trimble",
    image: "https://w3-geotecnologia.com.br/wp-content/uploads/2025/05/Cabo_radio_Trimble01-450x420.jpg",
    originalPrice: "R$ 670,00",
    price: "R$ 595,00",
    soldOut: true,
    link: "https://w3-geotecnologia.com.br/produto/cabo-radio-rtk-uhf-pacific-crest-para-gps-trimble/",
  },
  {
    name: "Bateria Hiper Topcon",
    image: "https://w3-geotecnologia.com.br/wp-content/uploads/2023/08/img_bathiper_g1-450x450.jpg",
    originalPrice: "R$ 290,00",
    price: "R$ 285,00",
    soldOut: true,
    link: "https://w3-geotecnologia.com.br/produto/bateria-hipe-topcon/",
  },
  {
    name: "GR-5 Topcon",
    image: "https://w3-geotecnologia.com.br/wp-content/uploads/2025/05/gnss_gr5_-450x450.webp",
    price: "Sob consulta",
    soldOut: true,
    link: "https://w3-geotecnologia.com.br/produto/gr5-topcon/",
  },
  {
    name: "Carregador Topcon Hiper Gr-3 Gr-5 Conector 5 Pinos",
    image: "https://w3-geotecnologia.com.br/wp-content/uploads/2023/08/caregador_topconGR3-450x450.jpg",
    originalPrice: "R$ 620,00",
    price: "R$ 595,00",
    soldOut: true,
    link: "https://w3-geotecnologia.com.br/produto/carregado-topcon-gr3-hiper/",
  },
  {
    name: "Atendente Especializado",
    image: "https://w3-geotecnologia.com.br/wp-content/uploads/2025/05/atendente-1.png",
    price: "Fale conosco",
    link: "https://w3-geotecnologia.com.br/produto/atendente/",
  },
];

const ProductsSection = () => (
  <section id="produtos" className="py-20 bg-background">
    <div className="container">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
          Alguns produtos e Acessórios
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Mais vendidos · À venda · Equipamentos de alta precisão das melhores marcas do mercado
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="relative border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all group bg-card flex flex-col"
          >
            {p.soldOut && (
              <span className="absolute top-3 left-3 z-10 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
                Esgotado
              </span>
            )}
            <div className="aspect-square bg-white overflow-hidden flex items-center justify-center">
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-heading font-semibold text-sm text-foreground mb-3 line-clamp-2 min-h-[2.5rem]">
                {p.name}
              </h3>
              <div className="mb-4">
                {p.originalPrice && (
                  <span className="text-xs text-muted-foreground line-through mr-2">
                    {p.originalPrice}
                  </span>
                )}
                <span className="text-base font-bold text-primary">{p.price}</span>
              </div>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="mt-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <a href={p.link} target="_blank" rel="noopener noreferrer">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {p.soldOut ? "Leia mais" : "Solicitar Orçamento"}
                </a>
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProductsSection;
