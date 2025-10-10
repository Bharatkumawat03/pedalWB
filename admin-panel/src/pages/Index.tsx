import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bike, ArrowRight, Shield, Truck, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-4xl text-center space-y-12">
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="flex justify-center mb-8">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-primary/80 shadow-lg">
                <Bike className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
              Cycle Hub Express
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Premium bicycle e-commerce platform with comprehensive admin management system
            </p>
          </div>

          {/* Admin Access Card */}
          <Card className="mx-auto max-w-md shadow-xl hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/80">
            <CardContent className="p-8 text-center space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Admin Dashboard</h2>
                <p className="text-muted-foreground">
                  Manage products, orders, users, and more
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/30">
                  <Shield className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium">Secure</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/30">
                  <Users className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium">User Mgmt</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/30">
                  <Truck className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium">Orders</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/30">
                  <Bike className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium">Products</span>
                </div>
              </div>

              <Button 
                onClick={() => navigate('/admin')}
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-200"
                size="lg"
              >
                Access Admin Panel
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { title: "Product Management", desc: "Full CRUD operations for bicycle inventory" },
              { title: "Order Processing", desc: "Complete order lifecycle management" },
              { title: "User Analytics", desc: "Customer insights and behavior tracking" }
            ].map((feature, index) => (
              <div key={index} className="p-6 rounded-xl bg-card/60 backdrop-blur-sm border hover:border-primary/20 transition-all duration-200">
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
