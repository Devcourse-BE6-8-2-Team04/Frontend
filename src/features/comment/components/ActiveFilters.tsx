"use client";

import React from "react";
import { X, MapPin, Thermometer, Calendar } from "lucide-react";

interface SearchFilters {
  location?: string;
  feelsLikeTemperature?: number;
  month?: number;
}

interface ActiveFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export function ActiveFilters({ filters, onFiltersChange }: ActiveFiltersProps) {
  const hasActiveFilters = Object.keys(filters).length > 0;

  const onRemoveFilter = (filterKey: keyof SearchFilters) => {
    const newFilters = { ...filters };
    delete newFilters[filterKey];
    onFiltersChange(newFilters);
  };

  if (!hasActiveFilters) return null;

  return (
    <div className="px-4 pb-4">
      <div className="flex flex-wrap gap-2">
        {filters.location && (
          <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
            <MapPin size={14} />
            <span>{filters.location}</span>
            <button
              onClick={() => onRemoveFilter('location')}
              className="hover:bg-blue-200 rounded-full p-0.5"
            >
              <X size={12} />
            </button>
          </div>
        )}
        {filters.feelsLikeTemperature !== undefined && (
          <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
            <Thermometer size={14} />
            <span>{filters.feelsLikeTemperature}°C</span>
            <button
              onClick={() => onRemoveFilter('feelsLikeTemperature')}
              className="hover:bg-orange-200 rounded-full p-0.5"
            >
              <X size={12} />
            </button>
          </div>
        )}
        {filters.month !== undefined && (
          <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
            <Calendar size={14} />
            <span>{filters.month}월</span>
            <button
              onClick={() => onRemoveFilter('month')}
              className="hover:bg-green-200 rounded-full p-0.5"
            >
              <X size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}