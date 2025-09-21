import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowLeft } from 'lucide-react';

const pressReleases = [
  { 
    id: 1, 
    title: 'PedalBharat Raises ₹50 Crores in Series A Funding', 
    date: 'December 15, 2024', 
    category: 'Funding', 
    summary: 'Leading cycling e-commerce platform secures significant funding to expand operations across India and enhance technology infrastructure.', 
    image: '/placeholder.svg', 
    content: `PedalBharat, India's fastest-growing cycling e-commerce platform, today announced the successful completion of its Series A funding round, raising ₹50 crores from leading venture capital firms and strategic investors.

**Funding Details and Investors**

The round was led by Sequoia Capital India, with participation from Accel Partners, Kalaari Capital, and several high-net-worth individuals from the cycling and sports industry. This brings PedalBharat's total funding to ₹65 crores since its inception in 2021.

**Strategic Use of Funds**

The fresh capital will be strategically deployed across multiple growth initiatives:

*Technology Infrastructure Enhancement*
₹20 crores will be invested in upgrading the technology platform, including:
- Advanced AI-powered product recommendation systems
- Enhanced mobile application with AR try-on features
- Improved logistics and inventory management systems
- Development of a comprehensive cycling community platform

*Market Expansion*
₹15 crores allocated for geographic expansion:
- Establishing presence in 50 new cities across India
- Opening 10 new experience centers in major metropolitan areas
- Strengthening last-mile delivery network in tier-2 and tier-3 cities
- International expansion feasibility studies for Southeast Asian markets

*Supply Chain Optimization*
₹10 crores dedicated to supply chain improvements:
- Strategic partnerships with international cycling brands
- Investment in warehouse automation and robotics
- Development of private label cycling products
- Implementation of sustainable packaging solutions

*Team Building and Talent Acquisition*
₹5 crores earmarked for human capital development:
- Hiring senior leadership across technology, operations, and marketing
- Establishing centers of excellence in Bengaluru and Mumbai
- Employee stock option program expansion
- Comprehensive training and development programs

**Company Performance Metrics**

PedalBharat has demonstrated exceptional growth since its last funding round:
- 300% year-over-year revenue growth
- Customer base expansion to 500,000+ active users
- Product catalog growth to over 50,000 SKUs
- Partnership with 200+ international and domestic cycling brands
- Geographic presence in 100+ cities across India

**Market Position and Competitive Advantage**

The funding validates PedalBharat's unique position in the Indian cycling market:

*Comprehensive Product Range*
From entry-level bicycles to professional racing equipment, PedalBharat offers the most extensive cycling product catalog in India, catering to all customer segments and use cases.

*Technology-First Approach*
The platform's recommendation engine, powered by machine learning, provides personalized product suggestions based on individual cycling needs, experience levels, and budget constraints.

*Community Building*
Beyond e-commerce, PedalBharat has built India's largest online cycling community with over 100,000 active members sharing routes, tips, and experiences.

*After-Sales Excellence*
Comprehensive warranty support, professional assembly services, and nationwide service network distinguish PedalBharat from traditional retail competitors.

**Future Vision and Strategic Goals**

With this funding, PedalBharat aims to achieve several strategic objectives by 2026:

*Market Leadership*
Capture 25% market share in India's organized cycling retail sector, establishing clear leadership in the premium and mid-market segments.

*Innovation Hub*
Become India's primary innovation center for cycling technology, supporting local startups and international brands in product development.

*Sustainability Champion*
Lead the industry in sustainable practices, from eco-friendly packaging to carbon-neutral delivery options and bicycle recycling programs.

*Community Platform*
Evolve from pure e-commerce to a comprehensive cycling lifestyle platform, including event management, training programs, and cycling tourism.

**Economic and Social Impact**

The funding is expected to create significant economic impact:
- Direct employment for 500+ individuals across various functions
- Indirect employment for 2,000+ delivery partners and service technicians  
- Support for local cycling accessory manufacturers and service providers
- Contribution to India's growing sports and fitness economy

**Conclusion**

This Series A funding marks a pivotal moment for PedalBharat and the Indian cycling industry. With enhanced resources and continued focus on innovation, customer experience, and market expansion, PedalBharat is positioned to drive the transformation of cycling culture in India while building a sustainable and profitable business model.` 
  },
  { 
    id: 2, 
    title: 'PedalBharat Partners with International Cycling Brands', 
    date: 'November 28, 2024', 
    category: 'Partnership', 
    summary: 'Strategic partnerships with global cycling manufacturers to bring premium products to Indian cycling enthusiasts.', 
    image: '/placeholder.svg', 
    content: `PedalBharat today announced strategic partnerships with five leading international cycling brands, significantly expanding its premium product portfolio and strengthening its position as India's premier cycling destination.

**Partnership Portfolio**

The new partnerships include collaborations with:

*Trek Bicycles (USA)*
Exclusive online distribution rights for Trek's performance road and mountain bike series in India. This partnership brings world-class carbon fiber technology and professional racing heritage to Indian consumers.

*Specialized Components (USA)*  
Comprehensive partnership covering Specialized's innovative bicycle technology, including their Brain suspension systems, SWAT integrated storage solutions, and S-Works professional component lines.

*Shimano (Japan)*
Enhanced partnership expanding beyond components to include Shimano's complete ecosystem of cycling technology, including electronic shifting systems, power meters, and integrated cycling computers.

*Continental Tires (Germany)*
Exclusive distribution agreement for Continental's premium cycling tire range, including their Grand Prix and Terra series designed for diverse road conditions found across India.

*Garmin (USA)*
Strategic alliance for cycling-specific GPS devices, training systems, and safety equipment tailored for Indian market needs and riding conditions.

**Strategic Benefits for Indian Cyclists**

*Product Availability*
These partnerships ensure consistent availability of international premium products without the traditional wait times and import complexities that have historically limited access to cutting-edge cycling technology.

*Localized Support*
Each partner provides dedicated technical support, warranty services, and training programs specifically designed for Indian market conditions and customer needs.

*Competitive Pricing*
Direct partnerships eliminate multiple intermediary markups, making premium international cycling products more accessible to Indian enthusiasts while maintaining authentic quality and warranty coverage.

*Innovation Access*
Indian cyclists gain immediate access to latest technological innovations, often launching simultaneously with global markets rather than the traditional 6-12 month delays.

**Market Localization Initiatives**

Understanding India's unique cycling environment, these partnerships include specific localization efforts:

*Climate Adaptation*
Products are tested and optimized for India's diverse climate conditions, from Himalayan cold to tropical humidity, ensuring consistent performance across the subcontinent.

*Road Surface Optimization*
Tire compounds and suspension tuning are adapted for Indian road conditions, which vary significantly from the smooth surfaces common in traditional cycling markets.

*Service Network Development*
Comprehensive training programs for local mechanics and service centers ensure professional-grade maintenance and repair capabilities in major Indian cities.

**Technology Transfer and Knowledge Sharing**

These partnerships facilitate significant technology and knowledge transfer:

*Local Manufacturing*
Several partners are exploring local assembly and manufacturing opportunities under the Make in India initiative, potentially reducing costs and delivery times.

*R&D Collaboration*
Joint research and development projects focusing on products specifically designed for emerging market conditions and requirements.

**Economic Impact**

The partnerships generate substantial economic benefits:

*Employment Creation*
Direct employment for 200+ individuals in sales, service, and logistics roles, with indirect employment for 500+ service technicians and delivery partners.

*Skill Development*
Advanced technical training programs enhance local workforce capabilities in precision manufacturing and high-tech service delivery.

The partnerships demonstrate confidence in India's cycling market potential and PedalBharat's ability to serve as an effective bridge between international innovation and local market needs.` 
  },
  { id: 3, title: 'Launch of PedalBharat Mobile App', date: 'October 10, 2024', category: 'Product', summary: 'Native mobile application launches with enhanced user experience and AR try-on features for cycling gear.', image: '/placeholder.svg', content: `AR try-on and offline caching make shopping seamless on the go.` },
  { id: 4, title: 'PedalBharat Wins "E-commerce Startup of the Year" Award', date: 'September 5, 2024', category: 'Award', summary: 'Recognition for innovation in the cycling industry and commitment to promoting cycling culture in India.', image: '/placeholder.svg', content: `Awarded by the National Startup Forum for outstanding growth and UX.` },
];

const PressDetail = () => {
  const { id } = useParams();
  const release = pressReleases.find(r => String(r.id) === id);

  if (!release) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Press release not found</h1>
            <Button asChild>
              <Link to="/press">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Press
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/press"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Link>
        </Button>

        <Card className="overflow-hidden">
          <div className="aspect-video bg-muted" />
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{release.category}</Badge>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" /> {release.date}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">{release.title}</h1>
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <div dangerouslySetInnerHTML={{ __html: release.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/\n\n/g, '</p><p>').replace(/^/, '<p>').replace(/$/, '</p>') }} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PressDetail;