import { Phone, MapPin, Mail } from "lucide-react";

const TopBar = () => (
  <div className="bg-topbar py-2 text-primary-foreground text-sm">
    <div className="container flex items-center justify-between">
      <div className="flex items-center gap-6">
        <a href="tel:+551999309627" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Phone className="w-3.5 h-3.5" />
          <span>+55 19 99630-9627</span>
        </a>
        <a href="mailto:contato@w3geo.com.br" className="hidden sm:flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Mail className="w-3.5 h-3.5" />
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
