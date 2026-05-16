"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { Navbar } from '../../components/Navbar';
import { useStoreStore } from '../../store/useStoreStore.js';
import { useAuthStore } from '../../store/useAuthStore.js';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation.js';
import { useAdminStore } from '../../store/useAdminStore.js';

const AddStoreForm = () => {
  const { addStore } = useStoreStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    storeName: "",
    storeAddress: "",
    storeCode: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (!formData.storeName || !formData.storeAddress || !formData.storeCode) {
      toast.error("Please fill out all fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      await addStore(formData);
      setFormData({
        storeName: "",
        storeAddress: "",
        storeCode: ""
      });
      toast.success("Store added successfully");
    } catch (error) {
      console.error("Failed to add store:", error);
      toast.error("Failed to add store");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            Add New Store
          </h2>
          <p className="text-sm text-neutral-500 mt-2">
            Enter the details below to register a new physical location.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 ml-1">
                Store Name
              </label>
              <input
                type="text"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                placeholder="e.g. Decoy HQ"
                className="w-full px-4 py-3.5 bg-neutral-50/50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 ml-1">
                Store Code
              </label>
              <input
                type="text"
                name="storeCode"
                value={formData.storeCode}
                onChange={handleChange}
                placeholder="e.g. 00001"
                className="w-full px-4 py-3.5 bg-neutral-50/50 border border-neutral-200 rounded-xl text-sm font-mono text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 ml-1">
                Store Address
              </label>
              <input
                type="text"
                name="storeAddress"
                value={formData.storeAddress}
                onChange={handleChange}
                placeholder="City, Full Address"
                className="w-full px-4 py-3.5 bg-neutral-50/50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all duration-200"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-neutral-900 text-white text-sm font-semibold py-4 rounded-xl hover:bg-black active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-5 h-5 animate-spin text-white/70" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving Store...
                </>
              ) : (
                "Register Store"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddEmployeeForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addEmployee } = useAuthStore()

  const [formData, setFormData] = useState({
    fullname: "",
    employeeId: "",
    password: "",
    storeCode: "",
    role: "STORE MANAGER",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullname || !formData.employeeId || !formData.password || !formData.storeCode) {
      toast.error("Please fill out all required fields.")
      return;
    }

    setIsSubmitting(true);

    try {
      await addEmployee(formData); 
      console.log("Submitting payload:", formData);

      setFormData({
        fullname: "",
        employeeId: "",
        password: "",
        storeCode: "",
        role: "STORE MANAGER",
      });
      toast.success("Employee added successfully");
    } catch (error) {
      console.error("Failed to add employee:", error);
      toast.error("Failed to add employee");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            Add New Employee
          </h2>
          <p className="text-sm text-neutral-500 mt-2">
            Create credentials and assign a role to a new team member.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 ml-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="e.g. Sahin Mallick"
                className="w-full px-4 py-3.5 bg-neutral-50/50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all duration-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 ml-1">
                  Employee ID
                </label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  placeholder="e.g. 552054"
                  className="w-full px-4 py-3.5 bg-neutral-50/50 border border-neutral-200 rounded-xl text-sm font-mono text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 ml-1">
                  Store Code
                </label>
                <input
                  type="text"
                  name="storeCode"
                  value={formData.storeCode}
                  onChange={handleChange}
                  placeholder="e.g. 00001"
                  className="w-full px-4 py-3.5 bg-neutral-50/50 border border-neutral-200 rounded-xl text-sm font-mono text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 ml-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 bg-neutral-50/50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 ml-1">
                Role
              </label>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 bg-neutral-50/50 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-900 focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all duration-200 appearance-none cursor-pointer"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="STORE MANAGER">Store Manager</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-neutral-500">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-neutral-900 text-white text-sm font-semibold py-4 rounded-xl hover:bg-black active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-5 h-5 animate-spin text-white/70" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


const CheckStore = () => {
  const [activeReport, setActiveReport] = useState(null);
  const { stores, getAllStores } = useAdminStore();

  useEffect(() => {
    getAllStores();
  }, [getAllStores]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  // Calculate totals for detail view using useMemo (preserves logic, enhances UI)
  const detailTotalQuantity = useMemo(() => {
    if (!activeReport) return 0;
    return activeReport.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [activeReport]);

  // --- DETAIL VIEW COMPONENT ---
  if (activeReport) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out h-[calc(100vh-140px)] flex flex-col">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-200 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveReport(null)}
              className="p-2 -ml-2 rounded-xl hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-900"
              aria-label="Go back"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
                {activeReport.storeName}
              </h2>
              <p className="text-sm text-neutral-500 mt-0.5">
                {activeReport.storeAddress}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <span className="px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-bold uppercase tracking-widest rounded-full shadow-sm">
              Active Store
            </span>
          </div>
        </div>

        {/* Meta Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0 mt-6 mb-6">
          <div className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-center">
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Submitted By</p>
            <p className="text-base font-bold text-neutral-900">{activeReport.submittedBy?.fullname || activeReport.submittedBy}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-mono bg-neutral-100 border border-neutral-200 px-2 py-1 rounded-md text-neutral-600">
                ID: {activeReport.employeeId || "N/A"}
              </span>
            </div>
          </div>
          <div className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-center">
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Report Details</p>
            <p className="text-base font-bold text-neutral-900">{formatDate(activeReport.date)}</p>
            <p className="text-sm text-neutral-500 mt-1">{activeReport.items.length} Unique SKUs Found</p>
          </div>
        </div>

        {/* Sticky Inventory Table */}
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm flex flex-col flex-grow overflow-hidden relative">
          <div className="overflow-y-auto flex-grow h-full">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-neutral-50/95 backdrop-blur-md z-10 shadow-sm border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-600 uppercase tracking-wider w-1/2">Product Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-600 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-600 uppercase tracking-wider text-right">Quantity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {activeReport.items.map((item) => (
                  <tr key={item._id} className="hover:bg-neutral-50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-medium text-neutral-900 group-hover:text-black transition-colors">
                      {item.product.productName}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono bg-neutral-100 border border-neutral-200 px-2.5 py-1 rounded-md text-neutral-600">
                        {item.product.SKU}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-neutral-900 text-right">
                      {item.quantity.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="sticky bottom-0 bg-neutral-900 text-white z-10">
                <tr>
                  <td colSpan={2} className="px-6 py-4 text-sm font-bold text-right uppercase tracking-wider">
                    Total Volume
                  </td>
                  <td className="px-6 py-4 text-base font-extrabold text-right">
                    {detailTotalQuantity.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // --- GRID VIEW COMPONENT ---
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Manage Stores</h2>
          <p className="text-sm text-neutral-500 mt-1">View and manage inventory reports.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-neutral-200 shadow-sm flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm font-semibold text-neutral-900">{stores?.count || 0} Stores Fetched</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores?.data?.map((store) => {
          return (
            <div key={store.storeId || store._id} className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex flex-col justify-between hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-neutral-300 transition-all duration-300">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-xl text-neutral-900 tracking-tight truncate pr-2">
                    {store.storeName}
                  </h3>
                </div>
                <p className="text-sm text-neutral-500 mb-6 line-clamp-1">
                  {store.storeAddress}
                </p>

                <div className="space-y-3 mb-8 bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                  <div className="flex items-center gap-3 text-sm text-neutral-600">
                    <svg className="w-4 h-4 text-neutral-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="truncate">By <span className="font-semibold text-neutral-900">{store.submittedBy?.fullname || store.submittedBy}</span></span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-neutral-600">
                    <svg className="w-4 h-4 text-neutral-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium text-neutral-900">{formatDate(store.date)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-neutral-600">
                    <svg className="w-4 h-4 text-neutral-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span><span className="font-bold text-neutral-900">{store.items.length}</span> SKUs in stock</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveReport(store)}
                className="w-full py-3.5 bg-white border-2 border-neutral-200 hover:border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white text-sm font-bold rounded-xl transition-all duration-200"
              >
                View Report
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};


// --- Main Page Layout ---

const Page = () => {
  const [activeTab, setActiveTab] = useState('check-store');

  const navItems = [
    { id: 'check-store', label: 'Check Store', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /> },
    { id: 'add-store', label: 'Add Store', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" /> },
    { id: 'add-employee', label: 'Add Employee', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" /> },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white">
      <Navbar />

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Responsive Sidebar */}
        <aside className="w-full md:w-64 bg-white md:border-r border-b md:border-b-0 border-neutral-200 flex-shrink-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          {/* Mobile: Horizontal Scrollable Tabs */}
          <div className="md:hidden flex overflow-x-auto p-4 gap-2 scrollbar-hide border-b border-neutral-100">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2.5 whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-neutral-900 text-white shadow-md'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  {item.icon}
                </svg>
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop: Vertical Menu */}
          <div className="hidden md:flex flex-col p-5 space-y-2 h-full">
            <div className="mb-6 px-3">
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Administration</p>
            </div>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 outline-none ${
                  activeTab === item.id
                    ? 'bg-neutral-900 text-white shadow-[0_4px_12px_rgba(0,0,0,0.1)]'
                    : 'bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <svg className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-neutral-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  {item.icon}
                </svg>
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto relative bg-[#fafafa]">
          <div className="max-w-6xl mx-auto w-full h-full">
            {activeTab === 'add-store' && <AddStoreForm />}
            {activeTab === 'add-employee' && <AddEmployeeForm />}
            {activeTab === 'check-store' && <CheckStore />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;