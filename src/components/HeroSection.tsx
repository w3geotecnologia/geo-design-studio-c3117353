import { ArrowRight, Wrench } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-equipment.jpg";

const HeroSection = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary-darker min-h-[600px] flex items-center">
    {/* Background image */}
    <div className="absolute inset-0">
      <img src={heroImg} alt="Equipamentos de geotecnologia" className="w-full h-full object-cover opacity-30 mix-blend-luminosity" width={1920} height={1080} />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-darker/95 via-primary-dark/80 to-transparent" />
    </div>

    <div className="container relative z-10 py-20">
      <div className="max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-5 py-2 mb-8"
        >
          <Wrench className="w-4 h-4 text-accent" />
          <span className="text-primary-foreground text-sm font-medium">+20 anos de experiência</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold leading-tight mb-6"
        >
          <span className="text-primary-foreground">Tecnologia de </span>
          <span className="text-gradient">Precisão</span>
          <span className="text-primary-foreground"> em Geotecnologia</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-primary-foreground/85 text-lg md:text-xl leading-relaxed mb-10 max-w-xl"
        >
          Assistência técnica especializada em GPS, GNSS, estações totais e drones. Produtos, acessórios e serviços com a credibilidade de quem entende do assunto.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap gap-4"
        >
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-base px-8 py-6 rounded-lg shadow-lg">
            Obtenha um Orçamento <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-bold text-base px-8 py-6 rounded-lg">
            <Wrench className="mr-2 w-5 h-5" /> Nossos Serviços
          </Button>
        </motion.div>
      </div>
    </div>
  </section>
);

export default HeroSection;
