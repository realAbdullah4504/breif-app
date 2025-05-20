import { format } from 'date-fns';
import { ChevronDown, Filter, LayoutGrid, List, Search } from 'lucide-react';
import React, { useState } from 'react'
import { FilterOptions } from '../../../types/briefTypes';
import Button from '../../UI/Button';


type FilterProps = {
    isDarkMode: boolean;
    handleFiltersQuery: (filter: FilterOptions) => void;
    handleViewMode: (option: "card" | "list") => void;
    viewMode: string
}
const FilterSection = ({ isDarkMode, handleFiltersQuery, handleViewMode, viewMode }: FilterProps) => {
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
        setIsFilterOpen(false);
    };

    return (
        <div
            className={`mb-6 p-4 ${isDarkMode ? "bg-gray-800" : "bg-white"
                } rounded-lg shadow-md`}
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-grow max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search
                            className={`h-5 w-5 ${isDarkMode ? "text-gray-400" : "text-gray-400"
                                }`}
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Search team members..."
                        className={`pl-10 pr-4 py-2 w-full rounded-lg border ${isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
                            : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                            } shadow-sm focus:outline-none focus:ring-2 transition-all`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`flex items-center px-3 py-2 rounded-lg border ${isDarkMode
                                ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                } shadow-sm transition-all`}
                        >
                            <Filter className="h-4 w-4 mr-1" />
                            Filters
                            <ChevronDown className="h-4 w-4 ml-1" />
                        </button>

                        {isFilterOpen && (
                            <div
                                className={`absolute right-0 mt-2 w-64 rounded-md shadow-lg z-10 ${isDarkMode
                                    ? "bg-gray-800 border border-gray-700"
                                    : "bg-white border border-gray-200"
                                    }`}
                            >
                                <div className="p-4 space-y-4">
                                    <div>
                                        <label
                                            className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-200" : "text-gray-700"
                                                }`}
                                        >
                                            Submission Status
                                        </label>
                                        <select
                                            value={filterStatus}
                                            onChange={(e) =>
                                                setFilterStatus(e.target.value as any)
                                            }
                                            className={`block w-full rounded-md border ${isDarkMode
                                                ? "bg-gray-700 border-gray-600 text-white"
                                                : "bg-white border-gray-300 text-gray-900"
                                                } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                                        >
                                            <option value="all">All</option>
                                            <option value="submitted">Submitted</option>
                                            <option value="pending">Pending</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label
                                            className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-200" : "text-gray-700"
                                                }`}
                                        >
                                            Review Status
                                        </label>
                                        <select
                                            value={filterReview}
                                            onChange={(e) =>
                                                setFilterReview(e.target.value as any)
                                            }
                                            className={`block w-full rounded-md border ${isDarkMode
                                                ? "bg-gray-700 border-gray-600 text-white"
                                                : "bg-white border-gray-300 text-gray-900"
                                                } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                                        >
                                            <option value="all">All</option>
                                            <option value="reviewed">Reviewed</option>
                                            <option value="pending">Pending Review</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label
                                            className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-200" : "text-gray-700"
                                                }`}
                                        >
                                            Date Range
                                        </label>
                                        <select
                                            value={filterDate}
                                            onChange={(e) => setFilterDate(e.target.value as any)}
                                            className={`block w-full rounded-md border ${isDarkMode
                                                ? "bg-gray-700 border-gray-600 text-white"
                                                : "bg-white border-gray-300 text-gray-900"
                                                } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                                        >
                                            <option value="today">Today</option>
                                            <option value="yesterday">Yesterday</option>
                                            {/* <option value="week">Last 7 Days</option> */}
                                            <option value="custom">Custom Range</option>
                                        </select>
                                    </div>

                                    {filterDate === "custom" && (
                                        <div className="grid gap-2">
                                            <div>
                                                <label
                                                    className={`block text-xs font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-500"
                                                        }`}
                                                >
                                                    Start Date
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
                                                    className={`block w-full rounded-md border ${isDarkMode
                                                        ? "bg-gray-700 border-gray-600 text-white"
                                                        : "bg-white border-gray-300 text-gray-900"
                                                        } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                                                />
                                                {dateError && (
                                                    <p className="mt-1 text-xs text-red-500">
                                                        {dateError}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-2 flex justify-end">
                                        <Button size="sm" onClick={handleFilters}>
                                            Apply Filters
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center border rounded-lg overflow-hidden shadow-sm">
                        <button
                            onClick={() => handleViewMode("card")}
                            className={`flex items-center px-3 py-2 ${viewMode === "card"
                                ? isDarkMode
                                    ? "bg-blue-600 text-white"
                                    : "bg-blue-100 text-blue-700"
                                : isDarkMode
                                    ? "bg-gray-700 text-gray-300"
                                    : "bg-white text-gray-500"
                                }`}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => handleViewMode("list")}
                            className={`flex items-center px-3 py-2 ${viewMode === "list"
                                ? isDarkMode
                                    ? "bg-blue-600 text-white"
                                    : "bg-blue-100 text-blue-700"
                                : isDarkMode
                                    ? "bg-gray-700 text-gray-300"
                                    : "bg-white text-gray-500"
                                }`}
                        >
                            <List className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FilterSection
