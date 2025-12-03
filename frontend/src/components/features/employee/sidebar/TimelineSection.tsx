import { MuiCard } from '../../../common';
import { ThumbUp, AttachMoney, Star } from '@mui/icons-material';
import type { EmployeeWithDetails } from '../../../../types/employee';

interface TimelineSectionProps {
  employee: EmployeeWithDetails;
}

export const TimelineSection = ({ employee }: TimelineSectionProps) => {
  // Mock timeline data - replace with actual data
  const timelineEvents = [
    {
      id: 1,
      date: 'Jan 24, 2020',
      type: 'anniversary',
      title: 'Work Anniversary - 3rd',
      icon: <ThumbUp className="text-blue-500" />,
    },
    {
      id: 2,
      date: 'Jan 24, 2020',
      type: 'pay',
      title: 'Pay Increase',
      icon: <AttachMoney className="text-green-500" />,
    },
    {
      id: 3,
      date: 'Jan 24, 2020',
      type: 'praise',
      title: 'Praise - Super Star worker',
      icon: <Star className="text-yellow-500" />,
      author: 'Raj Kumar Srinath',
      description: 'Dynamic and creative software developer with over 5 years of',
    },
  ];

  return (
    <MuiCard className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
      <div className="space-y-4">
        {timelineEvents.map((event, index) => (
          <div key={event.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                {event.icon}
              </div>
              {index < timelineEvents.length - 1 && (
                <div className="w-0.5 h-full bg-gray-200 mt-2" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <div className="text-xs text-gray-500 mb-1">{event.date}</div>
              <div className="text-sm font-medium text-gray-900 mb-1">
                {event.title}
              </div>
              {event.author && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-6 h-6 rounded-full bg-gray-300" />
                  <div className="text-xs text-gray-600">{event.author}</div>
                </div>
              )}
              {event.description && (
                <div className="text-xs text-gray-500 mt-1">
                  {event.description}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </MuiCard>
  );
};










