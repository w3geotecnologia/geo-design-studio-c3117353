import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacidade = () => (
  <div className="min-h-screen flex flex-col">
    <TopBar />
    <Navbar />
    <main className="flex-1 container py-12 max-w-4xl">
      <h1 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-primary-darker">
        Política de Privacidade – W3-Geotecnologia
      </h1>
      <div className="prose prose-slate max-w-none space-y-4 text-foreground/80 leading-relaxed">
        <p>
          A W3-Geotecnologia valoriza a privacidade e a segurança dos dados dos seus clientes e visitantes. Esta Política de Privacidade explica como coletamos, utilizamos, armazenamos e protegemos as informações pessoais fornecidas através do nosso site.
        </p>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-3 text-primary-darker">1. Dados Coletados</h2>
        <p>Podemos coletar informações quando você:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Preenche formulários de contato ou solicitação de serviços;</li>
          <li>Cadastra-se para receber newsletters ou materiais informativos;</li>
          <li>Interage conosco via e-mail, telefone ou chat.</li>
        </ul>
        <p>Os dados podem incluir:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Nome, e-mail, telefone e empresa;</li>
          <li>Informações técnicas (como modelo de equipamento GPS/GNSS, marca – Topcon, Trimble, Sokkia ou outras);</li>
          <li>Dados de navegação (cookies, endereço IP, páginas acessadas).</li>
        </ul>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-3 text-primary-darker">2. Finalidade do Uso dos Dados</h2>
        <p>Utilizamos suas informações para:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Prestar assistência técnica e suporte especializado;</li>
          <li>Responder a solicitações e orçamentos;</li>
          <li>Enviar comunicações relevantes sobre serviços e atualizações;</li>
          <li>Melhorar a experiência no site e nossos serviços.</li>
        </ul>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-3 text-primary-darker">3. Compartilhamento de Dados</h2>
        <p>Nós <strong>não vendemos</strong> suas informações. Seus dados podem ser compartilhados apenas:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Com parceiros técnicos, quando necessário para reparo de equipamentos (ex.: autorizadas das marcas atendidas);</li>
          <li>Por obrigação legal ou autoridades competentes.</li>
        </ul>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-3 text-primary-darker">4. Segurança das Informações</h2>
        <p>
          Adotamos medidas técnicas e administrativas para proteger seus dados contra acesso não autorizado, alteração ou perda.
        </p>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-3 text-primary-darker">5. Cookies e Tecnologias Similares</h2>
        <p>
          Nosso site pode usar cookies para melhorar a navegação. Você pode gerenciar essas preferências no seu navegador.
        </p>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-3 text-primary-darker">6. Seus Direitos</h2>
        <p>Você pode, a qualquer momento:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Acessar, corrigir ou solicitar a exclusão dos seus dados;</li>
          <li>Revogar consentimento para comunicações;</li>
          <li>Entrar em contato conosco via e-mail ou telefone para dúvidas.</li>
        </ul>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-3 text-primary-darker">7. Alterações na Política</h2>
        <p>
          Esta política pode ser atualizada. Recomendamos a revisão periódica.
        </p>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-3 text-primary-darker">Contato</h2>
        <p className="font-semibold">W3-Geotecnologia</p>
        <ul className="list-none pl-0 space-y-2">
          <li>📞 +55 19 9915-31218</li>
          <li>📧 w3.geotecnologia.com.br</li>
          <li>📍 Indaiatuba - SP</li>
        </ul>

        <p className="mt-4 text-sm text-foreground/70">
          Ao usar nosso site, você concorda com os termos desta política.
        </p>
      </div>
    </main>
    <Footer />
  </div>
);

export default Privacidade;
