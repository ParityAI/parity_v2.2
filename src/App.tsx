import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";
import Models from "./pages/Models";
import Compliance from "./pages/Compliance";
import Vendors from "./pages/Vendors";
import { AppLayout } from "./components/layout/AppLayout";
import Tasks from "./pages/Tasks";
import UseCases from "./pages/UseCases";
import Risks from "./pages/Risks";
import BiasMetrics from "./pages/BiasMetrics";
import Evidence from "./pages/Evidence";
import Reporting from "./pages/Reporting";
import Policies from "./pages/Policies";
import Transparency from "./pages/Transparency";
import Incidents from "./pages/Incidents";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/products/:productId" element={<ComingSoon />} />

            {/* Protected app routes */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/use-cases" element={<UseCases />} />
              <Route path="/vendors" element={<Vendors />} />
              <Route path="/models" element={<Models />} />
              <Route path="/risks" element={<Risks />} />
              <Route path="/bias-metrics" element={<BiasMetrics />} />
              <Route path="/compliance" element={<Compliance />} />
              <Route path="/evidence" element={<Evidence />} />
              <Route path="/reporting" element={<Reporting />} />
              <Route path="/policies" element={<Policies />} />
              <Route path="/incidents" element={<Incidents />} />
              <Route path="/transparency" element={<Transparency />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
