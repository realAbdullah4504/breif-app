import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import Card, { CardHeader, CardBody } from '../components/UI/Card';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: 'What is Briefly?',
    answer: 'Briefly is a lightweight team check-in tool that helps teams stay aligned by submitting quick daily updates. Instead of long reports or endless meetings, Briefly allows team members to submit a brief summary of their work that day.'
  },
  {
    question: 'How do I invite team members?',
    answer: 'As an admin, you can invite team members from the Team Management page. Simply enter their email address and click "Send Invitation". They will receive an email with instructions to join your workspace.'
  },
  {
    question: 'When should I submit my brief?',
    answer: 'You should submit your brief at the end of your workday, before the submission deadline set by your admin. This helps keep the team updated on your progress and any challenges you might be facing.'
  },
  {
    question: 'Can I edit my brief after submitting?',
    answer: 'Currently, briefs cannot be edited after submission. Please make sure to review your brief before submitting it.'
  },
  {
    question: 'How do reminders work?',
    answer: 'If enabled by your admin, automatic reminders will be sent to team members who haven\'t submitted their brief by the deadline. Admins can also manually send reminders from the dashboard.'
  },
  {
    question: 'Can I customize the brief questions?',
    answer: 'Yes, admins can customize the brief questions from the Settings page. You can modify the wording of the questions to better suit your team\'s needs.'
  },
  {
    question: 'Is there a mobile app?',
    answer: 'Not yet, but Briefly is fully responsive and works well on mobile browsers. We\'re considering developing native mobile apps in the future.'
  },
  {
    question: 'How can I view past briefs?',
    answer: 'Team members can view their own past briefs from their dashboard. Admins can view all team members\' briefs from the admin dashboard.'
  }
];

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

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
          Find answers to common questions about using Briefly.
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
              <div key={index} className="py-4">
                <button
                  className="flex w-full justify-between items-center text-left focus:outline-none"
                  onClick={() => toggleItem(index)}
                >
                  <span className="text-base font-medium text-gray-900">{item.question}</span>
                  {openItems[index] ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {openItems[index] && (
                  <div className="mt-2 text-sm text-gray-500">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Still have questions?</h2>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-gray-500 mb-4">
              If you couldn't find the answer to your question, feel free to contact our support team.
            </p>
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Contact Support</h3>
              <p className="text-sm text-gray-500">
                Email: support@briefly.com<br />
                Hours: Monday to Friday, 9am - 5pm EST
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FAQ;