import { useParams } from "react-router-dom";
import GamifiedServiceBooking from "@/components/GamifiedServiceBooking";

const ServiceBooking = () => {
  const { serviceId } = useParams();

  // Mock service data - in real app, this would come from API based on serviceId
  const getServiceData = (serviceId: string) => {
    const services = {
      "maid-service": {
        title: "Maid Service",
        description: "Professional and reliable maid service for regular home maintenance and cleaning.",
        basePrice: 80,
        image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&h=400&fit=crop",
        duration: "2-6 hours",
        category: "Professional Service",
        serviceType: "maid-service"
      },
      "deep-cleaning": {
        title: "Deep Cleaning Service",
        description: "Complete deep cleaning for your home with professional equipment and eco-friendly products.",
        basePrice: 150,
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop",
        duration: "3-4 hours",
        category: "Professional Service",
        serviceType: "deep-cleaning"
      }
    };

    return services[serviceId as keyof typeof services] || services["deep-cleaning"];
  };

  const serviceData = getServiceData(serviceId || "deep-cleaning");

  return <GamifiedServiceBooking serviceData={serviceData} />;
};

export default ServiceBooking;