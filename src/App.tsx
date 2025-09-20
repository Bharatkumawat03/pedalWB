import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ScrollToTop from "./components/common/ScrollToTop";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Categories from "./pages/Categories";
import Brands from "./pages/Brands";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Account from "./pages/Account";
import About from "./pages/About";
import Careers from "./pages/Careers";
import Help from "./pages/Help";
import Returns from "./pages/Returns";
import Shipping from "./pages/Shipping";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Refund from "./pages/Refund";
import Checkout from "./pages/Checkout";
import Cookies from "./pages/Cookies";
import Press from "./pages/Press";
import News from "./pages/News";
import BlogDetail from "./pages/BlogDetail";
import PressDetail from "./pages/PressDetail";
import NewsDetail from "./pages/NewsDetail";
import NotFound from "./pages/NotFound";
import Category from "./pages/Category";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/brands" element={<Brands />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/account" element={<Account />} />
              <Route path="/about" element={<About />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/help" element={<Help />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/refund" element={<Refund />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/press" element={<Press />} />
              <Route path="/press/:id" element={<PressDetail />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/category/:categoryId" element={<Category />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ScrollToTop />
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
