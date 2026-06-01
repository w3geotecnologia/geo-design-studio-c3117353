import { MapPin, User } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useSiteContato } from "@/hooks/useSiteContato";

const TopBar = () => {
  const c = useSiteContato();
  return (
    <div className="bg-topbar py-2 text-primary-foreground text-sm">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-6">
          {c.telefone1 && (
            <a href={`https://wa.me/${c.whatsapp1}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <FaWhatsapp className="w-4 h-4 text-green-400" />
              <span>{c.telefone1}</span>
            </a>
          )}
          {c.telefone2 && (
            <a href={`https://wa.me/${c.whatsapp2}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <FaWhatsapp className="w-4 h-4 text-green-400" />
              <span>{c.telefone2}</span>
            </a>
          )}
          {c.email_topo && (
            <a href={`mailto:${c.email_topo}`} className="hidden sm:flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span>{c.email_topo}</span>
            </a>
          )}
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5" />
          <span>{c.cidade}</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
