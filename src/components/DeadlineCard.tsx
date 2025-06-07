
import { useState } from "react";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar, Clock, MoreVertical, Edit, Trash2, BookOpen, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Deadline } from "@/pages/Index";

interface DeadlineCardProps {
  deadline: Deadline;
  onUpdate: (id: string, updates: Partial<Deadline>) => void;
  onDelete: (id: string) => void;
}

export const DeadlineCard = ({ deadline, onUpdate, onDelete }: DeadlineCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const isOverdue = !deadline.completed && isPast(deadline.dueDate) && !isToday(deadline.dueDate);
  const isDueToday = isToday(deadline.dueDate);
  const isDueTomorrow = isTomorrow(deadline.dueDate);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = () => {
    return deadline.type === "assignment" ? 
      <BookOpen className="h-4 w-4" /> : 
      <Brain className="h-4 w-4" />;
  };

  const getDateBadge = () => {
    if (deadline.completed) {
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>;
    }
    if (isOverdue) {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    if (isDueToday) {
      return <Badge variant="destructive" className="bg-orange-100 text-orange-800 border-orange-200">Due Today</Badge>;
    }
    if (isDueTomorrow) {
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Due Tomorrow</Badge>;
    }
    return null;
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-200 hover:shadow-md",
        deadline.completed && "opacity-75",
        isOverdue && "border-red-200 bg-red-50/30",
        isDueToday && "border-orange-200 bg-orange-50/30"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Checkbox
              checked={deadline.completed}
              onCheckedChange={(checked) => 
                onUpdate(deadline.id, { completed: !!checked })
              }
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                {getTypeIcon()}
                <h3 className={cn(
                  "font-semibold text-lg",
                  deadline.completed && "line-through text-muted-foreground"
                )}>
                  {deadline.title}
                </h3>
              </div>
              <p className="text-muted-foreground font-medium">{deadline.subject}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {getDateBadge()}
            <Badge className={getPriorityColor(deadline.priority)}>
              {deadline.priority}
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 w-8 p-0 transition-opacity",
                    !isHovered && "opacity-0"
                  )}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={() => onDelete(deadline.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{format(deadline.dueDate, "MMM d, yyyy")}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>
                {isPast(deadline.dueDate) && !deadline.completed
                  ? "Overdue"
                  : format(deadline.dueDate, "EEE")}
              </span>
            </div>
          </div>
        </div>
        
        {deadline.description && (
          <p className="text-sm text-muted-foreground mt-3 p-3 bg-muted/50 rounded-md">
            {deadline.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
