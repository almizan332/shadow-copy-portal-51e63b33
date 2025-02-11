
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { MediaType } from "@/types/product";
import { Product } from "@/types/product";

interface MediaGalleryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  allMedia: MediaType[];
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  product: Product;
}

export const MediaGalleryDialog = ({
  isOpen,
  onOpenChange,
  allMedia,
  selectedIndex,
  setSelectedIndex,
  product,
}: MediaGalleryDialogProps) => {
  const navigateGallery = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setSelectedIndex((prev: number) => prev === 0 ? allMedia.length - 1 : prev - 1);
    } else {
      setSelectedIndex((prev: number) => prev === allMedia.length - 1 ? 0 : prev + 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen-xl h-[95vh] p-0 bg-black/95">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-50">
          <X className="h-8 w-8 text-white" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        <div className="grid grid-cols-1 md:grid-cols-3 h-full">
          {/* Left Navigation Button */}
          <button
            onClick={() => navigateGallery('prev')}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
          >
            <ArrowLeft className="h-8 w-8 text-white" />
          </button>

          {/* Media Display */}
          <div className="col-span-2 w-full h-full flex items-center justify-center p-8">
            {allMedia[selectedIndex]?.type === 'video' ? (
              <video
                src={allMedia[selectedIndex].url}
                className="max-w-full max-h-full object-contain"
                controls
                autoPlay
                playsInline
              />
            ) : (
              <img
                src={allMedia[selectedIndex].url}
                alt={`${product.name} - View ${selectedIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = '/placeholder.svg';
                }}
              />
            )}
          </div>

          {/* Right Navigation Button */}
          <button
            onClick={() => navigateGallery('next')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
          >
            <ArrowRight className="h-8 w-8 text-white" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
