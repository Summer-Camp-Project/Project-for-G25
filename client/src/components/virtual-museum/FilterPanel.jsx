import React from 'react';
import { X } from 'lucide-react';

const FilterPanel = ({ filters, onFiltersChange, onClearFilters, artifacts }) => {
  const getUniqueValues = (key) => {
    return [...new Set(artifacts.map(artifact => artifact[key]))].filter(Boolean);
  };

  const categories = getUniqueValues('category');
  const periods = getUniqueValues('period');
  const origins = getUniqueValues('origin');
  const museums = getUniqueValues('museum');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onFiltersChange(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filter Artifacts</h3>
        <button onClick={onClearFilters} className="text-sm text-amber-600 hover:text-amber-700">
          Clear All
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={filters.category}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Period Filter */}
      <div>
        <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-2">
          Period
        </label>
        <select
          id="period"
          name="period"
          value={filters.period}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        >
          <option value="">All Periods</option>
          {periods.map(period => (
            <option key={period} value={period}>{period}</option>
          ))}
        </select>
      </div>

      {/* Origin Filter */}
      <div>
        <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-2">
          Origin
        </label>
        <select
          id="origin"
          name="origin"
          value={filters.origin}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        >
          <option value="">All Origins</option>
          {origins.map(origin => (
            <option key={origin} value={origin}>{origin}</option>
          ))}
        </select>
      </div>

      {/* Museum Filter */}
      <div>
        <label htmlFor="museum" className="block text-sm font-medium text-gray-700 mb-2">
          Museum
        </label>
        <select
          id="museum"
          name="museum"
          value={filters.museum}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        >
          <option value="">All Museums</option>
          {museums.map(museum => (
            <option key={museum} value={museum}>{museum}</option>
          ))}
        </select>
      </div>

      {/* 3D Model Filter */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="has3D"
          name="has3D"
          checked={filters.has3D}
          onChange={handleChange}
          className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
        />
        <label htmlFor="has3D" className="ml-2 block text-sm text-gray-900">
          Only show 3D models
        </label>
      </div>
    </div>
  );
};

export default FilterPanel;