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
  </section>
);

export default HeroSection;
