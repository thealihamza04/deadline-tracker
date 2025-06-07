
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Deadline } from "@/pages/Index";

interface DeadlineFormProps {
  onSubmit: (deadline: Omit<Deadline, "id">) => void;
  initialData?: Partial<Deadline>;
}

export const DeadlineForm = ({ onSubmit, initialData }: DeadlineFormProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [subject, setSubject] = useState(initialData?.subject || "");
  const [type, setType] = useState<"assignment" | "quiz">(initialData?.type || "assignment");
  const [dueDate, setDueDate] = useState<Date | undefined>(initialData?.dueDate);
  const [priority, setPriority] = useState<"high" | "medium" | "low">(initialData?.priority || "medium");
  const [description, setDescription] = useState(initialData?.description || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subject || !dueDate) return;

    onSubmit({
      title,
      subject,
      type,
      dueDate,
      priority,
      description,
      completed: false,
    });

    // Reset form
    setTitle("");
    setSubject("");
    setType("assignment");
    setDueDate(undefined);
    setPriority("medium");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Add New Deadline</h2>
        <p className="text-muted-foreground">Keep track of your assignments and quizzes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Math Quiz Chapter 5"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject *</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Mathematics"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Type *</Label>
          <Select value={type} onValueChange={(value: "assignment" | "quiz") => setType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="assignment">Assignment</SelectItem>
              <SelectItem value="quiz">Quiz</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Due Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Priority</Label>
          <Select value={priority} onValueChange={(value: "high" | "medium" | "low") => setPriority(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Additional details about the assignment or quiz..."
          className="min-h-[100px]"
        />
      </div>

      <Button type="submit" className="w-full" size="lg">
        Add Deadline
      </Button>
    </form>
  );
};
