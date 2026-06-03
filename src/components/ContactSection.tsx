import { Phone, Mail, MapPin, Send, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useSiteContato } from "@/hooks/useSiteContato";
import { enviarMensagem } from "@/hooks/useContatoMensagens";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  nome: z.string().trim().min(1, "Informe seu nome").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
  mensagem: z.string().trim().min(1, "Escreva sua mensagem").max(1000),
});

const ContactSection = () => {
  const c = useSiteContato();
  const [form, setForm] = useState({ nome: "", email: "", mensagem: "" });
  const [sending, setSending] = useState(false);

  const items = [
    c.telefone1 && { icon: Phone, label: c.telefone1 },
    c.telefone2 && { icon: Phone, label: c.telefone2 },
    c.email && { icon: Mail, label: c.email },
    c.endereco && { icon: MapPin, label: c.endereco },
  ].filter(Boolean) as { icon: typeof Phone; label: string }[];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({ title: "Verifique os dados", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      await enviarMensagem(parsed.data as { nome: string; email: string; mensagem: string });
      toast({ title: "Mensagem enviada!", description: "Em breve entraremos em contato." });
      setForm({ nome: "", email: "", mensagem: "" });
    } catch (err: any) {
      toast({ title: "Erro ao enviar", description: err?.message ?? "Tente novamente mais tarde.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contato" className="py-20 bg-section-light">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-6">Entre em Contato</h2>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
              Fale conosco para tirar dúvidas, solicitar orçamentos ou agendar uma visita técnica.
            </p>
            <div className="space-y-6 mb-8">
              {items.map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">{item.label}</span>
                </div>
              ))}
            </div>
            <Button asChild className="bg-primary hover:bg-primary-dark text-primary-foreground font-bold py-6 px-6 text-base">
              <Link to="/orcamento">
                <FileText className="w-4 h-4 mr-2" /> Solicitar Orçamento
              </Link>
            </Button>
          </div>
          <div className="bg-card rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-foreground mb-4">Envie uma mensagem direta</h3>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Nome</label>
                <input
                  id="contato-nome"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  maxLength={100}
                  className="w-full border border-border rounded-lg px-4 py-3 text-sm bg-background outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  maxLength={255}
                  className="w-full border border-border rounded-lg px-4 py-3 text-sm bg-background outline-none focus:ring-2 focus:ring-ring"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Mensagem</label>
                <textarea
                  rows={4}
                  value={form.mensagem}
                  onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                  maxLength={1000}
                  className="w-full border border-border rounded-lg px-4 py-3 text-sm bg-background outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Como podemos ajudar?"
                />
              </div>
              <Button type="submit" disabled={sending} className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-bold py-6 text-base">
                <Send className="w-4 h-4 mr-2" /> {sending ? "Enviando..." : "Enviar Mensagem"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
