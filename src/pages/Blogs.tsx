import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, User, Clock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const Blogs = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (email.trim()) {
      setTimeout(() => {
        toast({
          title: "Welcome to the ILAJ family!",
          description: "You've successfully subscribed to our newsletter.",
        });
        setEmail("");
      }, 500);
    }
  };
  const blogPosts = [
    {
      title: "The Ultimate Guide to Deep Cleaning Your Home",
      excerpt: "Learn professional tips and techniques for deep cleaning every room in your house, from kitchen to bathroom.",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=300&fit=crop",
      author: "ILAJ Team",
      date: "March 15, 2024",
      readTime: "5 min read",
      category: "Cleaning Tips"
    },
    {
      title: "AC Maintenance: Why Regular Service Matters",
      excerpt: "Discover why regular AC maintenance is crucial for efficiency, air quality, and extending your unit's lifespan.",
      image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=300&fit=crop",
      author: "Ahmed Hassan",
      date: "March 10, 2024",
      readTime: "4 min read",
      category: "HVAC Tips"
    },
    {
      title: "Holiday Home Management: Complete Guide",
      excerpt: "Everything you need to know about maintaining and preparing your holiday home for guests.",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=300&fit=crop",
      author: "Sarah Ahmed",
      date: "March 5, 2024",
      readTime: "7 min read",
      category: "Property Management"
    },
    {
      title: "Eco-Friendly Cleaning Products: Benefits & Tips",
      excerpt: "Learn about the benefits of eco-friendly cleaning products and how to choose the right ones for your home.",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=300&fit=crop",
      author: "ILAJ Team",
      date: "February 28, 2024",
      readTime: "6 min read",
      category: "Green Living"
    },
    {
      title: "Pest Control: Prevention vs Treatment",
      excerpt: "Understanding the difference between prevention and treatment in pest control and which approach is best.",
      image: "https://images.unsplash.com/photo-1572020525351-3ca5c5962200?w=600&h=300&fit=crop",
      author: "Mohamed Ali",
      date: "February 20, 2024",
      readTime: "5 min read",
      category: "Pest Control"
    },
    {
      title: "Corporate Cleaning Standards: What to Expect",
      excerpt: "A comprehensive guide to professional cleaning standards for offices and commercial spaces.",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=300&fit=crop",
      author: "ILAJ Team",
      date: "February 15, 2024",
      readTime: "8 min read",
      category: "Business"
    }
  ];

  const categories = [
    "All Posts",
    "Cleaning Tips",
    "HVAC Tips", 
    "Property Management",
    "Green Living",
    "Pest Control",
    "Business"
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge className="bg-primary/10 text-primary border-primary/20">
            ILAJ Blog & Tips
          </Badge>
          <h1 className="text-3xl lg:text-5xl font-bold text-primary">
            Expert Tips & Insights
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay informed with the latest home maintenance tips, cleaning guides, 
            and industry insights from our team of professionals.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((category, index) => (
            <Button 
              key={index}
              variant={index === 0 ? "default" : "outline"}
              size="sm"
              className={index === 0 ? "bg-primary hover:bg-primary-hover" : ""}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {blogPosts.map((post, index) => (
            <Card key={index} className="group overflow-hidden hover:shadow-medium transition-all duration-300">
              <div className="relative overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="aspect-[2/1] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-secondary text-secondary-foreground">
                    {post.category}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground line-clamp-2">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                  
                  <Button variant="ghost" size="sm" className="group-hover:text-primary">
                    Read More <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-primary rounded-2xl text-white p-8 lg:p-12 text-center">
          <h2 className="text-2xl lg:text-4xl font-bold mb-4">
            Stay Inspired, Stay Fresh
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join the ILAJ circle and get more than just updates — receive practical care tips for homes, offices, and holiday stays, exclusive offers crafted for you, and insider know-how that keeps every space at its best.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 rounded-lg text-gray-900 flex-1"
            />
            <Button 
              onClick={handleSubscribe}
              className="bg-secondary hover:bg-secondary-hover text-secondary-foreground px-8"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogs;