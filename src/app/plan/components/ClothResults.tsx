
'use client';

import React, { createRef, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Cloth, ClothApiResponse } from '@/app/plan/types';

interface ClothResultsProps {
  clothData: ClothApiResponse | null;
}

interface ScrollState {
  canScrollLeft: boolean;
  canScrollRight: boolean;
}

const ClothResults: React.FC<ClothResultsProps> = ({ clothData }) => {
  const scrollRefs = useRef<{
    [key: string]: React.RefObject<HTMLDivElement>;
  }>({});
  const [scrollStates, setScrollStates] = useState<{
    [key: string]: ScrollState;
  }>({});

  const checkScrollability = (key: string) => {
    const ref = scrollRefs.current[key];
    if (ref && ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      const canScrollLeft = scrollLeft > 0;
      const canScrollRight = scrollLeft < scrollWidth - clientWidth;
      setScrollStates(prev => ({ ...prev, [key]: { canScrollLeft, canScrollRight } }));
    }
  };

  useEffect(() => {
    if (clothData) {
      const newRefs: { [key: string]: React.RefObject<HTMLDivElement> } = {};
      const newScrollStates: { [key: string]: ScrollState } = {};

      Object.keys(clothData.clothes).forEach(category => {
        newRefs[category] = createRef<HTMLDivElement>();
        newScrollStates[category] = { canScrollLeft: false, canScrollRight: true };
      });
      if (clothData.extraClothes.EXTRA) {
        newRefs['extra'] = createRef<HTMLDivElement>();
        newScrollStates['extra'] = { canScrollLeft: false, canScrollRight: true };
      }
      scrollRefs.current = newRefs;
      setScrollStates(newScrollStates);
    }
  }, [clothData]);

  if (!clothData) return null;

  return (
    <div className="w-full">
      {Object.entries(clothData.clothes).map(([category, clothes]) => (
        <div key={category} className="mb-8 relative">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
            {category}
          </h2>
          <div
            ref={scrollRefs.current[category]}
            onScroll={() => checkScrollability(category)}
            className="flex overflow-x-auto space-x-4 p-2 scroll-smooth scrollbar-hide"
          >
            {clothes.map((cloth: Cloth) => (
              <div
                key={cloth.id}
                className="flex-shrink-0 w-36 border rounded-lg shadow-md overflow-hidden bg-white/80"
              >
                <div className="relative w-full h-32">
                  <Image
                    src={cloth.imageUrl}
                    alt={cloth.clothName}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-2 text-center">
                  <p className="font-semibold text-sm text-gray-700">
                    {cloth.clothName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {clothData.extraClothes.EXTRA &&
        clothData.extraClothes.EXTRA.length > 0 && (
          <div className="mb-8 relative">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
              챙겨가면 좋은 것들
            </h2>
            <div
              ref={scrollRefs.current['extra']}
              onScroll={() => checkScrollability('extra')}
              className="flex overflow-x-auto space-x-4 p-2 scroll-smooth scrollbar-hide"
            >
              {clothData.extraClothes.EXTRA.map(item => (
                <div
                  key={`extra-${item.id}`}
                  className="flex-shrink-0 w-36 border rounded-lg shadow-md overflow-hidden bg-white/80"
                >
                  <div className="relative w-full h-32">
                    <Image
                      src={item.imageUrl}
                      alt={item.clothName}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-2 text-center">
                    <p className="font-semibold text-sm text-gray-700">
                      {item.clothName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};

export default ClothResults;
