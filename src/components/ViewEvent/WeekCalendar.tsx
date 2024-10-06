interface WeekCalendarProps {
  timezone: string;
  timeRangeStart: number;
  timeRangeEnd: number;
  daysOfWeek: number[] | null;
}

const days = ['日', '月', '火', '水', '木', '金', '土'];

const WeekCalendar: React.FC<WeekCalendarProps> = ({
  timezone,
  timeRangeStart,
  timeRangeEnd,
  daysOfWeek
}) => {
  const selectedDays = daysOfWeek ? days.filter((_, index) => daysOfWeek[index] === 1) : [];
  const timestamps: number[] = Array.from(
    { length: timeRangeEnd - timeRangeStart }, 
    (_, index) => timeRangeStart + index
  );

  return (
    <section className="flex justify-center">
      <div className="flex flex-col w-[40px]">
        <div className="h-[30px]"></div>
        {timestamps.map(timestamp => (
          <div key={`time-${timestamp}`} className="flex justify-end mr-[5px] translate-y-[-25%] h-[60px] text-[16px]">
            {timestamp+'時'}
          </div>
        ))}
        <div className="flex justify-end mr-[5px] translate-y-[-25%] h-[60px]">
          {timeRangeEnd+'時'}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex h-[30px]">
          {selectedDays.map((day, index) => (
            <div key={`day-${index}`} className="w-[100px] h-[30px] flex justify-center">
              {day}
            </div>
          ))}
        </div>
        <div className="flex border-customBlack border-r border-b">
          {selectedDays.map((day, dayIndex) => (
            <div key={`column-${dayIndex}`} className="w-[100px] flex flex-col">
              {timestamps.map(timestamp => (
                <div key={`cell-${dayIndex}-${timestamp}`}>
                  <div className="w-[100px] h-[15px] border-t border-l border-customBlack 
                    hover:bg-primaryHover"/>
                  <div className="w-[100px] h-[15px] border-l border-customBlack 
                    hover:bg-primaryHover"/>
                  <div 
                    className="w-[100px] h-[15px] border-t border-t-gray-500 
                      border-l border-l-customBlack hover:bg-primaryHover"
                    style={{ borderTopStyle: 'dotted' }}
                  />
                  <div className="w-[100px] h-[15px] border-l border-customBlack 
                    hover:bg-primaryHover"/>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WeekCalendar;