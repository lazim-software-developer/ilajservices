import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, User, Clock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import acDuctCleaningBlog from "@/assets/ac-duct-cleaning-blog.jpg";
import holidayHomesBlog from "@/assets/holiday-homes-blog.jpg";
import hireCleaningCompanyBlog from "@/assets/hire-cleaning-company-blog.jpg";
import officeDeepCleaningBlog from "@/assets/office-deep-cleaning-blog.jpg";
import pestControlSeasonalBlog from "@/assets/pest-control-seasonal-blog.jpg";
import seasonalHandymanBlog from "@/assets/seasonal-handyman-blog.jpg";
import acDuctsEnergyBillsBlog from "@/assets/ac-ducts-energy-bills-blog.jpg";

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
      slug: "beat-the-heat-ac-duct-cleaning",
      title: "Beat the Heat and Dust: Get Ready for Summer with Our AC Duct Cleaning Service",
      excerpt: "As the summer sun begins to blaze and the dust settles, prepare your home for intense summer months with our professional AC duct cleaning service.",
      image: acDuctCleaningBlog,
      author: "ILAJ Team",
      date: "September 20, 2024",
      readTime: "6 min read",
      category: "HVAC Services"
    },
    {
      slug: "maximizing-profit-holiday-homes-dubai",
      title: "Maximizing Profit: The Power of Holiday Homes in Dubai's Housekeeping Industry",
      excerpt: "Dubai attracts millions of tourists every year. Discover how premium holiday homes can align with sustainability trends and wellness to maximize profitability.",
      image: holidayHomesBlog,
      author: "ILAJ Team",
      date: "September 18, 2024",
      readTime: "5 min read",
      category: "Holiday Homes"
    },
    {
      slug: "how-to-hire-cleaning-company",
      title: "How to Hire a Cleaning Company for Your Office or Home: A Step-by-Step Guide",
      excerpt: "Finding the right cleaning company can be daunting. Follow our comprehensive guide to make the best choice for your office or home cleaning needs.",
      image: hireCleaningCompanyBlog,
      author: "ILAJ Team",
      date: "September 15, 2024",
      readTime: "7 min read",
      category: "Cleaning Guide"
    },
    {
      slug: "office-deep-cleaning-productivity",
      title: "Office Deep Cleaning: Boosting Productivity with a Clean Workspace",
      excerpt: "A clean workspace enhances employee morale, productivity, and well-being. Discover how office deep cleaning can elevate your business to global standards.",
      image: officeDeepCleaningBlog,
      author: "ILAJ Team",
      date: "September 12, 2024",
      readTime: "5 min read",
      category: "Office Cleaning"
    },
    {
      slug: "seasonal-pest-control-guide",
      title: "Seasonal Pest Control: What to Expect and How to Prepare",
      excerpt: "As temperatures rise and summer approaches, so does pest activity. Learn what pests to expect and effective tips for keeping them at bay this season.",
      image: pestControlSeasonalBlog,
      author: "ILAJ Team",
      date: "September 10, 2024",
      readTime: "6 min read",
      category: "Pest Control"
    },
    {
      slug: "seasonal-handyman-checklist",
      title: "Seasonal Handyman Checklist: What to Tackle Throughout the Year",
      excerpt: "Breaking down home maintenance into seasonal checklists makes it manageable. Ensure your home stays in excellent condition year-round with our comprehensive guide.",
      image: seasonalHandymanBlog,
      author: "ILAJ Team",
      date: "September 8, 2024",
      readTime: "8 min read",
      category: "Home Maintenance"
    },
    {
      slug: "clean-ac-ducts-energy-bills",
      title: "The Impact of Clean AC Ducts on Your Energy Bills",
      excerpt: "Clean AC ducts contribute to healthier indoor air quality and have a significant impact on your energy bills. Learn how maintenance leads to cost savings.",
      image: acDuctsEnergyBillsBlog,
      author: "ILAJ Team",
      date: "September 5, 2024",
      readTime: "5 min read",
      category: "Energy Efficiency"
    }
  ];

  const categories = [
    "All Posts",
    "HVAC Services",
    "Holiday Homes",
    "Cleaning Guide",
    "Office Cleaning",
    "Pest Control",
    "Home Maintenance",
    "Energy Efficiency"
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
            <Link key={index} to={`/blog/${post.slug}`}>
              <Card className="group overflow-hidden hover:shadow-medium transition-all duration-300 h-full">
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
            </Link>
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