import React from 'react';

const FertilityCalendar = ({ fertileStart, fertileEnd, ovulation }) => {
  const generateCalendar = () => {
    const year = fertileStart.getFullYear();
    const month = fertileStart.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday
    
    const calendar = [];
    const currentDate = new Date(startDate);
    
    // Generate 6 weeks (42 days)
    for (let week = 0; week < 6; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const isCurrentMonth = currentDate.getMonth() === month;
        const isFertile = currentDate >= fertileStart && currentDate <= fertileEnd;
        const isOvulation = currentDate.toDateString() === ovulation.toDateString();
        
        weekDays.push({
          date: currentDate.getDate(),
          fullDate: new Date(currentDate),
          isCurrentMonth,
          isFertile,
          isOvulation
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      calendar.push(weekDays);
    }
    
    return calendar;
  };

  const calendar = generateCalendar();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-2xl font-semibold text-pink-600 mb-6">
        Fertility Calendar View
      </h3>
      
      <div className="text-center mb-4">
        <h4 className="text-xl font-medium text-gray-800">
          {monthNames[fertileStart.getMonth()]} {fertileStart.getFullYear()}
        </h4>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-pink-100">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <th key={day} className="border border-gray-300 p-3 text-center font-medium text-pink-800">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {calendar.map((week, weekIndex) => (
              <tr key={weekIndex}>
                {week.map((day, dayIndex) => (
                  <td
                    key={dayIndex}
                    className={`
                      border border-gray-300 p-2 h-20 text-center align-top
                      ${!day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'}
                      ${day.isOvulation ? 'bg-purple-200 font-bold text-purple-800' : ''}
                      ${day.isFertile && !day.isOvulation ? 'bg-pink-100 font-medium text-pink-800' : ''}
                    `}
                  >
                    <div className="flex flex-col h-full">
                      <span className="text-sm font-medium">{day.date}</span>
                      {day.isOvulation && (
                        <div className="text-xs mt-1">
                          <span className="text-purple-600">Ovulation</span>
                        </div>
                      )}
                      {day.isFertile && !day.isOvulation && (
                        <div className="text-xs mt-1">
                          <span className="text-pink-600">Fertile</span>
                        </div>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 justify-center">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-pink-100 border border-pink-300 mr-2"></div>
          <span className="text-sm text-gray-700">Fertile Window</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-purple-200 border border-purple-300 mr-2"></div>
          <span className="text-sm text-gray-700">Ovulation Day</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-white border border-gray-300 mr-2"></div>
          <span className="text-sm text-gray-700">Regular Days</span>
        </div>
      </div>
    </div>
  );
};

export default FertilityCalendar;
