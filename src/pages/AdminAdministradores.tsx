import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, KeyRound, ShieldCheck } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAdminAuth } from "@/hooks/useAdminAuth";

type AdminRow = { id: string; email: string; user_id: string | null; created_at: string };

const AdminAdministradores = () => {
  const { user } = useAdminAuth();
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [creating, setCreating] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [myNewPassword, setMyNewPassword] = useState("");
  const [changingPwd, setChangingPwd] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("admins")
      .select("id, email, user_id, created_at")
      .order("created_at", { ascending: true });
    if (error) toast({ title: "Erro ao carregar", description: error.message, variant: "destructive" });
    setAdmins((data as AdminRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    const email = newEmail.trim().toLowerCase();
    if (!email || newPassword.length < 6) {
      toast({ title: "Dados inválidos", description: "E-mail válido e senha de 6+ caracteres.", variant: "destructive" });
      return;
    }
    setCreating(true);
    // cria usuário de autenticação
    const { data: signUp, error: signUpErr } = await supabase.auth.signUp({
      email,
      password: newPassword,
      options: { emailRedirectTo: window.location.origin },
    });
    if (signUpErr && !signUpErr.message.toLowerCase().includes("already")) {
      toast({ title: "Erro ao criar usuário", description: signUpErr.message, variant: "destructive" });
      setCreating(false);
      return;
    }
    // insere na tabela admins
    const { error: insErr } = await supabase
      .from("admins")
      .insert({ email, user_id: signUp?.user?.id ?? null });
    if (insErr) {
      toast({ title: "Erro ao registrar admin", description: insErr.message, variant: "destructive" });
      setCreating(false);
      return;
    }
    toast({ title: "Administrador criado", description: email });
    setNewEmail("");
    setNewPassword("");
    setCreating(false);
    void load();
  };

  const handleDelete = async (row: AdminRow) => {
    if (row.user_id === user?.id) {
      toast({ title: "Ação não permitida", description: "Você não pode remover a si mesmo.", variant: "destructive" });
      return;
    }
    if (!window.confirm(`Remover administrador ${row.email}?`)) return;
    const { error } = await supabase.from("admins").delete().eq("id", row.id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Administrador removido" });
    void load();
  };

  const handleResetEmail = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/admin",
    });
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "E-mail enviado", description: `Link de redefinição enviado para ${email}.` });
  };

  const handleChangeMyPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (myNewPassword.length < 6) {
      toast({ title: "Senha muito curta", description: "Mínimo de 6 caracteres.", variant: "destructive" });
      return;
    }
    setChangingPwd(true);
    // re-autentica para validar a senha atual
    if (user?.email) {
      const { error: reErr } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      if (reErr) {
        toast({ title: "Senha atual incorreta", variant: "destructive" });
        setChangingPwd(false);
        return;
      }
    }
    const { error } = await supabase.auth.updateUser({ password: myNewPassword });
    setChangingPwd(false);
    if (error) {
      toast({ title: "Erro ao alterar senha", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Senha alterada com sucesso" });
    setCurrentPassword("");
    setMyNewPassword("");
  };

  return (
    <AdminLayout title="Administradores">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-bold">
            <Plus className="h-4 w-4" /> Criar novo administrador
          </h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <Label htmlFor="new-email">E-mail</Label>
              <Input id="new-email" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="new-password">Senha inicial</Label>
              <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={6} required />
            </div>
            <Button type="submit" disabled={creating} className="w-full">
              {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />} Criar administrador
            </Button>
          </form>
        </section>

        <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-bold">
            <KeyRound className="h-4 w-4" /> Alterar minha senha
          </h2>
          <form onSubmit={handleChangeMyPassword} className="space-y-3">
            <div>
              <Label htmlFor="cur-pwd">Senha atual</Label>
              <Input id="cur-pwd" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="my-new-pwd">Nova senha</Label>
              <Input id="my-new-pwd" type="password" value={myNewPassword} onChange={(e) => setMyNewPassword(e.target.value)} minLength={6} required />
            </div>
            <Button type="submit" disabled={changingPwd} className="w-full">
              {changingPwd ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />} Atualizar senha
            </Button>
          </form>
        </section>
      </div>

      <section className="mt-6 rounded-lg border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-bold">
          <ShieldCheck className="h-4 w-4" /> Administradores cadastrados
        </h2>
        {loading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Carregando...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                  <th className="px-2 py-2">E-mail</th>
                  <th className="px-2 py-2">Vinculado</th>
                  <th className="px-2 py-2">Criado em</th>
                  <th className="px-2 py-2 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((row) => (
                  <tr key={row.id} className="border-b border-border/50">
                    <td className="px-2 py-2 font-medium">{row.email}</td>
                    <td className="px-2 py-2 text-xs text-muted-foreground">{row.user_id ? "sim" : "pendente"}</td>
                    <td className="px-2 py-2 text-xs text-muted-foreground">
                      {new Date(row.created_at).toLocaleString("pt-BR")}
                    </td>
                    <td className="px-2 py-2 text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleResetEmail(row.email)}>
                          <KeyRound className="mr-1 h-3.5 w-3.5" /> Reset
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(row)}
                          disabled={row.user_id === user?.id}
                        >
                          <Trash2 className="mr-1 h-3.5 w-3.5" /> Remover
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {admins.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-muted-foreground">
                      Nenhum administrador cadastrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-4 text-xs text-muted-foreground">
          Dica: para alterar a senha de outro administrador, use o botão "Reset" para enviar um link de redefinição por e-mail.
        </p>
      </section>
    </AdminLayout>
  );
};

export default AdminAdministradores;
