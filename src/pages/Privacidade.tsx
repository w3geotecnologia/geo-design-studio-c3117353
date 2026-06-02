import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacidade = () => (
  <div className="min-h-screen flex flex-col">
    <TopBar />
    <Navbar />
    <main className="flex-1 container py-12 max-w-4xl">
      <h1 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-primary-darker">
        Política de Privacidade
      </h1>
      <div className="prose prose-slate max-w-none space-y-4 text-foreground/80 leading-relaxed">
        <p>
          A W3 Geo-Tecnologias respeita sua privacidade e está comprometida com
          a proteção dos dados pessoais coletados em nosso site, em
          conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº
          13.709/2018).
        </p>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-3 text-primary-darker">1. Coleta de Dados</h2>
        <p>
          Coletamos informações fornecidas voluntariamente pelo usuário através
          de formulários de contato, orçamento e cadastro, como nome, e-mail,
          telefone e endereço.
        </p>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-3 text-primary-darker">2. Uso dos Dados</h2>
        <p>
          Os dados coletados são utilizados para responder solicitações, enviar
          orçamentos, prestar atendimento, processar pedidos e melhorar nossos
          serviços.
        </p>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-3 text-primary-darker">3. Compartilhamento</h2>
        <p>
          Não compartilhamos suas informações com terceiros, exceto quando
          necessário para a prestação do serviço contratado ou por exigência
          legal.
        </p>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-3 text-primary-darker">4. Segurança</h2>
        <p>
          Adotamos medidas técnicas e administrativas para proteger seus dados
          contra acessos não autorizados, perda ou alteração indevida.
        </p>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-3 text-primary-darker">5. Direitos do Titular</h2>
        <p>
          Você pode solicitar a qualquer momento o acesso, correção,
          atualização ou exclusão de seus dados pessoais, entrando em contato
          pelo e-mail contato@w3geo.com.br.
        </p>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-3 text-primary-darker">6. Cookies</h2>
        <p>
          Nosso site pode utilizar cookies para melhorar a experiência de
          navegação. O usuário pode desativar os cookies nas configurações de
          seu navegador.
        </p>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-3 text-primary-darker">7. Alterações nesta Política</h2>
        <p>
          Esta Política de Privacidade pode ser atualizada periodicamente.
          Recomendamos consultá-la regularmente.
        </p>
      </div>
    </main>
    <Footer />
  </div>
);

export default Privacidade;
