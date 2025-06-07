
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
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5" />
            <span>Calendar View</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-semibold min-w-[150px] text-center">
              {format(currentDate, "MMMM yyyy")}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="p-2 text-center font-semibold text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {monthDays.map((date, index) => {
            const dayDeadlines = getDeadlinesForDay(date);
            const hasDeadlines = dayDeadlines.length > 0;
            
            return (
              <div
                key={index}
                className={cn(
                  "min-h-[100px] p-2 border rounded-lg transition-colors",
                  isToday(date) && "bg-blue-50 border-blue-200",
                  hasDeadlines && "bg-accent/30"
                )}
              >
                <div className={cn(
                  "text-sm font-medium mb-1",
                  isToday(date) && "text-blue-600"
                )}>
                  {format(date, "d")}
                </div>
                
                <div className="space-y-1">
                  {dayDeadlines.slice(0, 3).map(deadline => (
                    <div
                      key={deadline.id}
                      className={cn(
                        "text-xs p-1 rounded text-white truncate",
                        getPriorityColor(deadline.priority),
                        deadline.completed && "opacity-60 line-through"
                      )}
                      title={`${deadline.title} - ${deadline.subject}`}
                    >
                      {deadline.title}
                    </div>
                  ))}
                  {dayDeadlines.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{dayDeadlines.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 flex flex-wrap gap-2">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-sm">High Priority</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-sm">Medium Priority</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-sm">Low Priority</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
