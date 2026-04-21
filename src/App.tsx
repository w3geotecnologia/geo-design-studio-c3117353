import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminAuthProvider } from "@/hooks/useAdminAuth";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import Index from "./pages/Index.tsx";
import Cadastro from "./pages/Cadastro.tsx";
import Orcamento from "./pages/Orcamento.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import AdminClientes from "./pages/AdminClientes.tsx";
import AdminOrcamentos from "./pages/AdminOrcamentos.tsx";
import AdminPlaceholder from "./pages/AdminPlaceholder.tsx";
import NotFound from "./pages/NotFound.tsx";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AdminAuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/orcamento" element={<Orcamento />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/dashboard" element={<ProtectedAdminRoute><Dashboard /></ProtectedAdminRoute>} />
            <Route path="/dashboard/clientes" element={<ProtectedAdminRoute><AdminClientes /></ProtectedAdminRoute>} />
            <Route path="/dashboard/orcamentos" element={<ProtectedAdminRoute><AdminOrcamentos /></ProtectedAdminRoute>} />
            <Route path="/dashboard/produtos" element={<ProtectedAdminRoute><AdminPlaceholder title="Produtos" /></ProtectedAdminRoute>} />
            <Route path="/dashboard/servicos" element={<ProtectedAdminRoute><AdminPlaceholder title="Serviços" /></ProtectedAdminRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
