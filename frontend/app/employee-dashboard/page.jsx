"use client";

import React, { useEffect, useState } from 'react';
import { useInventoryStore } from '@/store/useInventoryStore';
import { DatePicker } from '@/components/DatePicker';
import { InventoryTable } from '@/components/InventoryTable';
import { Navbar } from '../../components/Navbar';

export default function DashboardPage() {
  const { fetchProducts, fetchInventoryByDate, submitInventory, submitting, selectedDate, drafts } = useInventoryStore();
  const [activeTab, setActiveTab] = useState('inventory');

  // Initial Data Fetch
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("Fetch the DATE:", drafts);

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white">
      
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-10">

            {/* Sticky Action Bar */}
            <div className="sticky top-0 z-30 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-4 bg-[#fafafa]/80 backdrop-blur-md border-b border-neutral-200/60 mb-8 animate-in fade-in duration-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-2.5 pl-4 rounded-2xl border border-neutral-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                
                {/* Left Side: Date Control */}
                <div className="flex-1">
                  <DatePicker />
                </div>
                
                {/* Right Side: Primary Action */}
                <button
                  onClick={submitInventory}
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 bg-neutral-900 text-white px-7 py-3 rounded-xl text-sm font-semibold hover:bg-black active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] shrink-0 group"
                >
                  {submitting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin text-white/70" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                      </svg>
                      Save Inventory
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Main Table Area */}
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                <InventoryTable />
              </div>
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
}