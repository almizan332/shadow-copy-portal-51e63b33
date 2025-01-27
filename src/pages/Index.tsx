import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const generateProducts = (count: number) => {
  return Array.from({ length: count }).map((_, index) => ({
    id: index + 1,
    title: `YY${381 + index}`,
    image: `https://images.unsplash.com/photo-${[
      '1649972904349-6e44c42644a7',
      '1488590528505-98d2b5aba04b',
      '1518770660439-4636190af475',
      '1461749280684-dccba630e2f6',
      '1486312338219-ce68d2c6f44d',
      '1581091226825-a6a2a5aee158',
      '1485827404703-89b55fcc595e',
      '1526374965328-7f61d4dc18c5',
      '1531297484001-80022131f5a1',
      '1487058792275-0ad4aaf24ca7',
    ][index % 10]}?auto=format&fit=crop&w=400&q=80`,
    dateAdded: new Date(Date.now() - Math.random() * 10000000000),
  }));
};

const initialProducts = generateProducts(360);
const sortedProducts = [...initialProducts].sort((a, b) => b.dateAdded.getTime() - a.dateAdded.getTime());
const ITEMS_PER_PAGE = 120;

const Index = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <ScrollArea className="flex-grow">
        <main className="max-w-7xl mx-auto px-4 py-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold mb-6 gradient-text"
          >
            Latest Products ({sortedProducts.length} products)
          </motion.h1>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {paginatedProducts.map((product, index) => (
              <Link to={`/product/${product.id}`} key={product.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.05, 1) }}
                  whileHover={{ scale: 1.02 }}
                  className="transform transition-all duration-300"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer bg-gray-900/50 border-gray-800">
                    <CardContent className="p-0">
                      <div className="aspect-square relative">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-medium text-gray-200">{product.title}</h3>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-xs text-gray-400">
                            {new Date(product.dateAdded).toLocaleDateString()}
                          </p>
                          <Button variant="ghost" size="sm" className="text-xs">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </div>

          <div className="mt-8 mb-12">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    if (page === 1 || page === totalPages) return true;
                    if (page >= currentPage - 1 && page <= currentPage + 1) return true;
                    return false;
                  })
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink
                          isActive={currentPage === page}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    </React.Fragment>
                  ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </main>
      </ScrollArea>
      <Footer />
    </div>
  );
};

export default Index;