import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { Plus, Trash2 } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  availableIcons,
  defaultServicos,
  fetchSiteServicos,
  saveSiteServicos,
  type ServicoCard,
  type SiteServicos,
} from "@/hooks/useSiteServicos";

const AdminServicos = () => {
  const [form, setForm] = useState<SiteServicos>(defaultServicos);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSiteServicos().then((s) => {
      setForm(s);
      setLoading(false);
    });
  }, []);

  const updateCard = (index: number, patch: Partial<ServicoCard>) => {
    setForm((f) => ({
      ...f,
      cards: f.cards.map((c, i) => (i === index ? { ...c, ...patch } : c)),
    }));
  };

  const addCard = () => {
    setForm((f) => ({
      ...f,
      cards: [...f.cards, { icon: "Wrench", title: "Novo Serviço", description: "" }],
    }));
  };

  const removeCard = (index: number) => {
    setForm((f) => ({ ...f, cards: f.cards.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveSiteServicos(form);
      toast({ title: "Seção Serviços atualizada!" });
    } catch (err: any) {
      toast({
        title: "Erro ao salvar",
        description: err?.message ?? "Verifique se a tabela 'site_servicos' existe (colunas: id int PK, dados jsonb).",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Serviços do Site">
      <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <p className="mb-6 text-sm text-muted-foreground">
          Edite o título, subtítulo e os cards da seção "Nossos Serviços".
        </p>
        {loading ? (
          <p className="text-muted-foreground">Carregando...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  value={form.titulo}
                  onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="subtitulo">Subtítulo</Label>
                <Input
                  id="subtitulo"
                  value={form.subtitulo}
                  onChange={(e) => setForm((f) => ({ ...f, subtitulo: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold">Cards</h2>
                <Button type="button" variant="outline" size="sm" onClick={addCard}>
                  <Plus className="mr-2 h-4 w-4" /> Adicionar card
                </Button>
              </div>

              {form.cards.map((card, i) => {
                const IconPreview =
                  (Icons as unknown as Record<string, Icons.LucideIcon>)[card.icon] ??
                  Icons.Wrench;
                return (
                  <div
                    key={i}
                    className="grid grid-cols-1 gap-3 rounded-md border border-border bg-background p-4 md:grid-cols-[auto_1fr_2fr_auto]"
                  >
                    <div>
                      <Label>Ícone</Label>
                      <Select
                        value={card.icon}
                        onValueChange={(v) => updateCard(i, { icon: v })}
                      >
                        <SelectTrigger className="w-[170px]">
                          <SelectValue>
                            <span className="flex items-center gap-2">
                              <IconPreview className="h-4 w-4 text-primary" />
                              {card.icon}
                            </span>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {availableIcons.map((name) => {
                            const I =
                              (Icons as unknown as Record<string, Icons.LucideIcon>)[name];
                            return (
                              <SelectItem key={name} value={name}>
                                <span className="flex items-center gap-2">
                                  <I className="h-4 w-4" /> {name}
                                </span>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Título</Label>
                      <Input
                        value={card.title}
                        onChange={(e) => updateCard(i, { title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Descrição</Label>
                      <Textarea
                        rows={2}
                        value={card.description}
                        onChange={(e) => updateCard(i, { description: e.target.value })}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCard(i)}
                        aria-label="Remover card"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button type="submit" disabled={saving} className="w-full md:w-auto">
              {saving ? "Salvando..." : "Salvar alterações"}
            </Button>
          </form>
        )}
      </section>
    </AdminLayout>
  );
};

export default AdminServicos;
