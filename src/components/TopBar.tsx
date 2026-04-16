import { MapPin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const TopBar = () => (
  <div className="bg-topbar py-2 text-primary-foreground text-sm">
    <div className="container flex items-center justify-between">
      <div className="flex items-center gap-6">
        <a href="https://wa.me/5519996309627" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <FaWhatsapp className="w-4 h-4 text-green-400" />
          <span>+55 19 99630-9627</span>
        </a>
        <a href="https://wa.me/5519989776474" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <FaWhatsapp className="w-4 h-4 text-green-400" />
          <span>+55 19 98977-6474</span>
        </a>
        <a href="mailto:contato@w3geo.com.br" className="hidden sm:flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span>contato@w3geo.com.br</span>
        </a>
      </div>
      <div className="flex items-center gap-2">
        <MapPin className="w-3.5 h-3.5" />
        <span>Indaiatuba - SP</span>
      </div>
    </div>
  </div>
);

export default TopBar;
