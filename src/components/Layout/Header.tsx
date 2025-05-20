import { format } from 'date-fns';
import React from 'react'

const Header = ({ isDarkMode, setIsDarkMode }: { isDarkMode: boolean, setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const today = format(new Date(), "EEEE, MMMM d, yyyy");
    return (
        <div className="mb-6 flex justify-between items-center">
            <div>
                <h1
                    className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                >
                    Admin Dashboard
                </h1>
                <p
                    className={`mt-1 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                >
                    {today}
                </p>
            </div>
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`p-2 rounded-full ${isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-700"
                        } shadow-md hover:shadow-lg transition-all`}
                >
                    {isDarkMode ? "☀️" : "🌙"}
                </button>
            </div>
        </div>
    )
}

export default Header
