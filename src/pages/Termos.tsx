import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Termos = () => (
  <div className="min-h-screen flex flex-col">
    <TopBar />
    <Navbar />
    <main className="flex-1 container py-12 max-w-4xl">
      <h1 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-primary-darker">
        Termos e Condições
      </h1>
      <div className="prose prose-slate max-w-none space-y-4 text-foreground/80 leading-relaxed">
        <p>
          Bem-vindo à W3 Geo-Tecnologias. Ao acessar e utilizar nosso site e
          serviços, você concorda com os termos e condições descritos abaixo.
        </p>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-3 text-primary-darker">1. Uso do Site</h2>
        <p>
          O conteúdo deste site é fornecido apenas para fins informativos
          referentes aos serviços e produtos oferecidos pela W3 Geo-Tecnologias.
          O uso indevido, reprodução não autorizada ou modificação do conteúdo
          é estritamente proibido.
        </p>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-3 text-primary-darker">2. Serviços e Produtos</h2>
        <p>
          As informações sobre serviços e produtos podem ser atualizadas a
          qualquer momento, sem aviso prévio. Orçamentos e propostas têm
          validade definida na própria proposta enviada ao cliente.
        </p>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-3 text-primary-darker">3. Propriedade Intelectual</h2>
        <p>
          Todo o conteúdo do site, incluindo textos, imagens, logotipos e
          marcas, é de propriedade da W3 Geo-Tecnologias ou de seus parceiros,
          sendo protegido pela legislação vigente.
        </p>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-3 text-primary-darker">4. Limitação de Responsabilidade</h2>
        <p>
          A W3 Geo-Tecnologias não se responsabiliza por danos decorrentes do
          uso indevido das informações disponibilizadas neste site.
        </p>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-3 text-primary-darker">5. Alterações</h2>
        <p>
          Estes termos podem ser modificados a qualquer momento. Recomendamos
          a leitura periódica para acompanhar eventuais atualizações.
        </p>

        <h2 className="font-heading text-2xl font-semibold mt-8 mb-3 text-primary-darker">6. Contato</h2>
        <p>
          Em caso de dúvidas sobre estes termos, entre em contato através do
          e-mail contato@w3geo.com.br.
        </p>
      </div>
    </main>
    <Footer />
  </div>
);

export default Termos;
