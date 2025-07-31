// CategorySlider.tsx
"use client";

import React from "react";
import Slider from "react-slick";
import Card from "@/components/common/Card"; // Card 컴포넌트 임포트

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface ClothingItem {
  clothName: string;
  imageUrl: string;
  category: string;
}

interface CategorySliderProps {
  groupedItems: Record<string, ClothingItem[]>;
  categoryNameMap: Record<string, string>;
}

export default function CategorySlider({ groupedItems, categoryNameMap }: CategorySliderProps) {
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        centerMode: true,
        centerPadding: "32px",
      };
      
      return (
        <Slider {...settings} className="w-[350px] h-[375px]">
          {Object.entries(groupedItems).map(([category, items]) => (
            <Card
              key={category}
              className="w-[290px] h-[375px] p-6 bg-[#ffffffcf] rounded-[15px] shadow-[3px_4px_16.3px_#00000040] border-none"
            >
          <div className="text-center text-base font-semibold text-gray-700 pt-2">
            {categoryNameMap[category] || category}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {items.map((item, idx) => (
              <img
                key={idx}
                src={item.imageUrl}
                alt={item.clothName}
                className="w-[121px] h-[141px] object-cover"
              />
            ))}
          </div>
        </Card>
      ))}
    </Slider>
  );
}
