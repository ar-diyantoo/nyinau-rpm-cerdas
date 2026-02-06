import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CreateRPM from "./pages/CreateRPM";
import EditRPM from "./pages/EditRPM";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Moderator from "./pages/Moderator";
import TeacherDashboard from "./pages/TeacherDashboard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Templates from '@/pages/Templates';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* RPM Creation Route */}
          <Route 
            path="/dashboard/create" 
            element={
              <ProtectedRoute>
                <CreateRPM />
              </ProtectedRoute>
            } 
          />

          {/* RPM Edit Route (BARU) */}
          <Route 
            path="/dashboard/edit/:id" 
            element={
              <ProtectedRoute>
                <EditRPM />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/dashboard/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />

          {/* Templates Route */}
          <Route 
            path="/dashboard/templates" 
            element={
              <ProtectedRoute>
                <Templates />
              </ProtectedRoute>
            } 
          />

          {/* Admin Route */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } 
          />

          {/* Moderator Route */}
          <Route 
            path="/moderator" 
            element={
              <ProtectedRoute>
                <Moderator />
              </ProtectedRoute>
            } 
          />

          {/* Teacher Dashboard Route */}
          <Route 
            path="/teacher-dashboard" 
            element={
              <ProtectedRoute>
                <TeacherDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Catch-All NotFound */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
