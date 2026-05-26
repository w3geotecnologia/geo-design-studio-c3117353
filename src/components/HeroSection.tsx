import heroImg from "@/assets/hero-banner.png";

const HeroSection = () => (
  <section className="bg-background">
    <div className="container py-6">
      <img
        src={heroImg}
        alt="W3 GeoTecnologias - Tecnologia de Precisão em equipamentos de geotecnologia"
        className="w-full h-auto block"
        width={1254}
        height={391}
        loading="eager"
      />
    </div>
  </section>
);

export default HeroSection;
