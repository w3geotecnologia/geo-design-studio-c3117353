import { Wrench, MapPin, Cpu, Plane } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const services = [
  {
    icon: Wrench,
    title: "Assistência Técnica",
    description: "Manutenção preventiva e corretiva em equipamentos de topografia e geodésia.",
  },
  {
    icon: MapPin,
    title: "Locação de Equipamentos",
    description: "Aluguel de GPS, GNSS, estações totais e níveis para seus projetos.",
  },
  {
    icon: Cpu,
    title: "Calibração & Certificação",
    description: "Serviços de calibração com certificado rastreável e laudos técnicos.",
  },
  {
    icon: Plane,
    title: "Drones & Aerofotogrametria",
    description: "Mapeamento aéreo com drones profissionais e processamento de imagens.",
  },
];

const ServicesSection = () => {
  const navigate = useNavigate();
  return (
  <section id="servicos" className="py-20 bg-section-light">
    <div className="container">
      <div className="flex justify-start mb-8">
        <Button
          onClick={() => navigate("/orcamento")}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6"
        >
          Solicitação de Serviços
        </Button>
      </div>
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">Nossos Serviços</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Soluções completas em geotecnologia para sua empresa ou projeto
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-card rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow group"
          >
            <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-5 group-hover:bg-primary transition-colors">
              <s.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
            </div>
            <h3 className="font-heading font-bold text-lg text-foreground mb-3">{s.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{s.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
  );
};

export default ServicesSection;
