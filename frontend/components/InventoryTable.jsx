import React, { memo } from 'react';
import { useInventoryStore } from '../store/useInventoryStore'; // Adjust path if needed

// Memoized row for fast typing without re-rendering the whole list
const InventoryRow = memo(({ product, quantity, index, value, onChange, onKeyDown }) => {
  // Check if quantity is dangerously low (but not empty)
  const isLowStock = value !== '' && Number(value) > 0 && Number(value) < 5;

  return (
    <div className={`flex items-center justify-between p-4 border-b border-neutral-100 transition-colors ${isLowStock ? 'bg-orange-50/40' : 'bg-white hover:bg-neutral-50/80'}`}>
      
      {/* Left Side: Stacked Product Info */}
      <div className="flex flex-col pr-4 flex-1 overflow-hidden">
        <span className="text-sm font-semibold text-neutral-900 leading-snug line-clamp-2">
          {product?.productName || 'Unknown Product'}
        </span>
        <div className="mt-1.5">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-neutral-100 text-neutral-600 border border-neutral-200/60">
            {product?.SKU || 'N/A'}
          </span>
        </div>
      </div>
      
      {/* Right Side: Quantity Input */}
      <div className="relative shrink-0">
        <input
          id={`input-${index}`}
          type="number"
          min="0"
          inputMode="numeric" // Forces the mobile number pad!
          pattern="[0-9]*"
          value={value}
          onChange={(e) => onChange(product.SKU, e.target.value)}
          onKeyDown={(e) => onKeyDown(e, index)}
          placeholder="0"
          className={`w-24 text-right px-3 py-2.5 border rounded-xl text-base md:text-sm font-semibold outline-none transition-all duration-200 focus:ring-4 ${
            isLowStock 
              ? 'border-orange-200 text-orange-700 focus:border-orange-400 focus:ring-orange-100 bg-orange-50/50 placeholder:text-orange-300' 
              : 'border-neutral-200 text-neutral-900 focus:border-neutral-400 focus:ring-neutral-100 bg-white placeholder:text-neutral-300'
          }`}
        />
        {/* Pulsing indicator for low stock */}
        {isLowStock && (
          <span className="absolute -right-1 -top-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
          </span>
        )}
      </div>
    </div>
  );
});

InventoryRow.displayName = 'InventoryRow';

export const InventoryTable = () => {
  const { products, drafts, selectedDate, updateDraft, loading } = useInventoryStore();
  const currentDraft = drafts[selectedDate] || {};

  // Handle 'Enter' key to jump to the next input cell (mostly for iPad/Bluetooth keyboards)
  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextInput = document.getElementById(`input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
        nextInput.select(); // Auto-select text for fast overriding
      }
    }
  };

  // Mobile-friendly Skeleton Loader
  if (loading && (!products || products.length === 0)) {
    return (
      <div className="w-full bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-between items-center p-4 border-b border-neutral-100">
            <div className="space-y-2 flex-1 pr-4">
              <div className="h-4 bg-neutral-100 rounded w-3/4 animate-pulse"></div>
              <div className="h-3 bg-neutral-100 rounded w-1/3 animate-pulse"></div>
            </div>
            <div className="h-10 w-24 bg-neutral-100 rounded-xl animate-pulse shrink-0"></div>
          </div>
        ))}
      </div>
    );
  }

  // Empty State
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-neutral-200 shadow-sm text-center">
        <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
        </div>
        <p className="text-neutral-900 font-medium text-sm">No products found</p>
        <p className="text-neutral-500 text-xs mt-1">There are no products available to track yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[20px] border border-neutral-200 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] overflow-hidden animate-in fade-in duration-500">
      
      {/* Mobile-Friendly Sticky Header */}
      <div className="bg-neutral-50/95 backdrop-blur-md sticky top-0 z-10 px-4 py-3 border-b border-neutral-200 flex justify-between items-center">
        <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
          Product Details
        </span>
        <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider pr-2">
          Quantity
        </span>
      </div>

      {/* List Container (Replaces tbody) */}
      <div className="flex flex-col">
        {Array.isArray(products) && products.map((item, index) => {
          if (!item.product) return null;

          return (
            <InventoryRow
              key={item.product.SKU || index}
              product={item.product}
              quantity={item.quantity}
              index={index}
              value={currentDraft[item.product.SKU] !== undefined ? currentDraft[item.product.SKU] : ''}
              onChange={updateDraft}
              onKeyDown={handleKeyDown}
            />
          );
        })}
      </div>
      
    </div>
  );
};