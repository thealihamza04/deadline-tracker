import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isSameMonth,
  parseISO,
} from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Deadline } from "@/pages/Index";

interface CalendarViewProps {
  deadlines: Deadline[];
}

export const CalendarView = ({ deadlines }: CalendarViewProps) => {
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [selectedDayForDetails, setSelectedDayForDetails] =
    useState<Date | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Calculate calendar grid days
  const monthStart = startOfMonth(currentMonthDate);
  const firstDayOfWeek = monthStart.getDay(); // 0 for Sunday, 6 for Saturday
  const calendarStartDate = new Date(monthStart);
  calendarStartDate.setDate(monthStart.getDate() - firstDayOfWeek);

  const totalCalendarDays = 42; // Ensures 6 full weeks
  const calendarEndDate = new Date(calendarStartDate);
  calendarEndDate.setDate(calendarStartDate.getDate() + totalCalendarDays - 1);

  const calendarDays = eachDayOfInterval({
    start: calendarStartDate,
    end: calendarEndDate,
  });

  // Helper to get deadlines for a specific day
  const getDeadlinesForDay = (date: Date) => {
    return deadlines.filter((deadline) => isSameDay(deadline.dueDate, date));
  };

  // Navigate month function
  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentMonthDate);
    if (direction === "prev") {
      newDate.setMonth(currentMonthDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentMonthDate.getMonth() + 1);
    }
    setCurrentMonthDate(newDate);
  };

  // Function to return to the current month
  const goToCurrentMonth = () => {
    setCurrentMonthDate(new Date());
  };

  // Determine if the currently displayed month is the actual current month
  const isCurrentMonthDisplayed = isSameMonth(currentMonthDate, new Date());

  // Get dot color based on completion and priority
  const getDotColor = (deadline: Deadline) => {
    if (deadline.completed) {
      return "bg-gray-400"; // Gray for completed tasks
    }
    switch (deadline.priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500"; // Fallback
    }
  };

  // Get badge variant for priority in the detail modal
  const getBadgeVariant = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary"; // Assuming 'warning' variant exists, otherwise use 'secondary'
      case "low":
        return "success";
      default:
        return "secondary";
    }
  };

  // Handle opening the detail modal
  const openDayDetailModal = (date: Date) => {
    setSelectedDayForDetails(date);
    setIsDetailModalOpen(true);
  };

  const currentDayDeadlines = selectedDayForDetails
    ? getDeadlinesForDay(selectedDayForDetails)
    : [];

  return (
    <Card className='w-full'>
      <CardHeader className='pb-3'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
          <CardTitle className='flex items-center space-x-2 text-lg sm:text-xl'>
            <CalendarIcon className='h-4 w-4 sm:h-5 sm:w-5' />
            <span>Calendar View</span>
          </CardTitle>
          <div className='flex items-center justify-center sm:justify-end space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => navigateMonth("prev")}
              className='h-8 w-8 p-0 sm:h-9 sm:w-9'
            >
              <ChevronLeft className='h-3 w-3 sm:h-4 sm:w-4' />
            </Button>
            <span className='font-semibold text-sm sm:text-base min-w-[120px] sm:min-w-[150px] text-center'>
              {format(currentMonthDate, "MMMM yyyy")}
            </span>
            <Button
              variant='outline'
              size='sm'
              onClick={() => navigateMonth("next")}
              className='h-8 w-8 p-0 sm:h-9 sm:w-9'
            >
              <ChevronRight className='h-3 w-3 sm:h-4 sm:w-4' />
            </Button>
            {/* "Back to Today" Button - Conditionally rendered */}
            {!isCurrentMonthDisplayed && (
              <Button
                variant='secondary'
                size='sm'
                onClick={goToCurrentMonth}
                className='ml-2 text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2'
              >
                Today
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className='p-2 sm:p-6'>
        {/* Day of the week headers */}
        <div className='grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-4'>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className='p-1 sm:p-2 text-center font-semibold text-muted-foreground text-xs sm:text-sm'
            >
              <span className='hidden sm:inline'>{day}</span>
              <span className='sm:hidden'>{day.charAt(0)}</span>
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className='grid grid-cols-7 gap-1 sm:gap-2'>
          {calendarDays.map((date, index) => {
            const dayDeadlines = getDeadlinesForDay(date);
            const hasDeadlines = dayDeadlines.length > 0;
            const isCurrentMonth = isSameMonth(date, currentMonthDate);

            return (
              <div
                key={index}
                className={cn(
                  "min-h-[60px] sm:min-h-[100px] p-1 sm:p-2 border rounded-lg transition-colors cursor-pointer",
                  !isCurrentMonth && "opacity-50 text-muted-foreground",
                  isToday(date) && "bg-blue-100 border-blue-300",
                  hasDeadlines &&
                    isCurrentMonth &&
                    "bg-accent/30 hover:bg-accent/50",
                  "flex flex-col items-center sm:items-start overflow-hidden relative"
                )}
                onClick={() => openDayDetailModal(date)}
              >
                <div
                  className={cn(
                    "text-xs sm:text-sm font-medium mb-1",
                    isToday(date) && "text-blue-600"
                  )}
                >
                  {format(date, "d")}
                </div>

                {/* Visual dots for deadlines (max 3, then +N) */}
                {hasDeadlines && (
                  <div className='flex flex-wrap justify-center sm:justify-start gap-0.5 sm:gap-1 mt-1'>
                    {dayDeadlines.slice(0, 3).map((deadline) => (
                      <span
                        key={deadline.id}
                        className={cn(
                          "w-2 h-2 rounded-full",
                          getDotColor(deadline)
                        )}
                        title={deadline.title}
                      />
                    ))}
                    {dayDeadlines.length > 3 && (
                      <span className='text-[8px] sm:text-xs text-muted-foreground'>
                        +{dayDeadlines.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Full deadline names only on larger screens */}
                <div className='hidden sm:block space-y-0.5 sm:space-y-1 mt-1 w-full overflow-hidden'>
                  {dayDeadlines.slice(0, 2).map((deadline) => (
                    <div
                      key={deadline.id}
                      className={cn(
                        "text-[10px] sm:text-xs p-0.5 sm:p-1 rounded text-white truncate w-full",
                        getDotColor(deadline),
                        deadline.completed && "opacity-60 line-through"
                      )}
                      title={`${deadline.title} - ${deadline.subject}`}
                    >
                      {deadline.title}
                    </div>
                  ))}
                  {dayDeadlines.length > 2 && (
                    <div className='text-[10px] sm:text-xs text-muted-foreground text-center sm:text-left w-full'>
                      +{dayDeadlines.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend for Priority Colors */}
        <div className='mt-4 sm:mt-6 flex flex-wrap gap-x-4 gap-y-2 justify-center sm:justify-start'>
          <div className='flex items-center space-x-1'>
            <div className='w-3 h-3 bg-red-500 rounded-full'></div>
            <span className='text-xs sm:text-sm text-foreground'>
              High Priority
            </span>
          </div>
          <div className='flex items-center space-x-1'>
            <div className='w-3 h-3 bg-yellow-500 rounded-full'></div>
            <span className='text-xs sm:text-sm text-foreground'>
              Medium Priority
            </span>
          </div>
          <div className='flex items-center space-x-1'>
            <div className='w-3 h-3 bg-green-500 rounded-full'></div>
            <span className='text-xs sm:text-sm text-foreground'>
              Low Priority
            </span>
          </div>
          <div className='flex items-center space-x-1'>
            <div className='w-3 h-3 bg-gray-400 rounded-full'></div>
            <span className='text-xs sm:text-sm text-foreground'>
              Completed
            </span>
          </div>
        </div>
      </CardContent>

      {/* Deadline Details Modal (Dialog) */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent
          className='w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] overflow-y-auto 
                     sm:max-w-md md:max-w-lg lg:max-w-xl'
        >
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <CalendarIcon className='h-5 w-5 text-primary' />
              Deadlines for{" "}
              {selectedDayForDetails
                ? format(selectedDayForDetails, "PPP")
                : "Selected Day"}
            </DialogTitle>
            <DialogDescription>
              Details for assignments and quizzes due on this date.
            </DialogDescription>
          </DialogHeader>
          <div className='py-4 space-y-4'>
            {currentDayDeadlines.length > 0 ? (
              currentDayDeadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className={cn(
                    "p-3 border rounded-lg",
                    getDotColor(deadline).replace("bg-", "border-") + " border",
                    deadline.completed
                      ? "bg-muted text-muted-foreground opacity-80"
                      : "bg-card text-card-foreground"
                  )}
                >
                  <h3
                    className={cn(
                      "font-semibold text-lg",
                      deadline.completed && "line-through text-muted-foreground"
                    )}
                  >
                    {deadline.title}
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    {deadline.subject} •{" "}
                    {deadline.type === "assignment" ? "Assignment" : "Quiz"}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    Priority:{" "}
                    <Badge variant={getBadgeVariant(deadline.priority)}>
                      {deadline.priority}
                    </Badge>
                  </p>
                  <p className='text-sm text-muted-foreground mt-1'>
                    Due: {format(deadline.dueDate, "p")}
                  </p>
                  {deadline.description && (
                    <p className='text-xs mt-2 p-2 bg-background/50 rounded-md'>
                      {deadline.description}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className='text-muted-foreground text-center py-4'>
                No deadlines for this date.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CalendarView;
