import parceiroLogo from "@/assets/parceiro-negociotopografico.jpeg";

const Footer = () => (
  <footer id="footer" className="bg-primary-darker text-primary-foreground py-14">
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
        <div>
          <img
            src={parceiroLogo}
            alt="Negócio Topográfico"
            className="h-20 w-auto object-contain mb-4"
          />
          <p className="text-primary-foreground/70 text-sm leading-relaxed">
            Mais de 20 anos oferecendo soluções em geotecnologia com qualidade e precisão.
          </p>
        </div>
        <div>
          <h4 className="font-heading font-bold mb-4">Links Rápidos</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            {[
              { label: "Início", href: "/" },
              { label: "Serviços", href: "/#servicos" },
              { label: "Produtos", href: "/#produtos" },
              { label: "Contato", href: "/#contato" },
              { label: "Localização", href: "/#footer" },
            ].map((l) => (
              <li key={l.label}><a href={l.href} className="hover:text-primary-foreground transition-colors">{l.label}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-heading font-bold mb-4">Localização</h4>
          <p className="text-sm text-primary-foreground/70 leading-relaxed">
            Rua Dom Geraldo Maria de Moraes Penido, 85<br />
            Jd. Regente - Indaiatuba - SP<br />
            CEP: 13.336-331
          </p>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15 pt-6">
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-primary-foreground/50 mb-4">
          <a href="/" className="hover:text-primary-foreground transition-colors">Início</a>
          <span className="text-primary-foreground/30">|</span>
          <a href="/sobre" className="hover:text-primary-foreground transition-colors">Sobre</a>
          <span className="text-primary-foreground/30">|</span>
          <a href="#" className="hover:text-primary-foreground transition-colors">Termos e condições</a>
          <span className="text-primary-foreground/30">|</span>
          <a href="#" className="hover:text-primary-foreground transition-colors">Política de privacidade</a>
        </div>
        <p className="text-center text-sm text-primary-foreground/50">
          © {new Date().getFullYear()} Negócio Topográfico. Todos os direitos reservados.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
