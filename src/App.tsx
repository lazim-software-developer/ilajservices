import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import ImageVideoGallery from "./pages/ImageVideoGallery";
import Blogs from "./pages/Blogs";
import Contact from "./pages/Contact";
import ProfessionalServices from "./pages/services/ProfessionalServices";
import HolidayHome from "./pages/services/HolidayHome";
import CorporateSolution from "./pages/services/CorporateSolution";
import ServiceBooking from "./pages/ServiceBooking";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/image-video-gallery" element={<ImageVideoGallery />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/services/professional" element={<ProfessionalServices />} />
              <Route path="/services/professional/:serviceId" element={<ServiceBooking />} />
              <Route path="/services/holiday-home" element={<HolidayHome />} />
              <Route path="/services/holiday-home/:serviceId" element={<ServiceBooking />} />
              <Route path="/services/corporate" element={<CorporateSolution />} />
              <Route path="/services/corporate/:serviceId" element={<ServiceBooking />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;