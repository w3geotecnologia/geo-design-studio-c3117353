import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type ContatoMensagem = {
  id?: string;
  nome: string;
  email: string;
  mensagem: string;
  created_at?: string;
};

export const enviarMensagem = async (m: ContatoMensagem) => {
  const { error } = await supabase.from("site_contato_mensagens").insert({
    nome: m.nome,
    email: m.email,
    mensagem: m.mensagem,
  });
  if (error) throw error;
};

export const listarMensagens = async (): Promise<ContatoMensagem[]> => {
  const { data, error } = await supabase
    .from("site_contato_mensagens")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ContatoMensagem[];
};

export const excluirMensagem = async (id: string) => {
  const { error } = await supabase.from("site_contato_mensagens").delete().eq("id", id);
  if (error) throw error;
};

export const useContatoMensagens = () => {
  const [mensagens, setMensagens] = useState<ContatoMensagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true);
    try {
      setMensagens(await listarMensagens());
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? "Erro ao carregar mensagens");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  return { mensagens, loading, error, reload };
};
