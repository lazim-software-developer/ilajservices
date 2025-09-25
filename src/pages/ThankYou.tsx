import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Heart, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ThankYou = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [showLeaf, setShowLeaf] = useState(false);

  useEffect(() => {
    // Staggered animations for emotional impact
    const timer1 = setTimeout(() => setShowContent(true), 200);
    const timer2 = setTimeout(() => setShowIcon(true), 800);
    const timer3 = setTimeout(() => setShowMessage(true), 1200);
    const timer4 = setTimeout(() => setShowHeart(true), 1800);
    const timer5 = setTimeout(() => setShowLeaf(true), 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 flex items-center justify-center p-4">
      <Card className={`max-w-2xl w-full transform transition-all duration-1000 ease-out ${showContent ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}`}>
        <CardContent className="text-center p-8 lg:p-12 space-y-8">
          {/* Animated Check Icon */}
          <div className={`mx-auto w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center transform transition-all duration-700 ease-out ${showIcon ? 'scale-100 rotate-0' : 'scale-0 rotate-45'}`}>
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          {/* Main Message with staggered animation */}
          <div className={`space-y-6 transform transition-all duration-800 ease-out ${showMessage ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <h1 className="text-3xl lg:text-4xl font-bold text-primary animate-fade-in">
              Thank you for reaching out to ILAJ!
            </h1>
            
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Your request has been received with care, and our team is already preparing to assist you.
                <span className={`inline-block ml-2 transform transition-all duration-500 ${showHeart ? 'scale-100' : 'scale-0'}`}>
                  💙
                </span>
              </p>
              
              <p className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                At ILAJ, we believe every home, office, and space deserves attention, comfort, and peace of mind. 
                Rest assured, one of our experts will connect with you shortly to make things easier for you.
              </p>
              
              <p className="animate-fade-in font-medium text-primary" style={{ animationDelay: '0.6s' }}>
                Until then, take a deep breath — you've just handed the responsibility to a team that truly cares.
                <span className={`inline-block ml-2 transform transition-all duration-700 ${showLeaf ? 'scale-100 rotate-12' : 'scale-0 rotate-0'}`}>
                  🌿
                </span>
              </p>
            </div>
          </div>

          {/* Floating Hearts Animation */}
          <div className="relative overflow-hidden h-12">
            {[...Array(5)].map((_, i) => (
              <Heart
                key={i}
                className={`absolute w-4 h-4 text-primary/30 animate-float ${showHeart ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  left: `${20 + i * 15}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '3s'
                }}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transform transition-all duration-800 ease-out ${showMessage ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '0.8s' }}>
            <Button 
              size="lg" 
              onClick={() => navigate('/')}
              className="bg-gradient-primary hover:scale-105 transform transition-all duration-200"
            >
              Return Home
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/services')}
              className="hover:scale-105 transform transition-all duration-200"
            >
              Browse Services
            </Button>
          </div>

          {/* Contact Information */}
          <div className={`pt-6 border-t transform transition-all duration-800 ease-out ${showMessage ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '1s' }}>
            <p className="text-sm text-muted-foreground">
              Need immediate assistance? Call us at{' '}
              <a href="tel:+971600562624" className="text-primary font-medium hover:underline">
                +971 600 562624
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThankYou;