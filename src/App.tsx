import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CriticalAlerts from "./pages/CriticalAlerts";
import ContainerLookup from "./pages/ContainerLookup";
import GeographicRisk from "./pages/GeographicRisk";
import LivePredictor from "./pages/LivePredictor";
import DataReports from "./pages/DataReports";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/critical" element={<CriticalAlerts />} />
          <Route path="/lookup" element={<ContainerLookup />} />
          <Route path="/geographic" element={<GeographicRisk />} />
          <Route path="/predictor" element={<LivePredictor />} />
          <Route path="/reports" element={<DataReports />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
