export function useClothDetailData() {
  const weatherData = {
    city: "수원시",
    condition: "맑음",
    currentTemp: "23",
    maxTemp: "26",
    minTemp: "18",
  };

  const clothingItems = [
    { clothName: "셔츠", imageUrl: "/shirt.png", category: "OUTDOOR" },
    { clothName: "바지", imageUrl: "/pants.png", category: "OUTDOOR" },
    { clothName: "코트", imageUrl: "/coat.png", category: "DATE_LOOK" },
    { clothName: "청바지", imageUrl: "/jeans.png", category: "DATE_LOOK" },
    { clothName: "자켓", imageUrl: "/jacket.png", category: "FORMAL_OFFICE" },
    { clothName: "구두", imageUrl: "/shoes.png", category: "FORMAL_OFFICE" },
  ];

  return { weatherData, clothingItems };
}
