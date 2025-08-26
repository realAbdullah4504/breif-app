import { format } from 'date-fns';
import React from 'react'
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../hooks/useSettings';

const Header = () => {
    const { currentUser } = useAuth();
    const adminId=currentUser?.id?.trim() || ""
    const { settings } = useSettings(adminId);
    const today = format(new Date(), "EEEE, MMMM d, yyyy");
    
    return (
        <div className="mb-6" data-tour="welcome">
            <h1 className="text-2xl font-bold text-gray-900">
                {settings?.name || "Organization"}'s Briefing Room
            </h1>
            <p className="mt-1 text-sm text-gray-500">
                {today}
            </p>
        </div>
    )
}

export default Header