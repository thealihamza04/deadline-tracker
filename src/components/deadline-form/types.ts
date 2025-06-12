
import type { Deadline } from "@/pages/Index";

export interface DeadlineFormProps {
  onSubmit: (deadline: Omit<Deadline, "id" | "completed">) => void;
  initialData?: Partial<Deadline>;
}

export interface DeadlineFormData {
  title: string;
  subject: string;
  type: "assignment" | "quiz" | "mid" | "final" | "presentation";
  dueDate: Date | undefined;
  priority: "high" | "medium" | "low";
  description: string;
}
