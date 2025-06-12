
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DeadlineFormData } from "./types";

interface DeadlineFormFieldsProps {
  formData: DeadlineFormData;
  onUpdate: (field: keyof DeadlineFormData, value: any) => void;
}

export const DeadlineFormFields = ({ formData, onUpdate }: DeadlineFormFieldsProps) => {
  const { title, subject, type, dueDate, priority, description } = formData;

  return (
    <>
      {/* Grid for Title and Subject */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='title'>Title *</Label>
          <Input
            id='title'
            value={title}
            onChange={(e) => onUpdate('title', e.target.value)}
            placeholder='e.g., Math Quiz Chapter 5'
            required
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='subject'>Subject *</Label>
          <Input
            id='subject'
            value={subject}
            onChange={(e) => onUpdate('subject', e.target.value)}
            placeholder='e.g., Mathematics'
            required
          />
        </div>
      </div>

      {/* Grid for Type, Due Date, and Priority */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='space-y-2'>
          <Label>Type *</Label>
          <Select
            value={type}
            onValueChange={(value: "assignment" | "quiz" | "mid" | "final" | "presentation") => 
              onUpdate('type', value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Select type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='assignment'>Assignment</SelectItem>
              <SelectItem value='quiz'>Quiz</SelectItem>
              <SelectItem value='mid'>Midterm</SelectItem>
              <SelectItem value='final'>Final</SelectItem>
              <SelectItem value='presentation'>Presentation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Label>Due Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {dueDate ? format(dueDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                mode='single'
                selected={dueDate}
                onSelect={(date) => onUpdate('dueDate', date)}
                initialFocus
                disabled={(date) =>
                  date < new Date(new Date().setHours(0, 0, 0, 0))
                }
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className='space-y-2'>
          <Label>Priority</Label>
          <Select
            value={priority}
            onValueChange={(value: "high" | "medium" | "low") =>
              onUpdate('priority', value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Select priority' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='high'>High</SelectItem>
              <SelectItem value='medium'>Medium</SelectItem>
              <SelectItem value='low'>Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Description Textarea */}
      <div className='space-y-2'>
        <Label htmlFor='description'>Description</Label>
        <Textarea
          id='description'
          value={description}
          onChange={(e) => onUpdate('description', e.target.value)}
          placeholder='Additional details about the assignment or quiz...'
          className='min-h-[100px]'
        />
      </div>
    </>
  );
};
