import { useEffect, useState } from 'react';
import type { Category } from '../../types/event.types';
import { getCategories, getLocations } from '../../services/event.service';

interface EventFiltersProps {
  selectedCategory: string;
  selectedLocation: string;
  onCategoryChange: (cat: string) => void;
  onLocationChange: (loc: string) => void;
}

const EventFilters = ({
  selectedCategory,
  selectedLocation,
  onCategoryChange,
  onLocationChange,
}: EventFiltersProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    getCategories().then(setCategories);
    getLocations().then(setLocations);
  }, []);

  const hasActiveFilters = selectedCategory || selectedLocation;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 text-base">Filter</h3>
        {hasActiveFilters && (
          <button
            onClick={() => { onCategoryChange(''); onLocationChange(''); }}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Reset semua
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span className="w-5 h-5 bg-blue-100 rounded-md flex items-center justify-center">
            <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </span>
          Kategori
        </h4>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => onCategoryChange('')}
            className={`text-left text-sm py-2 px-3 rounded-lg transition-all font-medium ${!selectedCategory
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            Semua Kategori
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id === selectedCategory ? '' : cat.id)}
              className={`text-left text-sm py-2 px-3 rounded-lg transition-all ${selectedCategory === cat.id
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Location Filter */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span className="w-5 h-5 bg-rose-100 rounded-md flex items-center justify-center">
            <svg className="w-3 h-3 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
          </span>
          Kota
        </h4>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => onLocationChange('')}
            className={`text-left text-sm py-2 px-3 rounded-lg transition-all font-medium ${!selectedLocation
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            Semua Kota
          </button>
          {locations.map(loc => (
            <button
              key={loc}
              onClick={() => onLocationChange(loc === selectedLocation ? '' : loc)}
              className={`text-left text-sm py-2 px-3 rounded-lg transition-all ${selectedLocation === loc
                  ? 'bg-rose-50 text-rose-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventFilters;
