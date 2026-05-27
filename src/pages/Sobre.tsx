import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Phone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Sobre = () => (
  <div className="min-h-screen flex flex-col">
    <TopBar />
    <Navbar />
    <main className="flex-1 py-16">
      <div className="container max-w-4xl">
        <Button asChild variant="outline" size="sm" className="mb-6">
          <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao site</Link>
        </Button>
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-foreground mb-8">
          Sobre a W3-Geotecnologia
        </h1>
        <div className="space-y-6 text-foreground/80 text-base md:text-lg leading-relaxed">
          <p>
            Há mais de 20 anos, a <strong>W3-Geotecnologia</strong> é referência em assistência
            técnica especializada para equipamentos GPS e GNSS, oferecendo soluções completas com
            qualidade, precisão e confiança.
          </p>
          <p>
            Atuamos com manutenção, calibração, atualização e suporte técnico para as principais
            marcas do mercado, incluindo <strong>Topcon, Trimble, Sokkia</strong> e diversos modelos
            chineses.
          </p>
          <p>
            Nossa equipe técnica altamente capacitada trabalha com agilidade e excelência para
            garantir o melhor desempenho e a máxima confiabilidade dos seus equipamentos em campo.
          </p>
          <p>
            Atendemos profissionais e empresas dos setores de topografia, agricultura de precisão,
            georreferenciamento e construção civil, sempre com foco em soluções eficientes e
            suporte especializado.
          </p>
          <div className="border-l-4 border-primary pl-6 py-2 my-8 bg-secondary/40 rounded-r">
            <p className="font-heading font-bold text-xl text-foreground">W3-Geotecnologia</p>
            <p className="text-muted-foreground italic">
              Precisão em tecnologia. Confiança em cada serviço.
            </p>
          </div>
          <p className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary" />
            Entre em contato e descubra como podemos ajudar no sucesso do seu projeto.
          </p>
        </div>
        <div className="mt-10">
          <Button asChild>
            <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao site</Link>
          </Button>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Sobre;
