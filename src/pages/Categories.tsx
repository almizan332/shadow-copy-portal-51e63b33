import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Mock categories data - in a real app this would come from an API
const categories = [
  {
    id: 1,
    name: "Smartphones",
    productCount: 156,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: 2,
    name: "Laptops",
    productCount: 89,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    id: 3,
    name: "Tablets",
    productCount: 45,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    id: 4,
    name: "Accessories",
    productCount: 234,
    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=800&q=80",
    gradient: "from-orange-500 to-red-500"
  },
  {
    id: 5,
    name: "Wearables",
    productCount: 78,
    image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&w=800&q=80",
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    id: 6,
    name: "Gaming",
    productCount: 167,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    gradient: "from-indigo-500 to-purple-500"
  }
];

const Categories = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <ScrollArea className="flex-grow">
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold gradient-text"
            >
              Categories
            </motion.h1>

            <div className="relative">
              <input
                type="search"
                placeholder="Search categories..."
                className="bg-gray-900 border border-gray-700 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600 w-[200px]"
              />
              <Button variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-2">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Link to={`/category/${category.id}`} key={category.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="transform transition-all duration-300"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer bg-gray-900/50 border-gray-800">
                    <CardContent className="p-0">
                      <div className="relative aspect-[16/9]">
                        <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-60 z-10`} />
                        <img
                          src={category.image}
                          alt={category.name}
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end">
                          <h2 className="text-2xl font-bold text-white mb-2">{category.name}</h2>
                          <p className="text-white/90 text-sm">
                            {category.productCount} Products
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </div>
        </main>
      </ScrollArea>
      <Footer />
    </div>
  );
};

export default Categories;
