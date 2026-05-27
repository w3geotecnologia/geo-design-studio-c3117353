import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type ServicoCard = {
  icon: string;
  title: string;
  description: string;
};

export type SiteServicos = {
  titulo: string;
  subtitulo: string;
  cards: ServicoCard[];
};

export const availableIcons = [
  "Wrench",
  "MapPin",
  "Cpu",
  "Plane",
  "Compass",
  "Satellite",
  "Map",
  "Camera",
  "Settings",
  "Truck",
  "Ruler",
  "Mountain",
  "Radio",
  "Navigation",
  "Globe",
  "Layers",
] as const;

export const defaultServicos: SiteServicos = {
  titulo: "Nossos Serviços",
  subtitulo: "Soluções completas em geotecnologia para sua empresa ou projeto",
  cards: [
    {
      icon: "Wrench",
      title: "Assistência Técnica",
      description:
        "Manutenção preventiva e corretiva em equipamentos de topografia e geodésia.",
    },
    {
      icon: "MapPin",
      title: "Locação de Equipamentos",
      description:
        "Aluguel de GPS, GNSS, estações totais e níveis para seus projetos.",
    },
    {
      icon: "Cpu",
      title: "Calibração & Certificação",
      description:
        "Serviços de calibração com certificado rastreável e laudos técnicos.",
    },
    {
      icon: "Plane",
      title: "Drones & Aerofotogrametria",
      description:
        "Mapeamento aéreo com drones profissionais e processamento de imagens.",
    },
  ],
};

let cache: SiteServicos | null = null;
const listeners = new Set<(s: SiteServicos) => void>();

export const fetchSiteServicos = async (): Promise<SiteServicos> => {
  try {
    const { data, error } = await supabase
      .from("site_servicos")
      .select("dados")
      .eq("id", 1)
      .maybeSingle();
    if (error || !data?.dados) return defaultServicos;
    const dados = data.dados as Partial<SiteServicos>;
    return {
      titulo: dados.titulo ?? defaultServicos.titulo,
      subtitulo: dados.subtitulo ?? defaultServicos.subtitulo,
      cards: Array.isArray(dados.cards) && dados.cards.length > 0
        ? dados.cards
        : defaultServicos.cards,
    };
  } catch {
    return defaultServicos;
  }
};

export const saveSiteServicos = async (values: SiteServicos) => {
  const { error } = await supabase
    .from("site_servicos")
    .upsert({ id: 1, dados: values }, { onConflict: "id" });
  if (error) throw error;
  cache = values;
  listeners.forEach((l) => l(values));
};

export const useSiteServicos = (): SiteServicos => {
  const [servicos, setServicos] = useState<SiteServicos>(cache ?? defaultServicos);

  useEffect(() => {
    listeners.add(setServicos);
    if (!cache) {
      fetchSiteServicos().then((s) => {
        cache = s;
        setServicos(s);
      });
    }
    return () => {
      listeners.delete(setServicos);
    };
  }, []);

  return servicos;
};
