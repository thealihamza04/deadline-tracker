import { useState, useEffect } from "react"; // Add useEffect for initialData handling
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
import type { Deadline } from "@/pages/Index"; // Assuming this path correctly points to your Deadline interface

interface DeadlineFormProps {
  onSubmit: (deadline: Omit<Deadline, "id" | "completed">) => void;
  initialData?: Partial<Deadline>; // Use Partial<Deadline> to allow incomplete initial data
}

export const DeadlineForm = ({ onSubmit, initialData }: DeadlineFormProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [subject, setSubject] = useState(initialData?.subject || "");
  const [type, setType] = useState<
    "assignment" | "quiz" | "mid" | "final" | "presentation"
  >(initialData?.type || "assignment");
  const [dueDate, setDueDate] = useState<Date | undefined>(
    initialData?.dueDate
  );
  const [priority, setPriority] = useState<"high" | "medium" | "low">(
    initialData?.priority || "medium"
  );
  const [description, setDescription] = useState(
    initialData?.description || ""
  );

  // Effect to update form fields when initialData prop changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setSubject(initialData.subject || "");
      setType(initialData.type || "assignment");
      setDueDate(initialData.dueDate || undefined);
      setPriority(initialData.priority || "medium");
      setDescription(initialData.description || "");
    } else {
      // Reset form if initialData is not provided or becomes null/undefined (e.g., for adding new)
      setTitle("");
      setSubject("");
      setType("assignment");
      setDueDate(undefined);
      setPriority("medium");
      setDescription("");
    }
  }, [initialData]); // Re-run effect when initialData prop changes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subject || !dueDate) {
      // Basic client-side validation feedback
      alert("Please fill in all required fields (Title, Subject, Due Date).");
      return;
    }

    onSubmit({
      title,
      subject,
      type,
      dueDate,
      priority,
      description,
      completed: initialData?.completed || false, // Preserve completed state if editing, otherwise false
    });

    // Reset form fields only if it's a new entry (not editing an existing one)
    if (!initialData) {
      setTitle("");
      setSubject("");
      setType("assignment");
      setDueDate(undefined);
      setPriority("medium");
      setDescription("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6 py-4 md:p-4'>
      <div className='text-center mb-6'>
        <h2 className='text-2xl font-bold text-foreground'>
          {initialData ? "Edit Deadline" : "Add New Deadline"}
        </h2>
        <p className='text-muted-foreground'>
          Keep track of your assignments and quizzes
        </p>
      </div>

      {/* Grid for Title and Subject */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='title'>Title *</Label>
          <Input
            id='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='e.g., Math Quiz Chapter 5'
            required
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='subject'>Subject *</Label>
          <Input
            id='subject'
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
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
            onValueChange={(
              value: "assignment" | "quiz" | "mid" | "final" | "presentation"
            ) => setType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select type' />{" "}
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
                onSelect={setDueDate}
                initialFocus
                // Disable past dates (including the current day's time)
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
              setPriority(value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Select priority' />{" "}
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
          onChange={(e) => setDescription(e.target.value)}
          placeholder='Additional details about the assignment or quiz...'
          className='min-h-[100px]'
        />
      </div>

      {/* Submit Button */}
      <Button type='submit' className='w-full' size='lg'>
        {initialData ? "Save Changes" : "Add Deadline"}
      </Button>
    </form>
  );
};
