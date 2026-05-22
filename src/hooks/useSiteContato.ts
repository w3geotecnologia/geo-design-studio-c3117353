import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type SiteContato = {
  telefone1: string;
  telefone2: string;
  whatsapp1: string;
  whatsapp2: string;
  email: string;
  email_topo: string;
  endereco: string;
  cidade: string;
  horario_semana: string;
  horario_sabado: string;
};

export const defaultContato: SiteContato = {
  telefone1: "+55 19 99630-9627",
  telefone2: "+55 19 98977-6474",
  whatsapp1: "5519996309627",
  whatsapp2: "5519989776474",
  email: "contato@w3geo.com.br",
  email_topo: "w3.assistencia@gmail.com",
  endereco: "Indaiatuba - SP, Brasil",
  cidade: "Indaiatuba - SP",
  horario_semana: "Segunda a Sexta: 08h - 18h",
  horario_sabado: "Sábado: 08h - 12h",
};

let cache: SiteContato | null = null;
const listeners = new Set<(c: SiteContato) => void>();

export const fetchSiteContato = async (): Promise<SiteContato> => {
  try {
    const { data, error } = await supabase
      .from("site_contato")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (error || !data) return defaultContato;
    return { ...defaultContato, ...(data as Partial<SiteContato>) };
  } catch {
    return defaultContato;
  }
};

export const saveSiteContato = async (values: SiteContato) => {
  const { error } = await supabase
    .from("site_contato")
    .upsert({ id: 1, ...values }, { onConflict: "id" });
  if (error) throw error;
  cache = values;
  listeners.forEach((l) => l(values));
};

export const useSiteContato = (): SiteContato => {
  const [contato, setContato] = useState<SiteContato>(cache ?? defaultContato);

  useEffect(() => {
    listeners.add(setContato);
    if (!cache) {
      fetchSiteContato().then((c) => {
        cache = c;
        setContato(c);
      });
    }
    return () => {
      listeners.delete(setContato);
    };
  }, []);

  return contato;
};
