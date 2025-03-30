import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import HRSignUp from "./pages/HRSignUp";
import PostJob from "./pages/PostJob";
import HRDashboard from "./pages/HRDashboard";
import NotFound from "./pages/NotFound";
import InterviewSimulator from "./pages/InterviewSimulator";
import Profile from "./pages/Profile";
import CompanyJobs from "./pages/CompanyJobs";
import ResourcesPage from "./pages/ResourcesPage";
import ResourceDetail from "./pages/ResourceDetail";
import ResourceArticlePage from "./pages/ResourceArticlePage";
import ResourceCategoryPage from "./pages/ResourceCategoryPage";
import TechTrends2025Detail from "./pages/TechTrends2025Detail";
import ComparisonTool from "./pages/ComparisonTool";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import JobseekerDashboard from "./pages/JobseekerDashboard";
import Applications from "./pages/Applications";
import Navbar from "@/components/Navbar";
import HRNavbar from "@/components/HRNavbar";
import Footer from "@/components/Footer";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import HRVerificationPending from "./pages/HRVerificationPending";
import OTPVerification from "./pages/OTPVerification";

// Auth route component for protecting routes
const ProtectedRoute = ({ requiredRole, children }: { requiredRole?: "candidate" | "hr", children: React.ReactNode }) => {
  const { currentUser, userData, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }

  if (requiredRole && userData?.role !== requiredRole) {
    return requiredRole === "hr" ? 
      <Navigate to="/dashboard" replace /> : 
      <Navigate to="/hr-dashboard" replace />;
  }

  // Check if HR user needs OTP verification
  if (requiredRole === "hr" && userData?.role === "hr" && !userData?.otpVerified) {
    return <Navigate to="/otp-verification" replace />;
  }

  return <>{children}</>;
};

// Role-based layout components
const JobseekerLayout = () => (
  <>
    <Navbar />
    <div className="min-h-screen">
      <Outlet />
    </div>
    <Footer />
  </>
);

const HRLayout = () => (
  <>
    <HRNavbar />
    <div className="min-h-screen">
      <Outlet />
    </div>
    <Footer />
  </>
);

// Layout for pages that don't need Navbar/Footer
const CleanLayout = () => {
  return (
    <div className="min-h-screen">
      <div className="fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.history.back()}
          className="rounded-full bg-background/60 backdrop-blur-sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>
      <Outlet />
    </div>
  );
};

// RoleBasedLayout that determines which layout to show based on user role
const RoleBasedLayout = () => {
  const { userData } = useAuth();
  
  if (userData?.role === "hr") {
    return <HRLayout />;
  }
  
  return <JobseekerLayout />;
};

const AppRoutes = () => {
  const { currentUser } = useAuth();
  
  return (
    <Routes>
      {/* Public routes - landing page and auth routes */}
      <Route path="/" element={<RoleBasedLayout />}>
        <Route path="/" element={<Index />} />
      </Route>
      
      <Route element={<CleanLayout />}>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/hr-signup" element={<HRSignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        
        {/* New OTP verification route */}
        <Route path="/otp-verification" element={
          <ProtectedRoute>
            <OTPVerification />
          </ProtectedRoute>
        } />
      </Route>

      {/* Protected routes that require authentication */}
      <Route element={
        <ProtectedRoute>
          <RoleBasedLayout />
        </ProtectedRoute>
      }>
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/comparison" element={<ComparisonTool />} />
      </Route>
      
      {/* Routes with only back button - protected */}
      <Route element={<CleanLayout />}>
        <Route path="/jobs/:id" element={
          <ProtectedRoute>
            <JobDetails />
          </ProtectedRoute>
        } />
        <Route path="/interview" element={
          <ProtectedRoute>
            <InterviewSimulator />
          </ProtectedRoute>
        } />
        
        {/* Protected routes with specific roles */}
        <Route path="/profile" element={
          <ProtectedRoute requiredRole="candidate">
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute requiredRole="candidate">
            <JobseekerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/applications" element={
          <ProtectedRoute requiredRole="candidate">
            <Applications />
          </ProtectedRoute>
        } />
        <Route path="/hr-dashboard" element={
          <ProtectedRoute requiredRole="hr">
            <HRDashboard />
          </ProtectedRoute>
        } />
        <Route path="/post-job" element={
          <ProtectedRoute requiredRole="hr">
            <PostJob />
          </ProtectedRoute>
        } />
        
        <Route path="/companies/:company" element={
          <ProtectedRoute>
            <CompanyJobs />
          </ProtectedRoute>
        } />
        <Route path="/resources/:topic" element={
          <ProtectedRoute>
            <ResourceDetail />
          </ProtectedRoute>
        } />
        <Route path="/resources/company/:companyId" element={
          <ProtectedRoute>
            <ResourceDetail />
          </ProtectedRoute>
        } />
        <Route path="/resources/tech-trends-2025" element={
          <ProtectedRoute>
            <TechTrends2025Detail />
          </ProtectedRoute>
        } />
        <Route path="/resources/tech-trends-2025/:section" element={
          <ProtectedRoute>
            <TechTrends2025Detail />
          </ProtectedRoute>
        } />
        <Route path="/resources/article/:articleId" element={
          <ProtectedRoute>
            <ResourceArticlePage />
          </ProtectedRoute>
        } />
        <Route path="/resources/category/:categoryId" element={
          <ProtectedRoute>
            <ResourceCategoryPage />
          </ProtectedRoute>
        } />
        <Route path="/hr-verification-pending" element={
          <ProtectedRoute requiredRole="hr">
            <HRVerificationPending />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

const App = () => (
  <AuthProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </AuthProvider>
);

export default App;
