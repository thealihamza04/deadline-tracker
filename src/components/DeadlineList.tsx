import { useState } from "react";
import { DeadlineCard } from "./DeadlineCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import type { Deadline } from "@/pages/Index";

interface DeadlineListProps {
  deadlines: Deadline[];
  onUpdate: (id: string, updates: Partial<Deadline>) => void;
  onDelete: (id: string) => void;
  onEdit: (deadline: Deadline) => void;
}

export const DeadlineList = ({
  deadlines,
  onUpdate,
  onDelete,
  onEdit,
}: DeadlineListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "assignment" | "quiz" | "mid" | "final" | "presentation"
  >("all");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "completed"
  >("pending");
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "title">(
    "dueDate"
  );

  const filteredAndSortedDeadlines = deadlines
    .filter((deadline) => {
      const matchesSearch =
        deadline.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deadline.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || deadline.type === filterType;
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "completed" && deadline.completed) ||
        (filterStatus === "pending" && !deadline.completed);

      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "dueDate") {
        return a.dueDate.getTime() - b.dueDate.getTime();
      }
      if (sortBy === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return a.title.localeCompare(b.title);
    });

  const stats = {
    total: deadlines.length,
    pending: deadlines.filter((d) => !d.completed).length,
    completed: deadlines.filter((d) => d.completed).length,
    overdue: deadlines.filter((d) => !d.completed && d.dueDate < new Date())
      .length,
  };

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <div className='bg-white p-4 rounded-lg border shadow-sm'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-blue-100 rounded-lg'>
              <FileText className='h-5 w-5 text-blue-600' />
            </div>
            <div>
              <div className='text-2xl font-bold text-blue-600'>{stats.total}</div>
              <div className='text-sm text-muted-foreground'>Total</div>
            </div>
          </div>
        </div>
        <div className='bg-white p-4 rounded-lg border shadow-sm'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-orange-100 rounded-lg'>
              <Clock className='h-5 w-5 text-orange-600' />
            </div>
            <div>
              <div className='text-2xl font-bold text-orange-600'>
                {stats.pending}
              </div>
              <div className='text-sm text-muted-foreground'>Pending</div>
            </div>
          </div>
        </div>
        <div className='bg-white p-4 rounded-lg border shadow-sm'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-green-100 rounded-lg'>
              <CheckCircle className='h-5 w-5 text-green-600' />
            </div>
            <div>
              <div className='text-2xl font-bold text-green-600'>
                {stats.completed}
              </div>
              <div className='text-sm text-muted-foreground'>Completed</div>
            </div>
          </div>
        </div>
        <div className='bg-white p-4 rounded-lg border shadow-sm'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-red-100 rounded-lg'>
              <AlertTriangle className='h-5 w-5 text-red-600' />
            </div>
            <div>
              <div className='text-2xl font-bold text-red-600'>{stats.overdue}</div>
              <div className='text-sm text-muted-foreground'>Overdue</div>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-white p-4 rounded-lg border shadow-sm'>
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='flex-1 relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
            <Input
              placeholder='Search deadlines...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10 w-full'
            />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 flex-grow md:flex-none'>
            <Select
              value={filterType}
              onValueChange={(
                value:
                  | "all"
                  | "assignment"
                  | "quiz"
                  | "mid"
                  | "final"
                  | "presentation"
              ) => setFilterType(value)}
            >
              <SelectTrigger className='w-full'>
                {" "}
                <SelectValue placeholder='All Types' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Types</SelectItem>
                <SelectItem value='assignment'>Assignment</SelectItem>
                <SelectItem value='quiz'>Quiz</SelectItem>
                <SelectItem value='mid'>Midterm</SelectItem>
                <SelectItem value='final'>Final</SelectItem>
                <SelectItem value='presentation'>Presentation</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filterStatus}
              onValueChange={(value: "all" | "pending" | "completed") =>
                setFilterStatus(value)
              }
            >
              <SelectTrigger className='w-full'>
                {" "}
                <SelectValue placeholder='All Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='pending'>Pending</SelectItem>
                <SelectItem value='completed'>Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(value: "dueDate" | "priority" | "title") =>
                setSortBy(value)
              }
            >
              <SelectTrigger className='w-full'>
                {" "}
                <SelectValue placeholder='Sort By' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='dueDate'>Due Date</SelectItem>
                <SelectItem value='priority'>Priority</SelectItem>
                <SelectItem value='title'>Title</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className='grid gap-4'>
        {filteredAndSortedDeadlines.length === 0 ? (
          <div className='text-center py-12 bg-white rounded-lg border'>
            <div className='text-muted-foreground text-lg mb-2'>
              No deadlines found
            </div>
            <div className='text-sm text-muted-foreground'>
              {searchTerm || filterType !== "all" || filterStatus !== "all"
                ? "Try adjusting your filters"
                : "Add your first deadline to get started!"}
            </div>
          </div>
        ) : (
          filteredAndSortedDeadlines.map((deadline) => (
            <DeadlineCard
              key={deadline.id}
              deadline={deadline}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))
        )}
      </div>
    </div>
  );
};
