import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Fields from "./pages/Fields";
import FieldDetail from "./pages/FieldDetail";
import IoT from "./pages/IoT";
import IoTDetail from "./pages/IoTDetail";
import Weather from "./pages/Weather";
import AI from "./pages/AI";
import Alerts from "./pages/Alerts";
import Soil from "./pages/Soil";
import SoilDetail from "./pages/SoilDetail";
import Market from "./pages/Market";
import Sustainability from "./pages/Sustainability";
import Chat from "./pages/Chat";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import { useAuthStore } from "./store/authStore";
import "./i18n/config";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="fields" element={<Fields />} />
            <Route path="fields/:id" element={<FieldDetail />} />
            <Route path="iot" element={<IoT />} />
            <Route path="iot/:nodeId" element={<IoTDetail />} />
            <Route path="weather" element={<Weather />} />
            <Route path="ai" element={<AI />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="soil" element={<Soil />} />
            <Route path="soil/:fieldId" element={<SoilDetail />} />
            <Route path="market" element={<Market />} />
            <Route path="sustainability" element={<Sustainability />} />
            <Route path="chat" element={<Chat />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="admin" element={<Admin />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
