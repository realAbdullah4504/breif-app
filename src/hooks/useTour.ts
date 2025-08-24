import { useEffect, useState } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useAuth } from '../context/AuthContext';

export const useTour = () => {
  const { currentUser } = useAuth();
  const [tourInstance, setTourInstance] = useState<any>(null);

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      const driverObj = driver({
        showProgress: true,
        showButtons: ['next', 'previous', 'close'],
        nextBtnText: 'Next →',
        prevBtnText: '← Previous',
        doneBtnText: 'Get Started! 🚀',
        closeBtnText: 'Skip Tour',
        progressText: 'Step {{current}} of {{total}}',
        popoverClass: 'driverjs-theme-briefly',
        steps: [
          {
            element: '[data-tour="welcome"]',
            popover: {
              title: '🎉 Welcome to Briefly!',
              description: 'You\'ve successfully created your workspace! Let\'s show you the two essential steps to get your team started with daily briefs.',
              side: 'bottom',
              align: 'center'
            }
          },
          {
            element: '[data-tour="team-nav"]',
            popover: {
              title: '👥 Step 1: Invite Your Team',
              description: 'Start by inviting your team members! Click here to send email invitations. Your team will receive a link to join your workspace and start submitting daily briefs.',
              side: 'right',
              align: 'start'
            }
          },
          {
            element: '[data-tour="settings-nav"]',
            popover: {
              title: '⚙️ Step 2: Customize Brief Questions',
              description: 'Customize what questions your team answers daily! Set submission deadlines, configure email reminders, and tailor the brief questions to fit your team\'s workflow.',
              side: 'right',
              align: 'start'
            }
          }
        ],
        onDestroyed: () => {
          // Mark tour as completed
          localStorage.setItem('admin_tour_completed', 'true');
          localStorage.setItem(`admin_tour_completed_${currentUser.id}`, 'true');
        }
      });

      setTourInstance(driverObj);
    }
  }, [currentUser]);

  const startTour = () => {
    if (tourInstance) {
      tourInstance.drive();
    }
  };

  const shouldShowTour = () => {
    return currentUser?.role === 'admin' && 
           !localStorage.getItem('admin_tour_completed') && 
           !localStorage.getItem(`admin_tour_completed_${currentUser.id}`);
  };

  return {
    startTour,
    shouldShowTour: shouldShowTour()
  };
};