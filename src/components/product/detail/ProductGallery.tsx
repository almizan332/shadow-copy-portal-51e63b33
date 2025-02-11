
import { useState } from "react";
import { Product } from "@/types/product";
import { MediaGalleryDialog } from "./MediaGalleryDialog";
import { MediaType } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";

interface ProductGalleryProps {
  product: Product;
}

export const ProductGallery = ({ product }: ProductGalleryProps) => {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  
  // Get signed URLs for blob:// URLs if they exist
  const allMedia = getAllMedia(product);

  return (
    <div className="space-y-4">
      <div 
        className="aspect-square relative rounded-lg overflow-hidden bg-gray-900 cursor-pointer group"
        onClick={() => setIsGalleryOpen(true)}
      >
        {allMedia[selectedMediaIndex]?.type === 'video' ? (
          <video
            src={allMedia[selectedMediaIndex].url}
            className="w-full h-full object-contain"
            controls
            autoPlay
            playsInline
          />
        ) : (
          <>
            <img
              src={allMedia[selectedMediaIndex].url}
              alt={`${product.name} - View ${selectedMediaIndex + 1}`}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="text-white text-lg font-medium">Click to view gallery</div>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-5 gap-2">
        {allMedia.map((media, index) => (
          <button
            key={index}
            onClick={() => setSelectedMediaIndex(index)}
            className={`aspect-square relative rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${
              selectedMediaIndex === index ? 'border-primary' : 'border-transparent'
            }`}
          >
            {media.type === 'video' ? (
              <div className="relative w-full h-full">
                <video
                  src={media.url}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-black border-b-8 border-b-transparent ml-1" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full group">
                <img
                  src={media.url}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
          </button>
        ))}
      </div>

      <MediaGalleryDialog
        isOpen={isGalleryOpen}
        onOpenChange={setIsGalleryOpen}
        allMedia={allMedia}
        selectedIndex={selectedMediaIndex}
        setSelectedIndex={setSelectedMediaIndex}
        product={product}
      />
    </div>
  );
};

export const getAllMedia = (product: Product): MediaType[] => {
  const media: MediaType[] = [];

  // Handle preview image
  if (product.preview_image) {
    // If the URL starts with blob://, it's a temporary URL that needs to be handled differently
    if (product.preview_image.startsWith('blob://')) {
      const cleanPath = product.preview_image.replace('blob://', '');
      media.push({ 
        type: 'image', 
        url: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${cleanPath}`
      });
    } else {
      media.push({ type: 'image', url: product.preview_image });
    }
  }

  // Handle gallery images
  if (product.gallery_images) {
    product.gallery_images.forEach(url => {
      if (url.startsWith('blob://')) {
        const cleanPath = url.replace('blob://', '');
        media.push({ 
          type: 'image', 
          url: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${cleanPath}`
        });
      } else {
        media.push({ type: 'image', url });
      }
    });
  }

  // Handle video URLs
  if (product.video_urls) {
    product.video_urls.forEach(url => {
      if (url.startsWith('blob://')) {
        const cleanPath = url.replace('blob://', '');
        media.push({ 
          type: 'video', 
          url: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${cleanPath}`
        });
      } else {
        media.push({ type: 'video', url });
      }
    });
  }

  return media;
};
