export function useClothDetailData() {
  // 나중에 API 호출로 바꾸기 전 임시 데이터
  const weatherData = {
    city: "수원시",
    condition: "화창함",
    currentTemp: "18",
    maxTemp: "18",
    minTemp: "11",
  };

  const clothingItems = [
    { src: "", alt: "Light gray sweatshirt", className: "w-[121px] h-[141px] object-cover" },
    { src: "", alt: "Black pants", className: "w-[100px] h-[132px] object-cover" },
    { src: "", alt: "Denim jacket", className: "w-[120px] h-[120px] object-cover" },
    { src: "", alt: "White sneakers", className: "w-[86px] h-[60px]" },
  ];

  return { weatherData, clothingItems };
}
