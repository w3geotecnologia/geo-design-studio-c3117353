import { Phone, Mail, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactSection = () => (
  <section id="contato" className="py-20 bg-section-light">
    <div className="container">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
        {/* Info */}
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-6">Entre em Contato</h2>
          <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
            Fale conosco para tirar dúvidas, solicitar orçamentos ou agendar uma visita técnica.
          </p>
          <div className="space-y-6">
            {[
              { icon: Phone, label: "+55 19 99630-9627" },
              { icon: Mail, label: "contato@w3geo.com.br" },
              { icon: MapPin, label: "Indaiatuba - SP, Brasil" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-foreground font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Form */}
        <div className="bg-card rounded-2xl shadow-lg p-8">
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">Nome</label>
              <input className="w-full border border-border rounded-lg px-4 py-3 text-sm bg-background outline-none focus:ring-2 focus:ring-ring" placeholder="Seu nome completo" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">Email</label>
              <input type="email" className="w-full border border-border rounded-lg px-4 py-3 text-sm bg-background outline-none focus:ring-2 focus:ring-ring" placeholder="seu@email.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">Mensagem</label>
              <textarea rows={4} className="w-full border border-border rounded-lg px-4 py-3 text-sm bg-background outline-none focus:ring-2 focus:ring-ring resize-none" placeholder="Como podemos ajudar?" />
            </div>
            <Button className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-bold py-6 text-base">
              <Send className="w-4 h-4 mr-2" /> Enviar Mensagem
            </Button>
          </form>
        </div>
      </div>
    </div>
  </section>
);

export default ContactSection;
