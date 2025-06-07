
import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Deadline } from "@/pages/Index";

interface CalendarViewProps {
  deadlines: Deadline[];
}

export const CalendarView = ({ deadlines }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getDeadlinesForDay = (date: Date) => {
    return deadlines.filter(deadline => isSameDay(deadline.dueDate, date));
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Calendar View</span>
          </CardTitle>
          <div className="flex items-center justify-center sm:justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")} className="h-8 w-8 p-0 sm:h-9 sm:w-9">
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <span className="font-semibold text-sm sm:text-base min-w-[120px] sm:min-w-[150px] text-center">
              {format(currentDate, "MMMM yyyy")}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")} className="h-8 w-8 p-0 sm:h-9 sm:w-9">
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-2 sm:p-6">
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="p-1 sm:p-2 text-center font-semibold text-muted-foreground text-xs sm:text-sm">
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.charAt(0)}</span>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {monthDays.map((date, index) => {
            const dayDeadlines = getDeadlinesForDay(date);
            const hasDeadlines = dayDeadlines.length > 0;
            
            return (
              <div
                key={index}
                className={cn(
                  "min-h-[60px] sm:min-h-[100px] p-1 sm:p-2 border rounded-lg transition-colors",
                  isToday(date) && "bg-blue-50 border-blue-200",
                  hasDeadlines && "bg-accent/30"
                )}
              >
                <div className={cn(
                  "text-xs sm:text-sm font-medium mb-1",
                  isToday(date) && "text-blue-600"
                )}>
                  {format(date, "d")}
                </div>
                
                <div className="space-y-0.5 sm:space-y-1">
                  {dayDeadlines.slice(0, 2).map(deadline => (
                    <div
                      key={deadline.id}
                      className={cn(
                        "text-[10px] sm:text-xs p-0.5 sm:p-1 rounded text-white truncate",
                        getPriorityColor(deadline.priority),
                        deadline.completed && "opacity-60 line-through"
                      )}
                      title={`${deadline.title} - ${deadline.subject}`}
                    >
                      <span className="hidden sm:inline">{deadline.title}</span>
                      <span className="sm:hidden">{deadline.title.slice(0, 8)}...</span>
                    </div>
                  ))}
                  {dayDeadlines.length > 2 && (
                    <div className="text-[10px] sm:text-xs text-muted-foreground text-center">
                      +{dayDeadlines.length - 2}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 justify-center sm:justify-start">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded"></div>
            <span className="text-xs sm:text-sm">High Priority</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded"></div>
            <span className="text-xs sm:text-sm">Medium Priority</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded"></div>
            <span className="text-xs sm:text-sm">Low Priority</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
