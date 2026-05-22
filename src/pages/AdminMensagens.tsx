import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { useContatoMensagens } from "@/hooks/useContatoMensagens";

const AdminMensagens = () => {
  const { mensagens, loading, error, reload } = useContatoMensagens();

  return (
    <AdminLayout title="Mensagens de Contato">
      <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mensagens enviadas pelo formulário de contato do site.
          </p>
          <Button variant="outline" size="sm" onClick={reload}>Atualizar</Button>
        </div>
        {loading ? (
          <p className="text-muted-foreground">Carregando...</p>
        ) : error ? (
          <p className="text-destructive text-sm">{error}</p>
        ) : mensagens.length === 0 ? (
          <p className="text-muted-foreground">Nenhuma mensagem recebida ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-left">
                  <th className="px-3 py-2 font-semibold">Data</th>
                  <th className="px-3 py-2 font-semibold">Nome</th>
                  <th className="px-3 py-2 font-semibold">E-mail</th>
                  <th className="px-3 py-2 font-semibold">Mensagem</th>
                </tr>
              </thead>
              <tbody>
                {mensagens.map((m) => (
                  <tr key={m.id} className="border-b border-border align-top">
                    <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">
                      {m.created_at ? new Date(m.created_at).toLocaleString("pt-BR") : "-"}
                    </td>
                    <td className="px-3 py-2 font-medium">{m.nome}</td>
                    <td className="px-3 py-2">
                      <a href={`mailto:${m.email}`} className="text-primary hover:underline">{m.email}</a>
                    </td>
                    <td className="px-3 py-2 whitespace-pre-wrap">{m.mensagem}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminLayout>
  );
};

export default AdminMensagens;
