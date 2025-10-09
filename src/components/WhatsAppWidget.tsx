import { Button } from "@/components/ui/button";

const WhatsAppWidget = () => {
  const phoneNumber = "971600562624";
  const message = "Hi! I'd like to know more about your services.";
  
  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleWhatsAppClick}
        className="bg-transparent hover:opacity-80 rounded-full w-14 h-14 p-0 shadow-lg hover:shadow-xl transition-all duration-300 group border-0"
        aria-label="Chat on WhatsApp"
      >
        <img 
          src="/lovable-uploads/whatsapp.webp" 
          alt="WhatsApp" 
          className="h-14 w-14 group-hover:scale-110 transition-transform"
        />
      </Button>
    </div>
  );
};

export default WhatsAppWidget;