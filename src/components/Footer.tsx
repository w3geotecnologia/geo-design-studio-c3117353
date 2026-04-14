const Footer = () => (
  <footer className="bg-primary-darker text-primary-foreground py-14">
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
        <div>
          <h3 className="font-heading font-extrabold text-xl mb-4">W3 <span className="font-semibold text-sm">GEO-TECNOLOGIAS</span></h3>
          <p className="text-primary-foreground/70 text-sm leading-relaxed">
            Mais de 20 anos oferecendo soluções em geotecnologia com qualidade e precisão.
          </p>
        </div>
        <div>
          <h4 className="font-heading font-bold mb-4">Links Rápidos</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            {["Início", "Serviços", "Produtos", "Contato", "Sobre"].map((l) => (
              <li key={l}><a href={`#${l.toLowerCase()}`} className="hover:text-primary-foreground transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-heading font-bold mb-4">Horário de Funcionamento</h4>
          <p className="text-sm text-primary-foreground/70">Segunda a Sexta: 08h - 18h</p>
          <p className="text-sm text-primary-foreground/70">Sábado: 08h - 12h</p>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15 pt-6 text-center text-sm text-primary-foreground/50">
        © {new Date().getFullYear()} W3 Geo-Tecnologias. Todos os direitos reservados.
      </div>
    </div>
  </footer>
);

export default Footer;
