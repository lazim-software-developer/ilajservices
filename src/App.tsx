import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppWidget from "./components/WhatsAppWidget";
import Home from "./pages/Home";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import ImageVideoGallery from "./pages/ImageVideoGallery";
import Blogs from "./pages/Blogs";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import ProfessionalServices from "./pages/services/ProfessionalServices";
import HolidayHome from "./pages/services/HolidayHome";
import CorporateSolution from "./pages/services/CorporateSolution";
import ServiceBooking from "./pages/ServiceBooking";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import DailyLogs from "./pages/admin/DailyLogs";
import CustomerManagement from "./pages/admin/CustomerManagement";
import AllCustomers from "./pages/admin/customers/AllCustomers";
import AddCustomer from "./pages/admin/customers/AddCustomer";
import CustomerDetail from "./pages/admin/customers/CustomerDetail";
import CustomerEdit from "./pages/admin/customers/CustomerEdit";
import BookingManagement from "./pages/admin/BookingManagement";
import ServiceManagement from "./pages/admin/ServiceManagement";
import ServiceProviders from "./pages/admin/ServiceProviders";
import FinanceManagement from "./pages/admin/FinanceManagement";
import Reports from "./pages/admin/Reports";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/LicenseAgreement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />

              {/* Customer Management */}
              <Route path="customers" element={<AllCustomers />} />
              <Route path="customers/add" element={<AddCustomer />} />
              <Route path="customers/:id" element={<CustomerDetail />} />
              <Route path="customers/:id/edit" element={<CustomerEdit />} />
              <Route path="customers/b2c" element={<CustomerManagement />} />
              <Route path="customers/holiday-homes" element={<CustomerManagement />} />
              <Route path="customers/corporate" element={<CustomerManagement />} />

              {/* Booking & Operations */}
              <Route path="bookings" element={<BookingManagement />} />
              <Route path="tasks" element={<DailyLogs />} />
              <Route path="scheduling" element={<div className="p-6"><h1 className="text-3xl font-bold">Scheduling</h1><p>Scheduling management coming soon</p></div>} />

              {/* Services & Providers */}
              <Route path="services" element={<ServiceManagement />} />
              <Route path="service-providers" element={<ServiceProviders />} />
              <Route path="vendors" element={<ServiceProviders />} />
              <Route path="workers" element={<div className="p-6"><h1 className="text-3xl font-bold">Workers</h1><p>Worker management coming soon</p></div>} />
              <Route path="pricing" element={<div className="p-6"><h1 className="text-3xl font-bold">Pricing Rules</h1><p>Dynamic pricing rules coming soon</p></div>} />

              {/* Finance & Accounting */}
              <Route path="finance" element={<FinanceManagement />} />
              <Route path="invoices" element={<div className="p-6"><h1 className="text-3xl font-bold">Invoices</h1><p>Invoice management coming soon</p></div>} />
              <Route path="payments" element={<div className="p-6"><h1 className="text-3xl font-bold">Payments</h1><p>Payment management coming soon</p></div>} />
              <Route path="ledger" element={<div className="p-6"><h1 className="text-3xl font-bold">Ledger</h1><p>General ledger coming soon</p></div>} />
              <Route path="vat" element={<div className="p-6"><h1 className="text-3xl font-bold">VAT Management</h1><p>VAT management coming soon</p></div>} />

              {/* Marketing & Analytics */}
              <Route path="promotions" element={<div className="p-6"><h1 className="text-3xl font-bold">Promotions</h1><p>Promotion management coming soon</p></div>} />
              <Route path="reports" element={<Reports />} />
              <Route path="analytics" element={<div className="p-6"><h1 className="text-3xl font-bold">Analytics</h1><p>Business analytics coming soon</p></div>} />

              {/* System */}
              <Route path="notifications" element={<div className="p-6"><h1 className="text-3xl font-bold">Notifications</h1><p>Notification management coming soon</p></div>} />
              <Route path="integrations" element={<div className="p-6"><h1 className="text-3xl font-bold">Integrations</h1><p>Third-party integrations coming soon</p></div>} />
              <Route path="settings" element={<div className="p-6"><h1 className="text-3xl font-bold">Settings</h1><p>System settings coming soon</p></div>} />

              {/* Legacy routes for backward compatibility */}
              <Route path="daily-logs" element={<DailyLogs />} />
              <Route path="providers" element={<ServiceProviders />} />
            </Route>

            {/* Public Routes */}
            <Route path="/*" element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/image-video-gallery" element={<ImageVideoGallery />} />
                    <Route path="/blogs" element={<Blogs />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/services/professional" element={<ProfessionalServices />} />
                    <Route path="/services/professional/:serviceId" element={<ServiceBooking />} />
                    <Route path="/service-booking" element={<ServiceBooking />} />
                    <Route path="/services/holiday-home" element={<HolidayHome />} />
                    <Route path="/services/holiday-home/:serviceId" element={<ServiceBooking />} />
                    <Route path="/services/corporate" element={<CorporateSolution />} />
                    <Route path="/services/corporate/:serviceId" element={<ServiceBooking />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsAndConditions />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
                <WhatsAppWidget />
              </div>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;