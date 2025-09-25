import { useParams, Navigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User, Clock, ArrowLeft, ArrowRight, Share2, Facebook, Twitter, Linkedin, Copy } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import acDuctCleaningBlog from "@/assets/ac-duct-cleaning-blog.jpg";
import holidayHomesBlog from "@/assets/holiday-homes-blog.jpg";
import hireCleaningCompanyBlog from "@/assets/hire-cleaning-company-blog.jpg";
import officeDeepCleaningBlog from "@/assets/office-deep-cleaning-blog.jpg";
import pestControlSeasonalBlog from "@/assets/pest-control-seasonal-blog.jpg";
import seasonalHandymanBlog from "@/assets/seasonal-handyman-blog.jpg";
import acDuctsEnergyBillsBlog from "@/assets/ac-ducts-energy-bills-blog.jpg";

const BlogPost = () => {
  const { slug } = useParams();

  const blogPosts = [
    {
      slug: "beat-the-heat-ac-duct-cleaning",
      title: "Beat the Heat and Dust: Get Ready for Summer with Our AC Duct Cleaning Service",
      excerpt: "As the summer sun begins to blaze and the dust settles, prepare your home for intense summer months with our professional AC duct cleaning service.",
      image: acDuctCleaningBlog,
      author: "ILAJ Team",
      date: "September 20, 2024",
      readTime: "6 min read",
      category: "HVAC Services",
      content: `
        <p>As the summer sun begins to blaze and the dust of the season settles in, it's time to prepare your home for the intense summer months ahead. Your air conditioning system requires special care to ensure it's operating at peak performance. That's where our AC duct cleaning service comes in.</p>

        <h2>Why AC Duct Cleaning Matters:</h2>

        <h3>Improved Air Quality:</h3>
        <p>Over time, dust, pollen, and other contaminants accumulate within your AC ducts, circulating throughout your home and compromising indoor air quality. Our duct cleaning service eliminates these pollutants, ensuring your family breathes clean, fresh air.</p>

        <h3>Enhanced Efficiency:</h3>
        <p>A buildup of debris in your ductwork restricts airflow, forcing your AC system to work harder to cool your home. By removing these obstructions, our service improves airflow, reduces energy consumption, and extends the lifespan of your system.</p>

        <h3>Health Benefits:</h3>
        <p>Dust and allergens trapped in your ducts can exacerbate respiratory issues and allergies. By eliminating these irritants, our cleaning service creates a healthier indoor environment for you and your loved ones.</p>

        <h3>Odor Elimination:</h3>
        <p>Lingering odors in your home can be unpleasant and difficult to eradicate. Our comprehensive duct cleaning removes mold, mildew, and other sources of odor, leaving your home smelling fresh and inviting.</p>

        <h2>Why Choose Our Service:</h2>

        <h3>Expertise and Experience:</h3>
        <p>Our team consists of trained professionals with years of experience in HVAC maintenance and duct cleaning. We use advanced equipment and proven techniques to deliver superior results every time.</p>

        <h3>Thorough Cleaning Process:</h3>
        <p>We leave no stone unturned in our quest to rid your ducts of dust and debris. From the main supply and return ducts to individual vents and registers, we ensure every inch of your ductwork is thoroughly cleaned.</p>

        <h3>Convenience and Efficiency:</h3>
        <p>We understand the importance of convenience, especially during the busy summer months. Our team works quickly and efficiently to minimize disruption to your daily routine, allowing you to enjoy the benefits of our service with minimal hassle.</p>

        <h3>Affordable Pricing:</h3>
        <p>We believe that everyone deserves a comfortable, healthy home. That's why we offer competitive pricing for our AC duct cleaning service, making it accessible to homeowners of all budgets.</p>

        <h2>Prepare Your Home for Summer with Us:</h2>
        <p>Don't let heat and dust put a damper on your summer plans. Prepare your home for the season ahead with our professional AC duct cleaning service. Contact us today to schedule an appointment and experience the difference clean ducts can make in your indoor comfort and wellbeing. Beat the heat, banish the dust, and embrace a summer of cool, refreshing air with us by your side.</p>
      `
    },
    {
      slug: "maximizing-profit-holiday-homes-dubai",
      title: "Maximizing Profit: The Power of Holiday Homes in Dubai's Housekeeping Industry",
      excerpt: "Dubai attracts millions of tourists every year. Discover how premium holiday homes can align with sustainability trends and wellness to maximize profitability.",
      image: holidayHomesBlog,
      author: "ILAJ Team",
      date: "September 18, 2024",
      readTime: "5 min read",
      category: "Holiday Homes",
      content: `
        <p>Dubai attracts millions of tourists every year, drawn by its glamorous attractions and vibrant culture. Consequently, the demand for premium accommodation experiences is perennially high. Holiday homes, with their diverse offerings ranging from chic apartments to sprawling villas, cater to this demand by providing a personalized and exclusive stay.</p>

        <h2>Embracing Sustainability and Wellness Trends:</h2>
        <p>In recent years, sustainability and wellness have emerged as pivotal trends shaping consumer preferences in the hospitality sector. Holiday homes have a unique opportunity to align with these trends and differentiate themselves in the market.</p>

        <p>Implementing eco-friendly housekeeping practices, such as using biodegradable cleaning products and adopting energy-efficient systems, not only reduces environmental impact but also resonates with eco-conscious travelers. Likewise, incorporating wellness-oriented amenities and services, such as organic toiletries and in-room yoga sessions, adds value to the guest experience and fosters loyalty.</p>

        <p>By embracing sustainability and wellness trends, holiday home operators can attract a niche market segment and command premium prices, thereby enhancing profitability in the long run.</p>

        <h2>Cultivating a Culture of Excellence:</h2>
        <p>In Dubai's competitive hospitality landscape, excellence is not just a goal but a necessity for sustained success. Housekeeping in holiday homes plays a pivotal role in upholding standards of excellence and fostering a culture of hospitality.</p>

        <p>Moreover, fostering a culture of excellence extends beyond operational aspects to encompass guest engagement and community building. By curating memorable experiences and forging genuine connections with guests, holiday home operators can cultivate loyalty and drive positive word-of-mouth referrals, laying the foundation for long-term profitability.</p>

        <h2>Conclusion:</h2>
        <p>Through a strategic blend of personalized services, technological innovation, sustainability initiatives, and a relentless pursuit of excellence, holiday homes can emerge as veritable hubs of hospitality, enriching the travel experiences of visitors to Dubai and redefining the paradigm of housekeeping profitability in the process.</p>

        <p>Streamline your vendor management effortlessly with Lazim! Our all-in-one platform simplifies the process, empowering you to efficiently manage vendors, streamline communication, and drive success.</p>
      `
    },
    {
      slug: "how-to-hire-cleaning-company",
      title: "How to Hire a Cleaning Company for Your Office or Home: A Step-by-Step Guide",
      excerpt: "Finding the right cleaning company can be daunting. Follow our comprehensive guide to make the best choice for your office or home cleaning needs.",
      image: hireCleaningCompanyBlog,
      author: "ILAJ Team",
      date: "September 15, 2024",
      readTime: "7 min read",
      category: "Cleaning Guide",
      content: `
        <p>Maintaining a clean and organized environment is essential for both productivity and well-being, whether it's in your office space or your home. However, finding the right cleaning company to entrust with this task can be a daunting task. To ensure you make the best choice, follow this step-by-step guide on how to hire a cleaning company for your office or home.</p>

        <h2>1. Gather References and Reviews</h2>
        <p>Start your search by gathering recommendations from friends, family, colleagues, or neighbors who have used cleaning services before. Their firsthand experiences can provide valuable insights into the quality of service and professionalism of different cleaning companies.</p>

        <p>Additionally, explore online reviews and ratings on platforms like Google, Facebook and references. Pay attention to both positive and negative feedback to get a balanced perspective on each company's reputation and reliability.</p>

        <h2>2. Consider Their Experience in the Industry</h2>
        <p>Experience matters when it comes to cleaning services. Look for companies that have been in the industry for several years and have a proven track record of delivering high-quality results.</p>

        <p>An established cleaning company is more likely to have experienced and well-trained staff, as well as efficient processes and systems in place. They are also better equipped to handle various cleaning challenges and adapt to the unique needs of different clients.</p>

        <h2>3. Explore Their Services</h2>
        <p>Before making a decision, carefully review the range of services offered by each cleaning company. While some may specialize in residential cleaning, others may focus on commercial or industrial cleaning.</p>

        <p>Consider your specific requirements and ensure that the cleaning company you choose offers the services you need. This may include basic tasks like dusting, vacuuming, and mopping, as well as more specialized services like carpet cleaning, window washing, or deep cleaning.</p>

        <h2>4. Schedule a Trial Run</h2>
        <p>Once you've narrowed down your options, consider scheduling a trial run with one or two cleaning companies. This will allow you to assess their professionalism, reliability, and attention to detail firsthand.</p>

        <p>During the trial run, communicate your expectations clearly and provide access to the areas that need cleaning. Take note of the thoroughness of their work, the efficiency of their cleaning process, and their overall demeanor and attitude.</p>

        <h2>Conclusion:</h2>
        <p>Hiring a cleaning company for your office or home is a decision that shouldn't be taken lightly. By following this step-by-step guide and conducting thorough research, you can find a reputable and reliable cleaning company that meets your needs and exceeds your expectations. From gathering references and reviews to considering experience, exploring services, and scheduling a trial run, each step plays a crucial role in ensuring you make the right choice for a clean and inviting environment.</p>
      `
    },
    {
      slug: "office-deep-cleaning-productivity",
      title: "Office Deep Cleaning: Boosting Productivity with a Clean Workspace",
      excerpt: "A clean workspace enhances employee morale, productivity, and well-being. Discover how office deep cleaning can elevate your business to global standards.",
      image: officeDeepCleaningBlog,
      author: "ILAJ Team",
      date: "September 12, 2024",
      readTime: "5 min read",
      category: "Office Cleaning",
      content: `
        <p>Dubai is a hub for global business and each one is in a race to be the best in the industry. It is very significant for every workspace to be clean to elevate the business to the global standards. Beyond just cleanliness, maintaining a well-maintained office environment plays a pivotal role in enhancing employee morale, productivity, and overall well-being.</p>

        <p>At Ilaj we understand the importance and impact of a clean workspace. Our dedicated staff is committed to providing comprehensive office deep cleaning services tailored to meet the unique needs of your business.</p>

        <h2>Here are some facts about how office cleanliness aids business to achieve greater heights:</h2>

        <h3>Positive Energy:</h3>
        <p>A clean and clutter-free environment fosters a sense of positivity and well-being among employees. Walking into a sparkling clean office sets a positive tone for the day, boosting morale and promoting a can-do attitude.</p>

        <h3>Enhanced Focus:</h3>
        <p>A tidy workspace promotes clarity of mind and enhances focus. By eliminating distractions such as dust, dirt, and clutter, employees can concentrate better on their tasks, leading to improved productivity and efficiency.</p>

        <h3>Health and Wellness:</h3>
        <p>A clean office environment is essential for maintaining the health and wellness of your employees. Regular deep cleaning helps eliminate germs, bacteria, and allergens, reducing the risk of illness and health hazards. A healthy workforce always motivates employees to be productive.</p>

        <h3>Professional Image:</h3>
        <p>Your office is a reflection of your brand and business values. A clean and well-maintained workspace creates a positive impression on clients, visitors, and potential partners, instilling confidence and trust in your professionalism and attention to detail.</p>

        <p>At Ilaj Services we take pride in our meticulous approach to office deep cleaning. Our team of experienced professionals utilizes advanced cleaning techniques, eco-friendly products, and modern equipment to deliver exceptional results with minimal disruption to your business operations.</p>

        <p>Investing in regular office deep cleaning is not just an expense; it's an investment in the success and growth of your business. Let us help you create a clean, healthy, and productive workspace where your employees can thrive and your business can flourish.</p>

        <p>We are happy to be part of your journey towards success by providing our services, just a call or email away.</p>

        <p>Feel free to reach out at 050 517 9880 or email at bd@ilaj.ae visit us www.ilaj.ae</p>
      `
    },
    {
      slug: "seasonal-pest-control-guide",
      title: "Seasonal Pest Control: What to Expect and How to Prepare",
      excerpt: "As temperatures rise and summer approaches, so does pest activity. Learn what pests to expect and effective tips for keeping them at bay this season.",
      image: pestControlSeasonalBlog,
      author: "ILAJ Team",
      date: "September 10, 2024",
      readTime: "6 min read",
      category: "Pest Control",
      content: `
        <p>As temperatures rise and summer approaches, so does the activity of various pests. From ants invading your kitchen to mosquitoes buzzing around your balcony, seasonal pest control becomes a crucial task for home owners. Understanding what pests to expect and how to prepare for them can help you enjoy a pest-free summer. In this blog post, we'll explore common summer pests and provide effective tips for keeping them at bay.</p>

        <h2>Common Summer Pests:</h2>
        <ul>
          <li><strong>Mosquitoes:</strong> With their itchy bites and potential for spreading diseases like West Nile virus and Zika virus, mosquitoes are unwelcome guests during summer months.</li>
          <li><strong>Ants:</strong> Whether they're foraging for food indoors or building nests in your garden, ants can be a nuisance during summer.</li>
          <li><strong>Flies:</strong> House flies and fruit flies are prevalent during warm weather, attracted to food and organic waste.</li>
          <li><strong>Bees and Wasps:</strong> These stinging insects become more active in summer as they seek out food sources and build nests.</li>
          <li><strong>Cockroaches:</strong> Cockroaches thrive in warm and humid conditions, making summer the peak season for infestations.</li>
        </ul>

        <h2>Preparing for Summer Pests</h2>
        <ul>
          <li><strong>Seal Entry Points:</strong> Inspect your home for cracks, gaps, and openings where pests can enter. Seal them with caulk or weather stripping to prevent infestations.</li>
          <li><strong>Remove Standing Water:</strong> Mosquitoes breed in stagnant water, so eliminate any standing water sources in your yard, such as birdbaths, clogged gutters, and flowerpot saucers.</li>
          <li><strong>Keep Food Sealed:</strong> Store food in airtight containers to prevent ants and flies from being attracted to your kitchen.</li>
          <li><strong>Maintain Cleanliness:</strong> Regularly clean counter tops, floors, and other surfaces to remove crumbs and spills that can attract pests.</li>
          <li><strong>Trim Vegetation:</strong> Keep grass and shrubs trimmed, and remove any debris from your yard to reduce harborage areas for pests like ants and cockroaches.</li>
          <li><strong>Install Screens:</strong> Ensure that windows and doors are equipped with screens to prevent mosquitoes and flies from entering your home.</li>
          <li><strong>Dispose of Garbage Properly:</strong> Keep garbage cans tightly sealed and empty them regularly to avoid attracting pests.</li>
          <li><strong>Professional Pest Control:</strong> If you're dealing with a persistent pest problem or are unsure how to effectively manage it, consider hiring a professional pest control service. Pest control experts have the knowledge, tools, and experience to identify and address pest infestations safely and effectively.</li>
        </ul>

        <h2>Conclusion:</h2>
        <p>By being proactive and implementing preventive measures, you can minimize the impact of summer pests on your home and enjoy a pest-free season. From sealing entry points to maintaining cleanliness and seeking professional help when needed, taking these steps will help you keep pests at bay and enjoy a comfortable summer indoors and outdoors alike. Stay vigilant, stay prepared, and bid farewell to unwanted summertime guests!</p>

        <p>If you are looking for an expert's advice feel free to reach out we will be more than happy to propose you the best practices to stay away from the pests. Write to us at bd@ilaj.ae or call us at 600 562624.</p>
      `
    },
    {
      slug: "seasonal-handyman-checklist",
      title: "Seasonal Handyman Checklist: What to Tackle Throughout the Year",
      excerpt: "Breaking down home maintenance into seasonal checklists makes it manageable. Ensure your home stays in excellent condition year-round with our comprehensive guide.",
      image: seasonalHandymanBlog,
      author: "ILAJ Team",
      date: "September 8, 2024",
      readTime: "8 min read",
      category: "Home Maintenance",
      content: `
        <p>Maintaining a home can be a daunting task, but breaking down maintenance into seasonal checklists can make it much more manageable. By addressing specific tasks each season, you can ensure your home stays in excellent condition year-round. Here's a comprehensive guide to what you should tackle throughout the year to keep your home in top shape.</p>

        <h2>Spring: Renewal and Refresh</h2>
        <ul>
          <li><strong>Inspect the Roof and Gutters:</strong> Check for missing or damaged shingles and clean out the gutters to prevent water damage from spring rains.</li>
          <li><strong>Test Smoke and Carbon Monoxide Detectors:</strong> Replace batteries and test all alarms to ensure they're functioning correctly.</li>
          <li><strong>Service HVAC Systems:</strong> Clean or replace air filters, and schedule a professional inspection and tune-up of your air conditioning system.</li>
          <li><strong>Exterior Cleaning:</strong> Power wash siding, decks, and driveways to remove dirt, mildew, and mold buildup.</li>
          <li><strong>Lawn and Garden Prep:</strong> Clean up winter debris, fertilize the lawn, and prepare flower beds for planting.</li>
        </ul>

        <h2>Summer: Focus on Outdoor Projects</h2>
        <ul>
          <li><strong>Check and Clean Outdoor Furniture:</strong> Inspect for any damage and clean thoroughly before use.</li>
          <li><strong>Inspect Windows and Doors:</strong> Check seals and caulking around windows and doors to ensure they are energy-efficient and free of leaks.</li>
          <li><strong>Inspect and Clean the Deck:</strong> Look for loose boards or nails, and apply a fresh coat of sealant if necessary.</li>
          <li><strong>Pool Maintenance:</strong> If you have a pool, ensure it's cleaned regularly and that all equipment is functioning properly.</li>
        </ul>

        <h2>Fall: Prepare for Colder Weather</h2>
        <ul>
          <li><strong>Clean Gutters and Downspouts:</strong> Remove leaves and debris to prevent clogs and water damage during fall rains.</li>
          <li><strong>Check Insulation:</strong> Inspect attic and wall insulation to ensure your home will stay warm during the winter months.</li>
          <li><strong>Seal Cracks and Gaps:</strong> Seal any gaps or cracks in windows, doors, and foundations to keep out drafts and pests.</li>
        </ul>

        <h2>Year Round: Monthly Essentials</h2>
        <ul>
          <li><strong>Check HVAC Filters:</strong> Inspect and replace filters monthly to ensure efficient operation of heating and cooling systems.</li>
          <li><strong>Inspect Fire Extinguishers:</strong> Ensure they are fully charged and easily accessible.</li>
          <li><strong>Clean Garbage Disposal:</strong> Freshen and clean with baking soda and vinegar to prevent clogs and odors.</li>
          <li><strong>Test GFCI Outlets:</strong> Ensure they are working properly to prevent electrical hazards.</li>
          <li><strong>General Clean-Up:</strong> Regularly declutter and clean both the interior and exterior of your home to maintain its overall condition.</li>
        </ul>

        <p>By following this seasonal handyman checklist, you can stay on top of home maintenance tasks, prevent costly repairs, and keep your home safe and comfortable throughout the year. Regular upkeep not only preserves your property's value but also enhances your living experience. Happy home maintaining!</p>

        <p>If you are looking for an expert's advice feel free to reach out we will be more than happy to assist you. Write to us at bd@ilaj.ae or call us at 600 562624.</p>
      `
    },
    {
      slug: "clean-ac-ducts-energy-bills",
      title: "The Impact of Clean AC Ducts on Your Energy Bills",
      excerpt: "Clean AC ducts contribute to healthier indoor air quality and have a significant impact on your energy bills. Learn how maintenance leads to cost savings.",
      image: acDuctsEnergyBillsBlog,
      author: "ILAJ Team",
      date: "September 5, 2024",
      readTime: "5 min read",
      category: "Energy Efficiency",
      content: `
        <p>As temperatures soar, we often rely heavily on air conditioning to keep our homes comfortable. However, many overlook a critical component of their HVAC system: the air ducts. Clean AC ducts not only contribute to healthier indoor air quality but also have a significant impact on your energy bills. Let's explore how maintaining clean air ducts can lead to cost savings and a more efficient home.</p>

        <h2>Improved Airflow and System Efficiency</h2>
        <p>When air ducts are clogged with dust, dirt, and debris, your HVAC system has to work harder to push air through the vents. This increased effort not only strains the system but also consumes more energy. Clean air ducts allow for smooth and unrestricted airflow, enabling your HVAC system to operate efficiently. As a result, your air conditioner doesn't have to run as long or as often to achieve the desired temperature, leading to lower energy consumption and reduced utility bills.</p>

        <h2>Enhanced Cooling Performance</h2>
        <p>Clean air ducts ensure that the cooled air produced by your AC reaches every corner of your home without obstruction. This even distribution of cool air means that your system can maintain a consistent temperature more easily, avoiding the need for constant adjustments. In contrast, blocked or dirty ducts can cause uneven cooling, prompting you to lower the thermostat setting, which further increases energy use.</p>

        <h2>Reduced Wear and Tear on Your HVAC System</h2>
        <p>A well-maintained HVAC system is less prone to breakdowns and requires fewer repairs. Dirty ducts can cause dust and debris to accumulate in other parts of the system, such as the coils and blower motor. This buildup can reduce efficiency and lead to costly repairs or even system failure. By regularly cleaning your air ducts, you can extend the lifespan of your HVAC system, reducing the frequency of repairs and the likelihood of premature replacement.</p>

        <h2>Lowered Heating and Cooling Costs</h2>
        <p>A cleaner HVAC system, free from the burden of dirty ducts, operates more efficiently and consumes less energy. This efficiency directly translates to lower heating and cooling costs. The U.S. Department of Energy estimates that homeowners can save up to 20% on their energy bills by properly maintaining their HVAC systems, including regular duct cleaning.</p>

        <h2>Health Benefits and Enhanced Comfort</h2>
        <p>In addition to energy savings, clean air ducts contribute to a healthier indoor environment. Dust, allergens, mold, and other contaminants can accumulate in dirty ducts and circulate throughout your home, potentially causing respiratory issues and allergic reactions. By keeping your ducts clean, you can improve indoor air quality and create a healthier living space for you and your family.</p>

        <h2>Conclusion</h2>
        <p>Maintaining clean AC ducts is an essential part of ensuring your HVAC system's efficiency and longevity. The benefits extend beyond just lower energy bills; they include improved comfort, healthier indoor air quality, and reduced repair costs. By scheduling regular duct cleaning and staying on top of HVAC maintenance, you can enjoy a more efficient system and a comfortable, energy-efficient home. Don't let dirty ducts drain your wallet—take proactive steps to keep your HVAC system running smoothly and efficiently.</p>

        <p>If you wish to speak to an expert for advice, feel free to reach out to 600 562 624 or write to us at info@ilaj.ae</p>
      `
    }
  ];

  const currentPost = blogPosts.find(post => post.slug === slug);
  const currentIndex = blogPosts.findIndex(post => post.slug === slug);
  
  if (!currentPost) {
    return <Navigate to="/blogs" replace />;
  }

  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : blogPosts[0];

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = currentPost.title;
    
    let shareUrl = "";
    
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        toast({
          title: "Link copied!",
          description: "Blog post link has been copied to clipboard.",
        });
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link to="/blogs" className="inline-flex items-center gap-2 text-primary hover:text-primary-hover mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Blogs
        </Link>

        {/* Article Header */}
        <article className="space-y-8">
          <div className="space-y-6">
            <Badge className="bg-secondary text-secondary-foreground">
              {currentPost.category}
            </Badge>
            
            <h1 className="text-3xl lg:text-5xl font-bold text-primary leading-tight">
              {currentPost.title}
            </h1>
            
            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{currentPost.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{currentPost.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{currentPost.readTime}</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative overflow-hidden rounded-2xl">
            <img 
              src={currentPost.image} 
              alt={currentPost.title}
              className="w-full aspect-[2/1] object-cover"
            />
          </div>

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none text-foreground prose-headings:text-primary prose-h2:text-2xl prose-h3:text-xl prose-p:text-muted-foreground prose-li:text-muted-foreground prose-ul:space-y-2 prose-strong:text-foreground"
            dangerouslySetInnerHTML={{ __html: currentPost.content }}
          />

          {/* Social Sharing */}
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-primary">Share this article</h3>
                  <p className="text-sm text-muted-foreground">Help others discover this valuable content</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare("facebook")}
                    className="flex items-center gap-2"
                  >
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare("twitter")}
                    className="flex items-center gap-2"
                  >
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare("linkedin")}
                    className="flex items-center gap-2"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare("copy")}
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Blog Post */}
          <Card className="p-6 bg-gradient-primary text-white">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <p className="text-sm text-white/80">Next Article</p>
                  <h3 className="text-xl font-semibold line-clamp-2">
                    {nextPost.title}
                  </h3>
                  <p className="text-white/90 line-clamp-2">
                    {nextPost.excerpt}
                  </p>
                </div>
                
                <Link to={`/blog/${nextPost.slug}`}>
                  <Button 
                    className="bg-secondary hover:bg-secondary-hover text-secondary-foreground flex items-center gap-2"
                  >
                    Read Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;