import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CalendarCheck, Clock, Scale, Briefcase, User } from 'lucide-react';

interface Event {
  date: string;
  title: string;
  time?: string;
  type?: 'hearing' | 'meeting' | 'deadline' | 'appointment';
}

interface CalendarProps {
  customEvents?: Event[];
}

const Calendar: React.FC<CalendarProps> = ({ customEvents }) => {
  const location = useLocation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);

  // Dynamic event generation based on route
  useEffect(() => {
    let routeEvents: Event[] = [];

    switch (location.pathname) {
      case '/lawyer':
        routeEvents = [
          {
            date: new Date(2024, 5, 15).toISOString(), // June 15
            title: 'Client Consultation - Smith Case',
            time: '10:00 AM',
            type: 'meeting'
          },
          {
            date: new Date(2024, 5, 20).toISOString(), // June 20
            title: 'Court Hearing - Johnson vs State',
            time: '2:30 PM',
            type: 'hearing'
          },
          {
            date: new Date(2024, 5, 25).toISOString(), // June 25
            title: 'Case File Preparation',
            time: '9:00 AM',
            type: 'deadline'
          }
        ];
        break;

      case '/judge':
        routeEvents = [
          {
            date: new Date(2024, 5, 16).toISOString(), // June 16
            title: 'Criminal Case Review',
            time: '10:00 AM',
            type: 'hearing'
          },
          {
            date: new Date(2024, 5, 22).toISOString(), // June 22
            title: 'Civil Litigation Hearing',
            time: '2:30 PM',
            type: 'hearing'
          },
          {
            date: new Date(2024, 5, 28).toISOString(), // June 28
            title: 'Judicial Conference',
            time: '9:00 AM',
            type: 'meeting'
          }
        ];
        break;

      case '/user':
        routeEvents = [
          {
            date: new Date(2024, 5, 17).toISOString(), // June 17
            title: 'Upcoming Court Hearing',
            time: '11:00 AM',
            type: 'hearing'
          },
          {
            date: new Date(2024, 5, 23).toISOString(), // June 23
            title: 'Legal Consultation Scheduled',
            time: '3:00 PM',
            type: 'appointment'
          },
          {
            date: new Date(2024, 5, 30).toISOString(), // June 30
            title: 'Document Submission Deadline',
            time: '5:00 PM',
            type: 'deadline'
          }
        ];
        break;

      default:
        routeEvents = customEvents || [];
    }

    // Merge with any custom events passed as prop
    setEvents([...routeEvents, ...(customEvents || [])]);
  }, [location.pathname, customEvents]);

  // Calculate days in month and first day of the month
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Event filtering for specific date
  const getEventsForDate = (day: number) => {
    const dateString = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
    return events.filter(event => new Date(event.date).toDateString() === dateString);
  };

  // Render day cells
  const renderDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="opacity-20 text-center p-2">
          {/* Empty cell */}
        </div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateEvents = getEventsForDate(day);
      const isToday = day === new Date().getDate() && 
                      currentDate.getMonth() === new Date().getMonth() && 
                      currentDate.getFullYear() === new Date().getFullYear();

      days.push(
        <div 
          key={day} 
          className={`
            relative text-center p-2 rounded-lg transition-all duration-200
            ${isToday ? 'bg-primary/20 border-2 border-primary-dark' : ''}
            ${dateEvents.length > 0 ? 'bg-secondary hover:bg-secondary/80 cursor-pointer' : ''}
          `}
        >
          <span className={`
            ${isToday ? 'font-bold text-primary-dark' : ''}
            ${dateEvents.length > 0 ? 'font-semibold' : ''}
          `}>
            {day}
          </span>
          {dateEvents.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-b-lg"></div>
          )}
        </div>
      );
    }

    return days;
  };

  // Determine icon and title based on route
  const getRouteDetails = () => {
    switch (location.pathname) {
      case '/lawyer':
        return { 
          icon: <Briefcase className="mr-2 text-primary" />, 
          title: 'Lawyer Schedule' 
        };
      case '/judge':
        return { 
          icon: <Scale className="mr-2 text-primary" />, 
          title: 'Judicial Calendar' 
        };
      case '/user':
        return { 
          icon: <User className="mr-2 text-primary" />, 
          title: 'My Legal Schedule' 
        };
      default:
        return { 
          icon: <CalendarCheck className="mr-2 text-primary" />, 
          title: 'Upcoming Events' 
        };
    }
  };

  const { icon, title } = getRouteDetails();

  return (
    <div className="bg-background shadow-lg rounded-2xl p-6 max-w-md mx-auto">
      {/* Header with month navigation */}
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={handlePrevMonth} 
          className="p-2 hover:bg-secondary rounded-full transition-colors"
        >
          <ChevronLeft className="text-primary-dark" />
        </button>
        
        <h2 className="text-xl font-bold text-primary-dark">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        
        <button 
          onClick={handleNextMonth} 
          className="p-2 hover:bg-secondary rounded-full transition-colors"
        >
          <ChevronRight className="text-primary-dark" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-medium text-sm text-primary-dark opacity-70">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {renderDays()}
      </div>

      {/* Events Section */}
      {events.length > 0 && (
        <div className="mt-6 border-t border-secondary pt-4">
          <h3 className="text-lg font-semibold text-primary-dark mb-3 flex items-center">
            {icon}
            {title}
          </h3>
          {events.slice(0, 3).map((event, index) => {
            // Select icon based on event type
            const EventIcon = event.type === 'hearing' ? Scale :
                              event.type === 'meeting' ? Briefcase :
                              event.type === 'deadline' ? Clock :
                              CalendarCheck;

            return (
              <div 
                key={index} 
                className={`
                  flex items-center rounded-lg p-3 mb-2
                  ${event.type === 'hearing' ? 'bg-red-50' :
                    event.type === 'meeting' ? 'bg-blue-50' :
                    event.type === 'deadline' ? 'bg-yellow-50' :
                    'bg-secondary/50'}
                `}
              >
                <div className="mr-3">
                  <EventIcon className={`
                    ${event.type === 'hearing' ? 'text-red-500' :
                      event.type === 'meeting' ? 'text-blue-500' :
                      event.type === 'deadline' ? 'text-yellow-500' :
                      'text-primary'}
                  `} />
                </div>
                <div>
                  <p className="font-medium text-primary-dark">{event.title}</p>
                  {event.time && (
                    <div className="text-sm text-primary-dark/70 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {event.time}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Calendar;