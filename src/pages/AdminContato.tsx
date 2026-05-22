import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  defaultContato,
  fetchSiteContato,
  saveSiteContato,
  type SiteContato,
} from "@/hooks/useSiteContato";

const fields: { key: keyof SiteContato; label: string; placeholder?: string }[] = [
  { key: "telefone1", label: "Telefone 1 (topo)" },
  { key: "whatsapp1", label: "WhatsApp 1 (somente números, com DDI)", placeholder: "5519999999999" },
  { key: "telefone2", label: "Telefone 2 (topo)" },
  { key: "whatsapp2", label: "WhatsApp 2 (somente números, com DDI)", placeholder: "5519999999999" },
  { key: "email_topo", label: "E-mail (topo do site)" },
  { key: "email", label: "E-mail (seção de contato)" },
  { key: "cidade", label: "Cidade (topo)" },
  { key: "endereco", label: "Endereço (seção de contato)" },
  { key: "horario_semana", label: "Horário (semana)" },
  { key: "horario_sabado", label: "Horário (sábado)" },
];

const AdminContato = () => {
  const [form, setForm] = useState<SiteContato>(defaultContato);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSiteContato().then((c) => {
      setForm(c);
      setLoading(false);
    });
  }, []);

  const handleChange = (key: keyof SiteContato) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveSiteContato(form);
      toast({ title: "Informações de contato atualizadas!" });
    } catch (err: any) {
      toast({
        title: "Erro ao salvar",
        description: err?.message ?? "Verifique se a tabela 'site_contato' existe.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Contato do Site">
      <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <p className="mb-6 text-sm text-muted-foreground">
          Essas informações aparecem no topo do site e na seção de Contato.
        </p>
        {loading ? (
          <p className="text-muted-foreground">Carregando...</p>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {fields.map((f) => (
              <div key={f.key} className={f.key === "endereco" ? "md:col-span-2" : ""}>
                <Label htmlFor={f.key}>{f.label}</Label>
                <Input
                  id={f.key}
                  value={form[f.key] ?? ""}
                  placeholder={f.placeholder}
                  onChange={handleChange(f.key)}
                />
              </div>
            ))}
            <div className="md:col-span-2">
              <Button type="submit" disabled={saving} className="w-full md:w-auto">
                {saving ? "Salvando..." : "Salvar alterações"}
              </Button>
            </div>
          </form>
        )}
      </section>
    </AdminLayout>
  );
};

export default AdminContato;
