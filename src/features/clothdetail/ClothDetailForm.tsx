import * as React from "react";
import Card from "@/comments/comment/Card";
import BackgroundLayout from "@/comments/layout/BackgroundLayout";
import { Sun, ThermometerSnowflake, ThermometerSun } from "lucide-react";
import { useClothDetailData } from "@/features/clothdetail/hook"
import Nav from "@/comments/layout/NavBar";

export default function Screen() {
  const { weatherData, clothingItems } = useClothDetailData();

  return (
    <div className="flex justify-center w-full min-h-screen bg-gray-100">
     <BackgroundLayout backgroundImage="/comments/comment/img/shine_background.png">
      <div className="bg-[#97d2e8] w-[390px] h-[844px]">
        <div className="relative h-[844px]">

          {/* 배경 이미지 */}
          <img
            className="absolute w-[390px] h-[818px] top-0 left-0 object-cover"
            alt="Sky background"
            src=""
          />

          {/* 도시 이름 */}
          <div className="top-[74px] left-[161px] font-bold text-2xl absolute text-white">
            {weatherData.city}
          </div>

          {/* 날씨 카드 */}
          <Card className="absolute w-[308px] h-[140px] top-[169px] left-[41px] p-0 bg-[#ffffff33] rounded-[15px] shadow-[3px_4px_16.3px_#00000040] border-none">
            <div className="p-0 h-full relative">
              <div className="top-[14px] left-[169px] text-xl absolute text-white">
                {weatherData.condition}
              </div>

              <div className="absolute w-[110px] h-[107px] top-[20px] left-[14px] flex items-center justify-center">
                <Sun className="w-20 h-20 text-yellow-400" />
              </div>

              <div className="absolute w-[136px] h-[86px] top-[20px] left-[160px]">
                <div className="relative w-[136px] h-[86px]">
                  <div className="text-8xl absolute text-white">
                    {weatherData.currentTemp}
                  </div>
                  <div className="w-6 h-6 top-[23px] left-[108px] rounded-xl border-[5px] border-white absolute" />
                </div>
              </div>
            </div>
          </Card>

          {/* 최저/최고 기온 */}
          <div className="absolute flex items-center space-x-4 top-[339px] left-[55px]">
            <div className="flex items-center">
              <ThermometerSun className="w-6 h-6 text-black" />
              <div className="ml-2 text-base text-black">{weatherData.maxTemp}</div>
              <div className="w-[5px] h-[5px] ml-1 rounded-[2.5px] border border-black" />
            </div>
            <div className="flex items-center">
              <ThermometerSnowflake    className="w-[22px] h-[22px] text-black" />
              <div className="ml-2 text-base text-black">{weatherData.minTemp}</div>
              <div className="w-[5px] h-[5px] ml-1 rounded-[2.5px] border border-black" />
            </div>
          </div>

          {/* 의상 추천 카드 */}
          <Card className="absolute w-[308px] h-[375px] top-[367px] left-[41px] p-0 bg-[#ffffff33] rounded-[15px] shadow-[3px_4px_16.3px_#00000040] border-none">
          {/* 내용 */}
            <div className="p-6 grid grid-cols-2 gap-4">
              {clothingItems.map((item, index) => (
                <img
                  key={index}
                  src={item.src}
                  alt={item.alt}
                  className={item.className}
                />
              ))}
            </div>
          </Card>

          {/* 하단 네비게이션 바 */}
          <Nav />

        </div>
      </div>
    </BackgroundLayout>
    </div>
  );
}
