import React from 'react';
import { useInventoryStore } from '@/store/useInventoryStore';

export const DatePicker = () => {
  const { selectedDate, setSelectedDate, fetchInventoryByDate } = useInventoryStore();

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    const {data} = fetchInventoryByDate(newDate);
    
  };
  

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="date-picker" className="text-sm font-medium text-neutral-500">
        Inventory Date:
      </label>
      <div className="relative group">
        <input
          id="date-picker"
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="appearance-none bg-white border border-neutral-200 text-neutral-900 text-sm rounded-xl px-4 py-2 outline-none transition-all focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100 hover:border-neutral-300 shadow-sm cursor-pointer"
        />
      </div>
    </div>
  );
};