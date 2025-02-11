
import { useState } from "react";
import { Product } from "@/types/product";
import { MediaGalleryDialog } from "./MediaGalleryDialog";
import { MediaType } from "@/types/product";

interface ProductGalleryProps {
  product: Product;
}

export const ProductGallery = ({ product }: ProductGalleryProps) => {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const allMedia = getAllMedia(product);

  return (
    <div className="space-y-2">
      {/* Main Image */}
      <div 
        className="aspect-square relative rounded-lg overflow-hidden bg-white cursor-pointer group"
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
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={allMedia[selectedMediaIndex].url}
              alt={`${product.name} - View ${selectedMediaIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = '/placeholder.svg';
              }}
            />
          </div>
        )}
      </div>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-6 gap-2">
        {allMedia.map((media, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedMediaIndex(index);
            }}
            className={`aspect-square relative rounded-lg overflow-hidden bg-white ${
              selectedMediaIndex === index ? 'ring-2 ring-primary' : ''
            }`}
          >
            {media.type === 'video' ? (
              <div className="relative w-full h-full">
                <video
                  src={media.url}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center">
                    <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-black border-b-4 border-b-transparent ml-0.5" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={media.url}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = '/placeholder.svg';
                  }}
                />
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
    media.push({ 
      type: 'image', 
      url: `${window.location.origin}/${product.preview_image.replace('blob:', '')}`
    });
  }

  // Handle gallery images
  if (product.gallery_images && Array.isArray(product.gallery_images)) {
    product.gallery_images.forEach(imageUrl => {
      media.push({ 
        type: 'image', 
        url: `${window.location.origin}/${imageUrl.replace('blob:', '')}`
      });
    });
  }

  // Handle video URLs
  if (product.video_urls && Array.isArray(product.video_urls)) {
    product.video_urls.forEach(videoUrl => {
      media.push({ 
        type: 'video', 
        url: `${window.location.origin}/${videoUrl.replace('blob:', '')}`
      });
    });
  }

  return media;
};
