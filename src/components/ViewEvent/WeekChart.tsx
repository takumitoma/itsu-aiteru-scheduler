import { useState } from 'react';

interface WeekChartProps {
  timezone: string;
  timeRangeStart: number;
  timeRangeEnd: number;
  daysOfWeek: number[] | null;
}

const days = ['日', '月', '火', '水', '木', '金', '土'];

const WeekChart: React.FC<WeekChartProps> = ({
  timezone,
  timeRangeStart,
  timeRangeEnd,
  daysOfWeek,
}) => {
  const selectedDays = daysOfWeek ? days.filter((_, index) => daysOfWeek[index] === 1) : [];
  const timestamps: number[] = Array.from(
    { length: timeRangeEnd - timeRangeStart },
    (_, index) => timeRangeStart + index,
  );

  const [selectedBoxes, setSelectedBoxes] = useState<{ [key: string]: boolean }>({});

  const toggleBoxSelection = (key: string) => {
    setSelectedBoxes((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  console.log(selectedBoxes);

  return (
    <section className="flex justify-center select-none w-full">
      <div className="flex flex-col w-[40px] flex-shrink-0">
        <div className="h-[30px]"></div>
        {timestamps.map((timestamp) => (
          <div
            key={`time-${timestamp}`}
            className="flex justify-end mr-[5px] translate-y-[-15px] h-[60px] text-[16px]"
          >
            {timestamp + '時'}
          </div>
        ))}
        <div className="flex justify-end mr-[5px] translate-y-[-15px] h-[25px]">
          {timeRangeEnd + '時'}
        </div>
      </div>
      <div className="flex flex-col overflow-x-auto">
        <div className="flex h-[30px] min-w-max">
          {selectedDays.map((day, index) => (
            <div key={`day-${index}`} className="w-[100px] h-[30px] flex justify-center">
              {day}
            </div>
          ))}
        </div>
        <div className="flex border-customBlack border-r border-b min-w-max">
          {selectedDays.map((day) => (
            <div key={`column-${day}`} className="w-[100px] flex flex-col flex-shrink-0">
              {timestamps.map((timestamp) => (
                <div key={`cell-${day}-${timestamp}`}>
                  {[0, 1, 2, 3].map((quarter) => (
                    <div
                      key={`quarter-${day}-${timestamp}-${quarter}`}
                      className={`w-[100px] h-[15px] border-l border-customBlack 
                        ${quarter === 0 ? 'border-t' : ''}
                        ${quarter === 2 ? 'border-t border-t-gray-500' : ''}
                        ${
                          selectedBoxes[`${day}-${timestamp}-${quarter}`]
                            ? 'bg-primary'
                            : 'bg-background'
                        }
                        hover:bg-primaryHover cursor-pointer`}
                      style={{ borderTopStyle: quarter === 2 ? 'dotted' : 'solid' }}
                      onClick={() => toggleBoxSelection(`${day}-${timestamp}-${quarter}`)}
                    />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WeekChart;
