import "./global.css";
import "@/i18n";

import RouteLoader from "@/components/RouteLoader";
import Loading from "@/components/ui/Loading";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { store } from "@/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import HRDashboard from "./pages/HRDashboard";
import NotFound from "./pages/NotFound";
import TeamLeaderDashboard from "./pages/TeamLeaderDashboard";
import LoginScreen from "./pages/login/Login.screen";
import SignupScreen from "./pages/signup/Signup.screen";
import DirectorScreen from "./pages/dashboard/director/Director.screen";

import { ThemeProvider } from "@/components/theme-provider";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          <Loading />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <RouteLoader />
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/director-dashboard" element={<DirectorScreen />} />
              <Route path="/hr-dashboard" element={<HRDashboard />} />
              <Route
                path="/team-leader-dashboard"
                element={<TeamLeaderDashboard />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </Provider>
);

createRoot(document.getElementById("root")!).render(<App />);
