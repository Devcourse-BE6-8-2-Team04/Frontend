"use client";

import { useState } from "react";
import { GeoLocation } from "@/types/geo";
import { dummyCities } from "@/utils/dummyCities"; // 더미 도시 리스트

export default function LocationSearch({
  onSelect,
}: {
  onSelect: (city: GeoLocation) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoLocation[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    const filtered = dummyCities.filter(
      (city) =>
        city.name.toLowerCase().includes(value.toLowerCase()) ||
        city.localName?.includes(value)
    );

    setResults(filtered);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="도시명을 입력하세요"
        value={query}
        onChange={handleInputChange}
        className="w-full border px-4 py-2 rounded shadow text-black"
      />
      {results.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border rounded shadow max-h-60 overflow-y-auto">
          {results.map((city) => (
            <li
              key={`${city.lat}-${city.lon}`}
              onClick={() => onSelect(city)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {city.localName
                ? `${city.localName} (${city.name}, ${city.country})`
                : `${city.name}, ${city.country}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
