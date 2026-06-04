import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const AdminMensagensNotifier = () => {
  const { isAdmin } = useAdminAuth();
  const ready = useRef(false);

  useEffect(() => {
    if (!isAdmin) return;
    ready.current = false;
    const t = setTimeout(() => {
      ready.current = true;
    }, 1500);

    const channel = supabase
      .channel("admin_mensagens_notifier")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "site_contato_mensagens" },
        (payload) => {
          if (!ready.current) return;
          const nova = payload.new as { nome?: string; mensagem?: string };
          toast({
            title: "Nova mensagem recebida",
            description: `${nova.nome ?? ""}: ${nova.mensagem?.slice(0, 80) ?? ""}`,
            duration: 6000,
          });
        }
      )
      .subscribe();

    return () => {
      clearTimeout(t);
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  return null;
};

export default AdminMensagensNotifier;
