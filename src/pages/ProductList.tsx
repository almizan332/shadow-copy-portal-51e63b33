import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Upload, Plus, FileSpreadsheet, Download, ImagePlus } from "lucide-react";
import { productExcelHeaders, sampleExcelData } from "@/utils/excelTemplate";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";

interface Product {
  name: string;
  link: string;
  category: string;
  description: string;
  previewImage: string;
  galleryImages: string[];
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Product>({
    name: "",
    link: "",
    category: "",
    description: "",
    previewImage: "",
    galleryImages: [],
  });
  const { toast } = useToast();
  const [previewImageFile, setPreviewImageFile] = useState<File | null>(null);
  const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([]);

  const handlePreviewImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreviewImageFile(file);
      // Create a temporary URL for preview
      const imageUrl = URL.createObjectURL(file);
      setNewProduct({ ...newProduct, previewImage: imageUrl });
    }
  };

  const handleGalleryImagesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setGalleryImageFiles(files);
    // Create temporary URLs for preview
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setNewProduct({ ...newProduct, galleryImages: imageUrls });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const rows = text.split('\n');
          const headers = rows[0].split(',');
          const productsData: Product[] = [];

          for (let i = 1; i < rows.length; i++) {
            if (!rows[i].trim()) continue; // Skip empty rows
            const values = rows[i].split(',');
            if (values.length === headers.length) {
              const galleryImagesStr = values[5].trim();
              const galleryImages = galleryImagesStr ? galleryImagesStr.split(';').map(url => url.trim()) : [];
              
              productsData.push({
                name: values[0].trim(),
                link: values[1].trim().replace(/^(https?:\/\/)/, ''), // Remove protocol if present
                category: values[2].trim(),
                description: values[3].trim(),
                previewImage: values[4].trim(),
                galleryImages
              });
            }
          }

          setProducts(productsData);
          toast({
            title: "File processed successfully",
            description: `Imported ${productsData.length} products`,
          });
        } catch (error) {
          toast({
            title: "Error processing file",
            description: "Please make sure the file format is correct",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const downloadExcelTemplate = () => {
    const csvRows = [
      productExcelHeaders.join(','),
      ...sampleExcelData.map(row => [
        row['Product Name'],
        row['Product Link'],
        row['Category'],
        row['Description'],
        row['Preview Image URL'],
        row['Gallery Image URLs (comma separated)']
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'product_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Template downloaded",
      description: "You can now fill in the template and import it back",
    });
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.category) {
      toast({
        title: "Error",
        description: "Please fill in at least the product name and category",
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real application, you would upload the images to your server/storage here
      // For now, we'll use the temporary URLs
      const productToAdd = {
        ...newProduct,
        link: newProduct.link.replace(/^(https?:\/\/)/, ''),
      };

      setProducts([...products, productToAdd]);
      
      // Reset form
      setNewProduct({
        name: "",
        link: "",
        category: "",
        description: "",
        previewImage: "",
        galleryImages: [],
      });
      setPreviewImageFile(null);
      setGalleryImageFiles([]);
      setIsAddProductOpen(false);
      
      toast({
        title: "Product added successfully",
        description: "The new product has been added to the list and homepage",
      });
    } catch (error) {
      toast({
        title: "Error adding product",
        description: "There was an error adding the product. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <div className="flex gap-2">
          <Button onClick={downloadExcelTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
          <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="link">Product Link</Label>
                  <Input
                    id="link"
                    value={newProduct.link}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, link: e.target.value })
                    }
                    placeholder="example.com/product"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, category: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, description: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="previewImage">Preview Image</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="previewImage"
                      type="file"
                      accept="image/*"
                      onChange={handlePreviewImageUpload}
                      className="flex-1"
                    />
                    {newProduct.previewImage && (
                      <img
                        src={newProduct.previewImage}
                        alt="Preview"
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="galleryImages">Gallery Images</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="galleryImages"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryImagesUpload}
                      className="flex-1"
                    />
                  </div>
                  {newProduct.galleryImages.length > 0 && (
                    <div className="flex gap-2 mt-2 overflow-x-auto">
                      {newProduct.galleryImages.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Gallery ${index + 1}`}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleAddProduct}>Add Product</Button>
              </div>
            </DialogContent>
          </Dialog>
          <div className="relative">
            <input
              type="file"
              accept=".csv"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileUpload}
            />
            <Button variant="outline">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Import from CSV
            </Button>
          </div>
        </div>
      </div>

      <Card className="p-6">
        {products.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Link</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Preview Image</TableHead>
                <TableHead>Gallery Images</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.link}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>
                    {product.previewImage && (
                      <img 
                        src={product.previewImage} 
                        alt={product.name} 
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {product.galleryImages.map((img, idx) => (
                        img && (
                          <img 
                            key={idx} 
                            src={img} 
                            alt={`${product.name} gallery ${idx + 1}`} 
                            className="w-12 h-12 object-cover rounded"
                          />
                        )
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No products imported yet. Download the template and import your products.
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProductList;
