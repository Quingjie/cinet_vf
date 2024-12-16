import * as React from "react";
import ShowCard from "./ShowCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Show } from '@/app/entities/show';

interface ShowCarouselProps {
  shows: Show[];
  pageMode: "primary" | "secondary";
}

const ShowCarousel: React.FC<ShowCarouselProps> = ({ shows, pageMode }) => {
  return (
    <div className="w-full max-w-7xl mx-auto relative">
      <Carousel 
        className="w-full" 
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {shows.map((show) => (
            <CarouselItem 
              key={show.id}
              className="min-w-0 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 2xl:basis-1/6 p-2"
            >
              <ShowCard
                show={show}
                theme={pageMode === "primary" ? "light" : "dark"}
                size="small"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 hidden sm:flex" />
        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 hidden sm:flex" />
      </Carousel>
    </div>
  );
};

export default ShowCarousel;

