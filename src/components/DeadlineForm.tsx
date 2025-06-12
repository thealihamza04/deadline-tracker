
import { useState, useEffect } from "react";
import { DeadlineFormHeader } from "./deadline-form/DeadlineFormHeader";
import { DeadlineFormFields } from "./deadline-form/DeadlineFormFields";
import { DeadlineFormActions } from "./deadline-form/DeadlineFormActions";
import type { DeadlineFormProps, DeadlineFormData } from "./deadline-form/types";

export const DeadlineForm = ({ onSubmit, initialData }: DeadlineFormProps) => {
  const [formData, setFormData] = useState<DeadlineFormData>({
    title: initialData?.title || "",
    subject: initialData?.subject || "",
    type: initialData?.type || "assignment",
    dueDate: initialData?.dueDate,
    priority: initialData?.priority || "medium",
    description: initialData?.description || "",
  });

  // Effect to update form fields when initialData prop changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        subject: initialData.subject || "",
        type: initialData.type || "assignment",
        dueDate: initialData.dueDate || undefined,
        priority: initialData.priority || "medium",
        description: initialData.description || "",
      });
    } else {
      // Reset form if initialData is not provided or becomes null/undefined (e.g., for adding new)
      setFormData({
        title: "",
        subject: "",
        type: "assignment",
        dueDate: undefined,
        priority: "medium",
        description: "",
      });
    }
  }, [initialData]);

  const updateFormData = (field: keyof DeadlineFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.subject || !formData.dueDate) {
      alert("Please fill in all required fields (Title, Subject, Due Date).");
      return;
    }

    onSubmit({
      title: formData.title,
      subject: formData.subject,
      type: formData.type,
      dueDate: formData.dueDate,
      priority: formData.priority,
      description: formData.description,
    });

    // Reset form fields only if it's a new entry (not editing an existing one)
    if (!initialData) {
      setFormData({
        title: "",
        subject: "",
        type: "assignment",
        dueDate: undefined,
        priority: "medium",
        description: "",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6 py-4 md:p-4'>
      <DeadlineFormHeader isEditing={!!initialData} />
      <DeadlineFormFields formData={formData} onUpdate={updateFormData} />
      <DeadlineFormActions isEditing={!!initialData} />
    </form>
  );
};
