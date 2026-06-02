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
import Checkout from "./pages/Checkout.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import AdminClientes from "./pages/AdminClientes.tsx";
import AdminOrcamentos from "./pages/AdminOrcamentos.tsx";
import AdminPedidos from "./pages/AdminPedidos.tsx";
import AdminProdutos from "./pages/AdminProdutos.tsx";
import AdminContato from "./pages/AdminContato.tsx";
import AdminMensagens from "./pages/AdminMensagens.tsx";
import AdminPlaceholder from "./pages/AdminPlaceholder.tsx";
import AdminServicos from "./pages/AdminServicos.tsx";
import Sobre from "./pages/Sobre.tsx";
import Termos from "./pages/Termos.tsx";
import Privacidade from "./pages/Privacidade.tsx";
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
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/termos" element={<Termos />} />
            <Route path="/privacidade" element={<Privacidade />} />
            <Route path="/orcamento" element={<Orcamento />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/dashboard" element={<ProtectedAdminRoute><Dashboard /></ProtectedAdminRoute>} />
            <Route path="/dashboard/clientes" element={<ProtectedAdminRoute><AdminClientes /></ProtectedAdminRoute>} />
            <Route path="/dashboard/orcamentos" element={<ProtectedAdminRoute><AdminOrcamentos /></ProtectedAdminRoute>} />
            <Route path="/dashboard/pedidos" element={<ProtectedAdminRoute><AdminPedidos /></ProtectedAdminRoute>} />
            <Route path="/dashboard/produtos" element={<ProtectedAdminRoute><AdminProdutos /></ProtectedAdminRoute>} />
            <Route path="/dashboard/contato" element={<ProtectedAdminRoute><AdminContato /></ProtectedAdminRoute>} />
            <Route path="/dashboard/contato/mensagens" element={<ProtectedAdminRoute><AdminMensagens /></ProtectedAdminRoute>} />
            <Route path="/dashboard/servicos" element={<ProtectedAdminRoute><AdminServicos /></ProtectedAdminRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
