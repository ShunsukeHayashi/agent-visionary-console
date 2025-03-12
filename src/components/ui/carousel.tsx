import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

interface CarouselImageProps extends React.HTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
}

interface CarouselContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

interface CarouselPreviousProps extends React.ComponentProps<typeof Button> {}

interface CarouselNextProps extends React.ComponentProps<typeof Button> {}

const Carousel = ({ children, className, ...props }: CarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {React.Children.map(children, (child, index) => (
            <div className="relative min-w-full" key={index}>
              {child}
            </div>
          ))}
        </div>
      </div>
      <CarouselPrevious onClick={() => emblaApi?.scrollPrev()} className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10" />
      <CarouselNext onClick={() => emblaApi?.scrollNext()} className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10" />
    </div>
  );
};

const CarouselImage = React.forwardRef<HTMLImageElement, CarouselImageProps>(
  ({ src, alt, className, ...props }, ref) => {
    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={cn("w-full h-auto object-cover", className)}
        {...props}
      />
    );
  }
);

CarouselImage.displayName = "CarouselImage";

const CarouselContent = React.forwardRef<HTMLDivElement, CarouselContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative w-full flex items-center justify-center", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CarouselContent.displayName = "CarouselContent";

const CarouselPrevious = ({ className, ...props }: CarouselPreviousProps) => {
  return (
    <Button variant="ghost" size="icon" className={className} {...props}>
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
};

CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = ({ className, ...props }: CarouselNextProps) => {
  return (
    <Button variant="ghost" size="icon" className={className} {...props}>
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
};

CarouselNext.displayName = "CarouselNext";

export { Carousel, CarouselContent, CarouselImage, CarouselPrevious, CarouselNext };
