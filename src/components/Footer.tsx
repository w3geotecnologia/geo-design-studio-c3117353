import logoW3Geo from "@/assets/logo.png";

const enderecoQuery = encodeURIComponent(
  "Rua Dom Geraldo Maria de Moraes Penido, 85 - Jd. Regente, Indaiatuba - SP, 13336-331"
);

const Footer = () => (
  <footer id="footer" className="bg-primary-darker text-primary-foreground">
    {/* Faixa branca com logo + links no topo do rodapé */}
    <div className="bg-white border-b border-border">
      <div className="container py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <img
          src={logoW3Geo}
          alt="W3 Geo-Tecnologias"
          className="h-12 w-auto object-contain"
        />
        <nav className="flex flex-wrap items-center justify-center gap-4 text-sm text-foreground/70">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="hover:text-primary transition-colors"
          >
            Início
          </a>
          <span className="text-foreground/30">|</span>
          <a href="/sobre" className="hover:text-primary transition-colors">Sobre</a>
          <span className="text-foreground/30">|</span>
          <a href="/termos" className="hover:text-primary transition-colors">Termos e condições</a>
          <span className="text-foreground/30">|</span>
          <a href="/privacidade" className="hover:text-primary transition-colors">Política de privacidade</a>
        </nav>
      </div>
    </div>

    <div className="container py-14">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10 items-start">
        <div>
          <h4 className="font-heading font-bold mb-4">Localização</h4>
          <p className="text-sm text-primary-foreground/80 leading-relaxed">
            Rua Dom Geraldo Maria de Moraes Penido, 85<br />
            Jd. Regente - Indaiatuba - SP<br />
            CEP: 13.336-331
          </p>

          <h4 className="font-heading font-bold mt-6 mb-3">Nossos Telefones</h4>
          <div className="text-sm text-primary-foreground/80 leading-relaxed space-y-1">
            <p><span className="text-primary-foreground/60">Administrativo:</span> <a href="tel:+5519996309627" className="hover:text-white transition-colors">(19) 99630-9627</a></p>
            <p><span className="text-primary-foreground/60">Assistência Técnica:</span> <a href="tel:+5519989776474" className="hover:text-white transition-colors">(19) 98977-6474</a></p>
            <p><span className="text-primary-foreground/60">Suporte Técnico:</span> <a href="tel:+5519994757175" className="hover:text-white transition-colors">(19) 99475-7175</a></p>
            <p><span className="text-primary-foreground/60">Coord. Técnica:</span> <a href="tel:+5519991531218" className="hover:text-white transition-colors">(19) 99153-1218</a></p>
          </div>
        </div>
        <div className="rounded-lg overflow-hidden shadow-lg border border-primary-foreground/10">
          <iframe
            title="Mapa - Negócio Topográfico"
            src={`https://www.google.com/maps?q=${enderecoQuery}&output=embed`}
            width="100%"
            height="240"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>

      <div className="border-t border-primary-foreground/15 pt-6 text-center text-sm text-primary-foreground/60">
        © {new Date().getFullYear()} W3 Geo-Tecnologias. Todos os direitos reservados.
      </div>
    </div>
  </footer>
);

export default Footer;
