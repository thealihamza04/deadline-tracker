import { useState } from "react";
import {
  format,
  isToday,
  isTomorrow,
  isPast,
  differenceInDays,
} from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  BookOpen,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Deadline } from "@/pages/Index";

interface DeadlineCardProps {
  deadline: Deadline;
  onUpdate: (id: string, updates: Partial<Deadline>) => void;
  onDelete: (id: string) => void;
  onEdit: (deadline: Deadline) => void; // Added onEdit prop
}

export const DeadlineCard = ({
  deadline,
  onUpdate,
  onDelete,
  onEdit,
}: DeadlineCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const isOverdue =
    !deadline.completed &&
    isPast(deadline.dueDate) &&
    !isToday(deadline.dueDate);
  const isDueToday = isToday(deadline.dueDate);
  const isDueTomorrow = isTomorrow(deadline.dueDate);

  // Original color logic - not changed
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = () => {
    return deadline.type === "assignment" ? (
      <BookOpen className='h-4 w-4' />
    ) : (
      <Brain className='h-4 w-4' />
    );
  };

  const getDateBadge = () => {
    if (deadline.completed) {
      return (
        <Badge variant='secondary' className='bg-green-100 text-green-800'>
          Completed
        </Badge>
      );
    }
    if (isOverdue) {
      return <Badge variant='destructive'>Overdue</Badge>;
    }
    if (isDueToday) {
      return (
        <Badge
          variant='destructive'
          className='bg-orange-100 text-orange-800 border-orange-200'
        >
          Due Today
        </Badge>
      );
    }
    if (isDueTomorrow) {
      return (
        <Badge variant='secondary' className='bg-blue-100 text-blue-800'>
          Due Tomorrow
        </Badge>
      );
    }

    // For future dates, show "X days left" badge if applicable
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDateStartOfDay = new Date(deadline.dueDate);
    dueDateStartOfDay.setHours(0, 0, 0, 0);
    const daysLeft = differenceInDays(dueDateStartOfDay, today);
    if (daysLeft > 0) {
      return (
        <Badge variant='secondary' className='bg-blue-100 text-blue-800'>
          {daysLeft} days left
        </Badge>
      );
    }

    return null;
  };

  return (
    // Added 'group' class to Card for hover effects on child elements
    // UPDATED CLASSNAME LOGIC FOR COMPLETED STATE:
    <Card
      className={cn(
        "group transition-all duration-200 ",
        "flex flex-col", // Ensure card itself is a flex container for its header and content
        deadline.completed // Prioritize completed styling if true
          ? "bg-muted text-muted-foreground opacity-80 border-gray-300" // Muted background, text, slight border, slightly less opaque
          : isOverdue // Otherwise, check for overdue
          ? "border-red-200 bg-red-50/30"
          : isDueToday // Otherwise, check for due today
          ? "border-orange-200 bg-orange-50/30"
          : "bg-white" // Default background
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Adjusted padding and flex layout for responsiveness */}
      <CardHeader className='flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 pr-2'>
        {/* Left Section: Checkbox, Type Icon, Title, Subject */}
        <div className='flex items-start space-x-3 flex-1 min-w-0 mb-2 sm:mb-0'>
          <Checkbox
            checked={deadline.completed}
            onCheckedChange={(checked) =>
              onUpdate(deadline.id, { completed: Boolean(checked) })
            }
            className='mt-1 flex-shrink-0'
          />
          <div className='flex-1 min-w-0'>
            {" "}
            {/* Allows text to properly truncate/wrap */}
            <div className='flex items-center space-x-2 mb-1'>
              {getTypeIcon()}
              <h3
                className={cn(
                  "font-semibold text-lg leading-tight", // Added leading-tight for tighter line spacing
                  deadline.completed && "line-through" // text-muted-foreground is applied to Card, so just line-through here
                )}
              >
                {deadline.title}
              </h3>
            </div>
            <p
              className={cn(
                "font-medium text-sm",
                deadline.completed && "line-through"
              )}
            >
              {deadline.subject}
            </p>
          </div>
        </div>

        {/* Right Section: Badges and Dropdown - RESPONSIVE CHANGES */}
        <div className='flex flex-wrap justify-end gap-2 sm:flex-nowrap sm:space-x-2 ml-auto'>
          {getDateBadge()}
          <Badge className={getPriorityColor(deadline.priority)}>
            {deadline.priority}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                className={cn(
                  "h-8 w-8 p-0 flex-shrink-0", // Prevent button from shrinking
                  // Always show on small screens, hide on hover only on larger screens
                  "opacity-100 sm:opacity-0 group-hover:sm:opacity-100" // Use group-hover with 'group' on Card
                )}
              >
                <MoreVertical className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {/* Added onClick for edit action */}
              <DropdownMenuItem onClick={() => onEdit(deadline)}>
                <Edit className='mr-2 h-4 w-4' />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className='text-red-600 focus:bg-red-50 focus:text-red-700'
                onClick={() => onDelete(deadline.id)}
              >
                <Trash2 className='mr-2 h-4 w-4' />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      {/* Card Content - Adjusted padding and flex layout */}
      <CardContent className='pt-0 pr-4 pl-4 pb-4'>
        <div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground'>
          <div className='flex items-center space-x-1'>
            <Calendar className='h-4 w-4' />
            <span>{format(deadline.dueDate, "MMM d, yyyy")}</span>{" "}
            {/* Added full year for clarity */}
          </div>
          <div className='flex items-center space-x-1'>
            <Clock className='h-4 w-4' />
            <span>
              {isPast(deadline.dueDate) &&
              !deadline.completed &&
              !isToday(deadline.dueDate) // More precise overdue check
                ? `Due: ${format(deadline.dueDate, "p")}` // Still show time for overdue
                : format(deadline.dueDate, "p")}
            </span>
          </div>
        </div>

        {deadline.description && (
          <p className='text-sm mt-3 p-3 bg-muted/50 rounded-md'>
            {deadline.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
