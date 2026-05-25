import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Interface for component props for type safety and reusability
interface PlaceCardProps {
  images: string[];
  tags: string[];
  rating: number;
  title: string;
  dateRange: string;
  hostType: string;
  isTopRated?: boolean;
  description: string;
  pricePerNight: number;
  className?: string;
  onClick?: () => void;
}

export const PlaceCard = ({
  images,
  tags,
  rating,
  title,
  dateRange,
  hostType,
  isTopRated = false,
  description,
  pricePerNight,
  className,
  onClick,
}: PlaceCardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Carousel image change handler
  const changeImage = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) return images.length - 1;
      if (nextIndex >= images.length) return 0;
      return nextIndex;
    });
  };

  // Animation variants for the carousel
  const carouselVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  // Animation variants for staggering content
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      variants={contentVariants}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: '0px 10px 30px -5px hsl(var(--foreground) / 0.05)',
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      }}
      onClick={onClick}
      className={cn(
        'w-full max-w-sm overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm cursor-pointer border-border/50',
        className
      )}
    >
      {/* Image Carousel Section */}
      <div className="relative group h-32 sm:h-48">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={title}
            custom={direction}
            variants={carouselVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute h-full w-full object-cover"
          />
        </AnimatePresence>
        
        {/* Carousel Navigation */}
        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-black/30 hover:bg-black/50 text-white h-6 w-6 sm:h-7 sm:w-7" 
              onClick={(e) => {
                e.stopPropagation();
                changeImage(-1);
              }}
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-black/30 hover:bg-black/50 text-white h-6 w-6 sm:h-7 sm:w-7" 
              onClick={(e) => {
                e.stopPropagation();
                changeImage(1);
              }}
            >
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        )}

        {/* Top Badges and Rating */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex gap-1 sm:gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-background/80 backdrop-blur-sm border-border text-foreground font-semibold text-[8px] sm:text-xs px-1.5 py-0.5 sm:px-2.5">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
          <Badge variant="secondary" className="flex items-center gap-1 bg-background/80 backdrop-blur-sm border-border text-foreground font-semibold text-[8px] sm:text-xs px-1.5 py-0.5 sm:px-2.5">
            <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-yellow-500 fill-yellow-500" /> {rating}
          </Badge>
        </div>

        {/* Pagination Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={cn(
                  'h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full transition-all',
                  currentIndex === index ? 'w-3 sm:w-4 bg-white' : 'bg-white/50'
                )}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content Section */}
      <motion.div variants={contentVariants} className="p-3.5 sm:p-5 space-y-2 sm:space-y-3">
        <motion.div variants={itemVariants} className="flex justify-between items-start gap-2">
          <h3 className="text-sm sm:text-base font-bold text-foreground line-clamp-1">{title}</h3>
          {isTopRated && <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary text-[8px] sm:text-[10px] font-semibold uppercase tracking-wider shrink-0 px-1 py-0 sm:px-2">Featured</Badge>}
        </motion.div>

        <motion.div variants={itemVariants} className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
          <span>{dateRange}</span> &bull; <span>{hostType}</span>
        </motion.div>

        <motion.p variants={itemVariants} className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
          {description}
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center pt-2 border-t border-border/40">
          <p className="font-bold text-xs sm:text-sm text-foreground">
            Free <span className="text-[9px] sm:text-[10px] font-normal text-muted-foreground">/ Application</span>
          </p>
          <Button size="sm" className="group text-[10px] sm:text-xs gap-1 cursor-pointer bg-foreground text-background hover:bg-foreground/90 font-semibold shadow-none rounded-md w-full sm:w-auto justify-center h-8 sm:h-9">
            Apply Now
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
