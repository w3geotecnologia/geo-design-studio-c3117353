import heroImg from "@/assets/hero-banner.png";

const HeroSection = () => (
  <section
    className="relative w-full overflow-hidden bg-background"
    aria-label="W3 GeoTecnologias - Tecnologia de Precisão em equipamentos de geotecnologia"
  >
    <div
      className="h-[clamp(260px,31vw,430px)] w-full bg-cover bg-center bg-no-repeat sm:h-[clamp(300px,31vw,430px)]"
      style={{ backgroundImage: `url(${heroImg})` }}
      role="img"
      aria-label="Banner W3 GeoTecnologias"
    />
    <div className="bg-primary py-6 md:py-8">
      <div className="container text-center">
        <p className="text-primary-foreground text-lg md:text-xl lg:text-2xl font-heading font-bold leading-relaxed">
          Mais de 20 anos oferecendo serviços e soluções em sistemas de geotecnologia com qualidade e precisão.
        </p>
      </div>
    </div>
  </section>
);

export default HeroSection;

export default HeroSection;
