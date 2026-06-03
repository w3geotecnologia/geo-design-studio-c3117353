import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Termos = () => (
  <div className="min-h-screen flex flex-col">
    <TopBar />
    <Navbar />
    <main className="flex-1 container py-12 max-w-4xl">
      <h1 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-primary-darker">
        Termos e Condições – W3-Geotecnologia
      </h1>
      <div className="prose prose-slate max-w-none space-y-4 text-foreground/80 leading-relaxed">
        <p>
          Bem-vindo(a) aos Termos e Condições da W3-Geotecnologia. Ao utilizar nossos serviços ou site, você concorda com as disposições abaixo. Recomendamos a leitura atenta.
        </p>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-3 text-primary-darker">1. Serviços Oferecidos</h2>
        <p>
          A W3-Geotecnologia é especializada em assistência técnica, manutenção e calibração de equipamentos GPS/GNSS, atendendo principalmente as marcas Topcon, Trimble, Sokkia e modelos chineses, com mais de 20 anos de experiência no mercado.
        </p>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-3 text-primary-darker">2. Solicitação de Serviços</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>O cliente deve fornecer informações precisas sobre o equipamento (marca, modelo, defeito relatado).</li>
          <li>O orçamento será enviado após avaliação técnica, podendo ser aceito ou recusado pelo cliente.</li>
          <li>Serviços não autorizados previamente não serão executados.</li>
        </ul>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-3 text-primary-darker">3. Prazos e Garantia</h2>
        <p>Os prazos de reparo variam conforme a complexidade e disponibilidade de peças.</p>
        <p>A garantia dos serviços prestados cobre defeitos relacionados à assistência realizada, exceto em casos de:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Danos por uso inadequado após o reparo;</li>
          <li>Intervenções feitas por terceiros;</li>
          <li>Desgaste natural do equipamento.</li>
        </ul>
        <p>A garantia tem prazo de 90 dias.</p>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-3 text-primary-darker">4. Pagamentos</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>O pagamento deve ser realizado conforme acordado no orçamento.</li>
          <li>Aceitamos as formas de pagamento: PIX, boleto à vista, cartão de crédito ou transferência.</li>
          <li>Atrasos podem acarretar suspensão dos serviços ou devolução.</li>
        </ul>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-3 text-primary-darker">5. Devolução e Cancelamento</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>O cliente pode cancelar o serviço antes do início do reparo, sem custos.</li>
          <li>Após a autorização, o cancelamento pode gerar taxas conforme estágio do serviço.</li>
        </ul>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-3 text-primary-darker">6. Responsabilidades</h2>
        <p>A W3-Geotecnologia não se responsabiliza por:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Danos pré-existentes não relatados no momento do orçamento;</li>
          <li>Perda de dados ou configurações do equipamento durante o reparo (recomenda-se backup).</li>
        </ul>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-3 text-primary-darker">7. Privacidade e Dados</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Os dados do cliente são tratados conforme nossa Política de Privacidade.</li>
          <li>Informações técnicas sobre os equipamentos podem ser utilizadas para fins de melhoria de serviços, sem identificação pessoal.</li>
        </ul>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-3 text-primary-darker">8. Alterações nos Termos</h2>
        <p>
          Estes termos podem ser atualizados periodicamente. A versão mais recente estará disponível em nosso site.
        </p>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-3 text-primary-darker">Contato</h2>
        <ul className="list-none pl-0 space-y-2">
          <li>📞 +55 19 991531218</li>
          <li>📧 w3.assistencia@gmail.com</li>
          <li>📍 Indaiatuba – SP</li>
        </ul>

        <p className="mt-6 font-semibold text-foreground">
          Especializados em tecnologia com precisão. Atendimento com tradição.
        </p>
        <p>
          🔹 W3-Geotecnologia – Assistência Técnica em GPS/GNSS desde 2004.
        </p>
        <p className="mt-4 text-sm text-foreground/70">
          Ao utilizar nossos serviços, você declara estar de acordo com estes Termos e Condições.
        </p>
      </div>
    </main>
    <Footer />
  </div>
);

export default Termos;
