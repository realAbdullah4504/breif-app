import { useState, useEffect } from "react";
import { DashboardLayout, Header } from "../Layout";
import StatsSection from "./StatsSection";
import FilterSection from "./FilterSection";
import MemberSection from "./MembersSection/MemberSection";
import { useTour } from "../../hooks/useTour";
import Button from "../UI/Button";
import { Play, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminDashboard: React.FC = () => {
    const [viewMode, setViewMode] = useState<"card" | "list">("card");
    const { startTour, shouldShowTour } = useTour();
    const [showTourPrompt, setShowTourPrompt] = useState(false);

    const handleViewMode = (option: "card" | "list") => {
        setViewMode(option)
    }

    useEffect(() => {
        // Show tour prompt after a short delay for new admins
        if (shouldShowTour) {
            const timer = setTimeout(() => {
                setShowTourPrompt(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [shouldShowTour]);

    const handleStartTour = () => {
        setShowTourPrompt(false);
        startTour();
    };

    const handleSkipTour = () => {
        setShowTourPrompt(false);
        localStorage.setItem('admin_tour_completed', 'true');
    };

    return (
        <DashboardLayout>
            <div className="bg-gray-50 min-h-screen">
                {/* Tour Prompt */}
                <AnimatePresence>
                    {showTourPrompt && (
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ duration: 0.3 }}
                            className="fixed top-4 right-4 z-50 bg-white rounded-2xl shadow-monday border border-gray-200 p-6 max-w-sm"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-gradient-monday rounded-xl flex items-center justify-center mr-3">
                                        <Play className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Welcome! 🎉</h3>
                                        <p className="text-sm text-gray-600">Take a quick tour?</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleSkipTour}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-sm text-gray-700 mb-4">
                                Let us show you around your new workspace! Learn how to invite team members, customize settings, and manage daily briefs.
                            </p>
                            <div className="flex space-x-2">
                                <Button
                                    onClick={handleStartTour}
                                    size="sm"
                                    className="flex-1"
                                    icon={<Play className="w-4 h-4" />}
                                >
                                    Start Tour
                                </Button>
                                <Button
                                    onClick={handleSkipTour}
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                >
                                    Skip
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Header />
                <div data-tour="stats">
                    <StatsSection />
                </div>
                <div data-tour="filters">
                    <FilterSection viewMode={viewMode} handleViewMode={handleViewMode} />
                </div>
                <MemberSection viewMode={viewMode} />
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;