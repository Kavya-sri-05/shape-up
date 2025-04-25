import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { format, parseISO, differenceInDays, parse } from 'date-fns';
import { useGetAllMedicationsQuery } from '../slices/usersApiSlice';
import { useGetAllMealPlansQuery } from '../slices/usersApiSlice';
import axios from 'axios';

const NotificationSystem = () => {
  const { data: medicationsData } = useGetAllMedicationsQuery();
  const { data: mealPlansData } = useGetAllMealPlansQuery();

  // Use useMemo to memoize the derived data
  const medications = useMemo(() => medicationsData?.data || [], [medicationsData]);
  const mealPlans = useMemo(() => mealPlansData?.data || [], [mealPlansData]);

  const sendEmailNotification = async (type, data) => {
    try {
      if (type === 'medication') {
        await axios.post('/api/notifications/medication-reminder', {
          medication: data.medication,
          type: data.notificationType,
          daysUntilExpiry: data.daysUntilExpiry
        });
      } else if (type === 'meal') {
        await axios.post('/api/notifications/meal-reminder', {
          mealName: data.mealName,
          mealContent: data.mealContent
        });
      }
    } catch (error) {
      console.error('Failed to send email notification:', error);
    }
  };

  useEffect(() => {
    // Check for medication notifications
    const checkMedications = () => {
      const now = new Date();
      const currentTime = format(now, 'HH:mm');

      medications.forEach(medication => {
        if (!medication.active) return;

        // Check medication time
        const medicationTime = medication.time;
        const timeDiff = Math.abs(
          parse(currentTime, 'HH:mm', new Date()).getTime() - 
          parse(medicationTime, 'HH:mm', new Date()).getTime()
        );

        // Notify if within 15 minutes of medication time
        if (timeDiff <= 15 * 60 * 1000) {
          toast.info(`Time to take ${medication.name} (${medication.dosage})`);
          sendEmailNotification('medication', {
            medication,
            notificationType: 'reminder'
          });
        }

        // Check expiry date
        if (medication.endDate) {
          const daysUntilExpiry = differenceInDays(parseISO(medication.endDate), now);
          
          if (daysUntilExpiry <= 0) {
            toast.error(`${medication.name} has expired!`);
            sendEmailNotification('medication', {
              medication,
              notificationType: 'expiry',
              daysUntilExpiry
            });
          } else if (daysUntilExpiry <= 7) {
            toast.warning(`${medication.name} will expire in ${daysUntilExpiry} days`);
            sendEmailNotification('medication', {
              medication,
              notificationType: 'expiry',
              daysUntilExpiry
            });
          }
        }
      });
    };

    // Check for meal plan notifications
    const checkMealPlans = () => {
      const now = new Date();
      const today = format(now, 'yyyy-MM-dd');
      const currentTime = format(now, 'HH:mm');

      const todaysMealPlan = mealPlans.find(plan => 
        format(parseISO(plan.date), 'yyyy-MM-dd') === today
      );

      if (todaysMealPlan) {
        // Define meal times (you can make these configurable)
        const mealTimes = {
          meal1: '08:00', // Breakfast
          meal2: '10:30', // Morning Snack
          meal3: '13:00', // Lunch
          meal4: '16:00', // Afternoon Snack
          meal5: '19:00', // Dinner
          snacks: '20:30'  // Evening Snacks
        };

        const mealNames = {
          meal1: 'Breakfast',
          meal2: 'Morning Snack',
          meal3: 'Lunch',
          meal4: 'Afternoon Snack',
          meal5: 'Dinner',
          snacks: 'Evening Snacks'
        };

        Object.entries(mealTimes).forEach(([meal, time]) => {
          if (todaysMealPlan[meal]) {
            const mealTime = parse(time, 'HH:mm', new Date());
            const timeDiff = Math.abs(
              parse(currentTime, 'HH:mm', new Date()).getTime() - 
              mealTime.getTime()
            );

            // Notify if within 30 minutes of meal time
            if (timeDiff <= 30 * 60 * 1000) {
              const mealName = mealNames[meal];
              toast.info(`Time for ${mealName}: ${todaysMealPlan[meal]}`);
              sendEmailNotification('meal', {
                mealName,
                mealContent: todaysMealPlan[meal]
              });
            }
          }
        });
      }
    };

    // Initial check
    checkMedications();
    checkMealPlans();

    // Set up periodic checks
    const interval = setInterval(() => {
      checkMedications();
      checkMealPlans();
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [medications, mealPlans]);

  return null; // This component doesn't render anything
};

export default NotificationSystem; 