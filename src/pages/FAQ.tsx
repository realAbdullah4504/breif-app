import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import Card, { CardHeader, CardBody } from '../components/UI/Card';
import { useAuth } from '../context/AuthContext';

interface FAQItem {
  question: string;
  answer: string;
}

const commonFAQs: FAQItem[] = [
  {
    question: 'What is Briefly?',
    answer: 'Briefly is a streamlined daily check-in platform that transforms how teams communicate their progress. Here\'s how it works:\n\n1. Team members receive a daily reminder before the customizable deadline\n2. They submit a brief update covering their accomplishments, challenges, and priorities\n3. Admins can review submissions, provide feedback, and track team progress\n4. All updates are archived and easily accessible for future reference\n\nThis approach eliminates the need for lengthy status meetings while ensuring everyone stays aligned and informed. Briefly adapts to your team\'s workflow with customizable questions, flexible deadlines, and automated reminders.'
  }
];

const adminFAQs: FAQItem[] = [
  ...commonFAQs,
  {
    question: 'How do I customize brief questions?',
    answer: 'You can customize brief questions in Settings. Navigate to the Brief Questions section where you can modify existing questions or add up to two additional custom questions to better suit your team\'s needs.'
  },
  {
    question: 'How do automatic reminders work?',
    answer: 'When enabled, reminders are automatically sent to team members who haven\'t submitted their brief before the deadline.'
  },
  {
    question: 'Can I export brief data?',
    answer: 'Yes! When viewing a brief, click the "Download PDF" button to generate a formatted PDF report of that brief. This is useful for record-keeping or sharing updates with stakeholders.'
  },
  {
    question: 'How do I manage team members?',
    answer: 'Use the Team Management page to invite new members, manage existing ones, and handle invitations. You can send reminders directly from the dashboard to members who haven\'t submitted their briefs.'
  },
  {
    question: 'What are the different brief statuses?',
    answer: 'Briefs can be marked as "Submitted" (when a member completes it), "Pending" (not yet submitted), "Reviewed" (when you\'ve reviewed it), or "Pending Review" (submitted but not yet reviewed by you).'
  },
  {
    question: 'How can I filter and search briefs?',
    answer: 'Use the filters on the dashboard to sort by submission status, review status, and date range. You can also search for specific team members using the search bar.'
  }
];

const memberFAQs: FAQItem[] = [
  ...commonFAQs,
  {
    question: 'When should I submit my brief?',
    answer: 'Submit your brief before the daily deadline set by your admin. You\'ll receive a reminder if you haven\'t submitted, but it\'s best to complete it while your day\'s work is fresh in your mind.'
  },
  {
    question: 'Can I edit my brief after submitting?',
    answer: 'No, briefs cannot be edited after submission. Please review your responses carefully before submitting. If you need to make corrections, contact your admin.'
  },
  {
    question: 'What should I include in my brief?',
    answer: 'Focus on key accomplishments, any blockers you\'ve encountered, and your priorities for the next day. Be specific but concise. Include relevant details that would be helpful for your team to know.'
  },
  {
    question: 'How can I view my previous briefs?',
    answer: 'Access your brief history by clicking "View All History" on your dashboard. This shows all your past submissions, including when they were reviewed and any admin notes.'
  },
  {
    question: 'What happens after I submit my brief?',
    answer: 'Your admin will review your brief and may add notes. You\'ll be able to see when your brief has been reviewed in your brief history.'
  },
  {
    question: 'What if I miss the deadline?',
    answer: 'While it\'s best to submit before the deadline, you can still submit your brief after it passes. However, consistent late submissions may be flagged to your admin.'
  }
];

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  const faqItems = isAdmin ? adminFAQs : memberFAQs;

  const toggleItem = (index: number) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h1>
        <p className="mt-1 text-sm text-gray-500">
          Find answers to common questions about {isAdmin ? 'managing' : 'using'} Briefly.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center">
            <HelpCircle className="h-5 w-5 text-blue-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">FAQ</h2>
          </div>
        </CardHeader>
        <CardBody>
          <div className="divide-y divide-gray-200">
            {faqItems.map((item, index) => (
              <div 
                key={index} 
                className={`py-4 transition-all duration-200 ${
                  openItems[index] ? 'bg-gray-50 rounded-lg px-4 -mx-4' : ''
                }`}
              >
                <button
                  className="flex w-full justify-between items-center text-left focus:outline-none group"
                  onClick={() => toggleItem(index)}
                >
                  <span className={`text-base font-medium ${
                    openItems[index] ? 'text-blue-600' : 'text-gray-900 group-hover:text-blue-600'
                  } transition-colors duration-200`}>
                    {item.question}
                  </span>
                  {openItems[index] ? (
                    <ChevronUp className="h-5 w-5 text-blue-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 group-hover:text-blue-500" />
                  )}
                </button>
                {openItems[index] && (
                  <div className="mt-2 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardBody>
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-25">
          <p 
            className="text-center text-xs text-gray-500"
            dangerouslySetInnerHTML={{
              __html: `Powered by <strong style="color: #6366f1;">Briefly</strong> • <a href="https://my.brieflyapp.co" style="color: #6366f1; text-decoration: none;">my.brieflyapp.co</a><br />
              Need help? Contact us at <a href="mailto:contact@brieflyapp.co" style="color: #6366f1; text-decoration: none;">contact@brieflyapp.co</a>`
            }}
          />
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default FAQ;