import { format } from 'date-fns';
import { ChevronDown, ChevronUp, Filter, LayoutGrid, List, Search, Calendar, Users as UsersIcon } from 'lucide-react';
import React, { useState } from 'react'
import Button from '../../UI/Button';
import { useDashboardContext } from '../../../context/DashboardContext';
import { motion, AnimatePresence } from 'framer-motion';

type FilterProps = {
    handleViewMode: (option: "card" | "list") => void;
    viewMode: string
}

const FilterSection = ({ handleViewMode, viewMode }: FilterProps) => {
    const { handleFiltersQuery } = useDashboardContext()
    const todayDate = format(new Date(), "yyyy-MM-dd");
    const [searchTerm, setSearchTerm] = useState("");
    const [dateError, setDateError] = useState<string>("");

    const [customDateRange, setCustomDateRange] = useState(todayDate);
    const [filterStatus, setFilterStatus] = useState<
        "all" | "submitted" | "pending"
    >("all");
    const [filterReview, setFilterReview] = useState<
        "all" | "reviewed" | "pending"
    >("all");
    const [filterDate, setFilterDate] = useState<
        "today" | "yesterday" | "week" | "custom"
    >("today");

    const [isFilterOpen, setIsFilterOpen] = useState(false)

    const handleFilters = () => {
        const filter = {
            status: filterStatus,
            review: filterReview,
            date: filterDate,
            customRange: customDateRange,
        };
        handleFiltersQuery(filter)
    };

    return (
        <div className="mb-8">
            {/* Main Filter Bar */}
            <div className="card p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    {/* Search */}
                    <div className="relative flex-grow max-w-full sm:max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search team members..."
                            className="input pl-11 pr-4 py-2 sm:py-3 w-full bg-gray-50 hover:bg-white text-sm sm:text-base"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Controls */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        {/* Filter Toggle */}
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`flex items-center px-4 py-3 rounded-lg border transition-all duration-200 ${
                                isFilterOpen 
                                    ? 'border-primary-300 bg-primary-50 text-primary-700' 
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            } shadow-sm text-sm sm:text-base`}
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            Filters
                            {isFilterOpen ? (
                                <ChevronUp className="h-4 w-4 ml-2" />
                            ) : (
                                <ChevronDown className="h-4 w-4 ml-2" />
                            )}
                        </button>

                        {/* View Mode Toggle */}
                        <div className="flex items-center bg-gray-100 rounded-xl p-0.5 sm:p-1 shadow-sm">
                            <button
                                onClick={() => handleViewMode("card")}
                                className={`flex items-center px-3 py-2 rounded-md transition-all duration-200 ${
                                    viewMode === "card"
                                        ? "bg-white text-primary-700 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                <LayoutGrid className="h-4 w-4" />
                                <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium hidden md:block">Cards</span>
                            </button>
                            <button
                                onClick={() => handleViewMode("list")}
                                className={`flex items-center px-3 py-2 rounded-md transition-all duration-200 ${
                                    viewMode === "list"
                                        ? "bg-white text-primary-700 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                <List className="h-4 w-4" />
                                <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium hidden md:block">List</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Collapsible Advanced Filters */}
            <AnimatePresence>
                {isFilterOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: "hidden" }}
                        className="mt-4"
                    >
                        <div className="card p-6">
                            <div className="flex items-center mb-4">
                                <Filter className="h-5 w-5 text-gray-400 mr-2" />
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Advanced Filters</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {/* Submission Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        <UsersIcon className="h-4 w-4 inline mr-1" />
                                        Submission Status
                                    </label>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value as any)}
                                        className="input py-2 sm:py-3 px-3 sm:px-4 bg-gray-50 hover:bg-white text-sm sm:text-base"
                                    >
                                        <option value="all">All Members</option>
                                        <option value="submitted">Submitted Only</option>
                                        <option value="pending">Pending Only</option>
                                    </select>
                                </div>

                                {/* Review Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        <Filter className="h-4 w-4 inline mr-1" />
                                        Review Status
                                    </label>
                                    <select
                                        value={filterReview}
                                        onChange={(e) => setFilterReview(e.target.value as any)}
                                        className="input py-2 sm:py-3 px-3 sm:px-4 bg-gray-50 hover:bg-white text-sm sm:text-base"
                                    >
                                        <option value="all">All Reviews</option>
                                        <option value="reviewed">Reviewed</option>
                                        <option value="pending">Pending Review</option>
                                    </select>
                                </div>

                                {/* Date Range */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        <Calendar className="h-4 w-4 inline mr-1" />
                                        Date Range
                                    </label>
                                    <select
                                        value={filterDate}
                                        onChange={(e) => setFilterDate(e.target.value as any)}
                                        className="input py-2 sm:py-3 px-3 sm:px-4 bg-gray-50 hover:bg-white text-sm sm:text-base"
                                    >
                                        <option value="today">Today</option>
                                        <option value="yesterday">Yesterday</option>
                                        <option value="custom">Custom Date</option>
                                    </select>
                                </div>
                            </div>

                            {/* Custom Date Picker */}
                            {filterDate === "custom" && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-200 col-span-full"
                                >
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Select Date
                                    </label>
                                    <input
                                        type="date"
                                        value={customDateRange}
                                        onChange={(e) => {
                                            const selectedDate = e.target.value;
                                            if (selectedDate > todayDate) {
                                                setDateError("Cannot select future dates");
                                                return;
                                            }
                                            setDateError("");
                                            setCustomDateRange(selectedDate);
                                        }}
                                        className="input py-2 sm:py-3 px-3 sm:px-4 w-full"
                                    />
                                    {dateError && (
                                        <p className="mt-2 text-sm text-danger-600 flex items-center">
                                            <span className="mr-1">⚠️</span>
                                            {dateError}
                                        </p>
                                    )}
                                </motion.div>
                            )}

                            {/* Apply Filters Button */}
                            <div className="mt-4 sm:mt-6 flex justify-end">
                                <Button 
                                    onClick={handleFilters}
                                    size="md"
                                    className="w-full sm:w-auto"
                                >
                                    Apply Filters
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default FilterSection