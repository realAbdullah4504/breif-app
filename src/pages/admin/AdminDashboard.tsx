import React, { useState, useEffect } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  CheckCircle, 
  XCircle, 
  Bell, 
  Eye, 
  Search, 
  Calendar, 
  Filter, 
  Clock, 
  ChevronDown, 
  LayoutGrid, 
  List, 
  Download, 
  MessageSquare, 
  AlertTriangle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';

import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card, { CardHeader, CardBody } from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Modal from '../../components/UI/Modal';
import Input from '../../components/UI/Input';
import TextArea from '../../components/UI/TextArea';
import { mockBriefs, mockSettings } from '../../data/mockData';
import { Brief } from '../../types';

const AdminDashboard: React.FC = () => {
  const [selectedBrief, setSelectedBrief] = useState<Brief | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reminderSent, setReminderSent] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [filterStatus, setFilterStatus] = useState<'all' | 'submitted' | 'pending'>('all');
  const [filterReview, setFilterReview] = useState<'all' | 'reviewed' | 'pending'>('all');
  const [filterDate, setFilterDate] = useState<'today' | 'yesterday' | 'week' | 'custom'>('today');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [reviewedBriefs, setReviewedBriefs] = useState<Record<string, boolean>>({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Calculate dashboard metrics
  const totalBriefs = mockBriefs.length;
  const submittedBriefs = mockBriefs.filter(brief => brief.submitted).length;
  const pendingBriefs = totalBriefs - submittedBriefs;
  const submissionRate = (submittedBriefs / totalBriefs) * 100;

  // Calculate time until deadline
  const deadlineHour = parseInt(mockSettings.submissionDeadline.split(':')[0]);
  const deadlineMinute = parseInt(mockSettings.submissionDeadline.split(':')[1]);
  const now = new Date();
  const deadline = new Date(now);
  deadline.setHours(deadlineHour, deadlineMinute, 0, 0);
  if (deadline < now) {
    deadline.setDate(deadline.getDate() + 1);
  }
  const timeUntilDeadline = formatDistanceToNow(deadline, { addSuffix: true });

  const handleViewBrief = (brief: Brief) => {
    setSelectedBrief(brief);
    setAdminNotes('');
    setIsModalOpen(true);
  };

  const handleSendReminder = (userId: string) => {
    setReminderSent(prev => ({ ...prev, [userId]: true }));
    // In a real app, this would send an API request
  };

  const handleSendAllReminders = () => {
    const newReminderSent = { ...reminderSent };
    mockBriefs.forEach(brief => {
      if (!brief.submitted) {
        newReminderSent[brief.userId] = true;
      }
    });
    setReminderSent(newReminderSent);
    // In a real app, this would send API requests
  };

  const handleMarkAsReviewed = (briefId: string) => {
    setReviewedBriefs(prev => ({ ...prev, [briefId]: true }));
    // In a real app, this would update the database
  };

  const handleDownloadBrief = () => {
    // In a real app, this would generate and download a PDF
    alert('PDF download functionality would be implemented here');
  };

  const filteredBriefs = mockBriefs.filter(brief => {
    // Filter by search term
    const matchesSearch = brief.userName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by submission status
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'submitted' && brief.submitted) || 
      (filterStatus === 'pending' && !brief.submitted);
    
    // Filter by review status
    const isReviewed = reviewedBriefs[brief.id];
    const matchesReview = 
      filterReview === 'all' || 
      (filterReview === 'reviewed' && isReviewed) || 
      (filterReview === 'pending' && !isReviewed && brief.submitted);
    
    // Filter by date (simplified for demo)
    const matchesDate = true; // In a real app, we would check the date
    
    return matchesSearch && matchesStatus && matchesReview && matchesDate;
  });

  const today = format(new Date(), 'EEEE, MMMM d, yyyy');

  return (
    <DashboardLayout>
      <div className={`transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Admin Dashboard</h1>
            <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              {today}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'} shadow-md hover:shadow-lg transition-all`}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {/* Summary Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}
          >
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Submission Rate</h3>
              <div className={`h-10 w-10 rounded-full ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'} flex items-center justify-center`}>
                <CheckCircle className={`h-5 w-5 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  <CountUp end={submittedBriefs} duration={1.5} /> of {totalBriefs} briefs submitted
                </span>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                  <CountUp end={submissionRate} duration={1.5} decimals={0} suffix="%" />
                </span>
              </div>
              <div className={`w-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${submissionRate}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-blue-600 rounded-full"
                ></motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}
          >
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Pending Briefs</h3>
              <div className={`h-10 w-10 rounded-full ${pendingBriefs > 0 ? (isDarkMode ? 'bg-red-900' : 'bg-red-100') : (isDarkMode ? 'bg-green-900' : 'bg-green-100')} flex items-center justify-center`}>
                {pendingBriefs > 0 ? (
                  <XCircle className={`h-5 w-5 ${isDarkMode ? 'text-red-300' : 'text-red-600'}`} />
                ) : (
                  <CheckCircle className={`h-5 w-5 ${isDarkMode ? 'text-green-300' : 'text-green-600'}`} />
                )}
              </div>
            </div>
            <div className="mt-4">
              <p className={`text-2xl font-bold ${pendingBriefs > 0 ? (isDarkMode ? 'text-red-300' : 'text-red-600') : (isDarkMode ? 'text-green-300' : 'text-green-600')}`}>
                <CountUp end={pendingBriefs} duration={1.5} />
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                {pendingBriefs === 0 ? 'All briefs submitted!' : pendingBriefs === 1 ? 'team member hasn\'t submitted' : 'team members haven\'t submitted'}
              </p>
              {pendingBriefs > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={handleSendAllReminders}
                >
                  <Bell className="h-4 w-4 mr-1" />
                  Send All Reminders
                </Button>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}
          >
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Submission Deadline</h3>
              <div className={`h-10 w-10 rounded-full ${isDarkMode ? 'bg-purple-900' : 'bg-purple-100'} flex items-center justify-center`}>
                <Clock className={`h-5 w-5 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`} />
              </div>
            </div>
            <div className="mt-4">
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                {format(deadline, 'h:mm a')}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                {timeUntilDeadline}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Search & Filters Bar */}
        <div className={`mb-6 p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
              </div>
              <input
                type="text"
                placeholder="Search team members..."
                className={`pl-10 pr-4 py-2 w-full rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                } shadow-sm focus:outline-none focus:ring-2 transition-all`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex items-center px-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  } shadow-sm transition-all`}
                >
                  <Filter className="h-4 w-4 mr-1" />
                  Filters
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
                
                {isFilterOpen && (
                  <div className={`absolute right-0 mt-2 w-64 rounded-md shadow-lg z-10 ${
                    isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  }`}>
                    <div className="p-4 space-y-4">
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                          Submission Status
                        </label>
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value as any)}
                          className={`block w-full rounded-md border ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                        >
                          <option value="all">All</option>
                          <option value="submitted">Submitted</option>
                          <option value="pending">Pending</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                          Review Status
                        </label>
                        <select
                          value={filterReview}
                          onChange={(e) => setFilterReview(e.target.value as any)}
                          className={`block w-full rounded-md border ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                        >
                          <option value="all">All</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="pending">Pending Review</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                          Date Range
                        </label>
                        <select
                          value={filterDate}
                          onChange={(e) => setFilterDate(e.target.value as any)}
                          className={`block w-full rounded-md border ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                        >
                          <option value="today">Today</option>
                          <option value="yesterday">Yesterday</option>
                          <option value="week">Last 7 Days</option>
                          <option value="custom">Custom Range</option>
                        </select>
                      </div>
                      
                      {filterDate === 'custom' && (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                              Start Date
                            </label>
                            <input
                              type="date"
                              value={customDateRange.start}
                              onChange={(e) => setCustomDateRange({...customDateRange, start: e.target.value})}
                              className={`block w-full rounded-md border ${
                                isDarkMode 
                                  ? 'bg-gray-700 border-gray-600 text-white' 
                                  : 'bg-white border-gray-300 text-gray-900'
                              } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                            />
                          </div>
                          <div>
                            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                              End Date
                            </label>
                            <input
                              type="date"
                              value={customDateRange.end}
                              onChange={(e) => setCustomDateRange({...customDateRange, end: e.target.value})}
                              className={`block w-full rounded-md border ${
                                isDarkMode 
                                  ? 'bg-gray-700 border-gray-600 text-white' 
                                  : 'bg-white border-gray-300 text-gray-900'
                              } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="pt-2 flex justify-end">
                        <Button
                          size="sm"
                          onClick={() => setIsFilterOpen(false)}
                        >
                          Apply Filters
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center border rounded-lg overflow-hidden shadow-sm">
                <button
                  onClick={() => setViewMode('card')}
                  className={`flex items-center px-3 py-2 ${
                    viewMode === 'card' 
                      ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700' 
                      : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-500'
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center px-3 py-2 ${
                    viewMode === 'list' 
                      ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700' 
                      : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-500'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Team Standup List */}
        <div className="mb-6">
          {viewMode === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBriefs.map((brief) => (
                <motion.div
                  key={brief.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                  className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <img 
                          src={brief.userAvatarUrl} 
                          alt={brief.userName} 
                          className="h-10 w-10 rounded-full mr-3" 
                        />
                        <div>
                          <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {brief.userName}
                          </h3>
                          {brief.submitted && (
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Submitted at 5:03 PM
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        {brief.submitted ? (
                          <Badge variant="success" className="flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Submitted
                          </Badge>
                        ) : (
                          <Badge variant="danger" className="flex items-center">
                            <XCircle className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {brief.submitted && (
                      <div className="mb-4">
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} line-clamp-2`}>
                          {brief.accomplishments}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div>
                        {brief.submitted && reviewedBriefs[brief.id] ? (
                          <Badge variant="info" className="flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Reviewed
                          </Badge>
                        ) : brief.submitted ? (
                          <Badge variant="warning" className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending Review
                          </Badge>
                        ) : null}
                      </div>
                      <div className="flex space-x-2">
                        {brief.submitted ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewBrief(brief)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSendReminder(brief.userId)}
                            disabled={reminderSent[brief.userId]}
                          >
                            <Bell className="h-4 w-4 mr-1" />
                            {reminderSent[brief.userId] ? 'Sent' : 'Remind'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <tr>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Team Member
                      </th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Status
                      </th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Review Status
                      </th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Submitted At
                      </th>
                      <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`${isDarkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                    {filteredBriefs.map((brief) => (
                      <tr key={brief.id} className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-full" src={brief.userAvatarUrl} alt="" />
                            </div>
                            <div className="ml-4">
                              <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {brief.userName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {brief.submitted ? (
                            <Badge variant="success" className="flex items-center">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Submitted
                            </Badge>
                          ) : (
                            <Badge variant="danger" className="flex items-center">
                              <XCircle className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {brief.submitted && reviewedBriefs[brief.id] ? (
                            <Badge variant="info" className="flex items-center">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Reviewed
                            </Badge>
                          ) : brief.submitted ? (
                            <Badge variant="warning" className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending Review
                            </Badge>
                          ) : (
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>-</span>
                          )}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          {brief.submitted ? '5:03 PM' : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {brief.submitted ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewBrief(brief)}
                              className="mr-2"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSendReminder(brief.userId)}
                              disabled={reminderSent[brief.userId]}
                            >
                              <Bell className="h-4 w-4 mr-1" />
                              {reminderSent[brief.userId] ? 'Reminder Sent' : 'Send Reminder'}
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Brief Detail Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Brief Details"
          size="lg"
        >
          {selectedBrief && (
            <div className={`space-y-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img 
                    src={selectedBrief.userAvatarUrl} 
                    alt={selectedBrief.userName} 
                    className="h-10 w-10 rounded-full mr-3" 
                  />
                  <div>
                    <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedBrief.userName}
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {selectedBrief.date} • Submitted at 5:03 PM
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {reviewedBriefs[selectedBrief.id] ? (
                    <Badge variant="info" className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Reviewed
                    </Badge>
                  ) : (
                    <Badge variant="warning" className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending Review
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="mb-4">
                  <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-1`}>
                    {mockSettings.questions.accomplishments}
                  </h4>
                  <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedBrief.accomplishments}
                  </p>
                </div>
                
                <div className="mb-4">
                  <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-1`}>
                    {mockSettings.questions.blockers}
                  </h4>
                  <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedBrief.blockers || "None reported"}
                  </p>
                </div>
                
                <div>
                  <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-1`}>
                    {mockSettings.questions.priorities}
                  </h4>
                  <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedBrief.priorities}
                  </p>
                </div>
                
                {mockSettings.questions.question4 && selectedBrief.question4 && (
                  <div className="mt-4">
                    <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-1`}>
                      {mockSettings.questions.question4}
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedBrief.question4}
                    </p>
                  </div>
                )}
                
                {mockSettings.questions.question5 && selectedBrief.question5 && (
                  <div className="mt-4">
                    <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-1`}>
                      {mockSettings.questions.question5}
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedBrief.question5}
                    </p>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-1`}>
                  Admin Notes
                </h4>
                <TextArea
                  id="admin-notes"
                  placeholder="Add private notes about this brief..."
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                />
              </div>
              
              <div className="pt-4 flex justify-between">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={handleDownloadBrief}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download PDF
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </Button>
                  {!reviewedBriefs[selectedBrief.id] && (
                    <Button
                      onClick={() => {
                        handleMarkAsReviewed(selectedBrief.id);
                        setIsModalOpen(false);
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark as Reviewed
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;