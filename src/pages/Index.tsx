import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { DeadlineForm } from "@/components/DeadlineForm";
import { DeadlineList } from "@/components/DeadlineList";
import { CalendarView } from "@/components/CalendarView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

// --- Deadline Interface ---
// This interface defines the structure for a single deadline object.
// In a real project, this would typically be in a separate file like `src/types/deadline.ts`.
// For this complete file output, it's defined here for self-containment.
export interface Deadline {
  id: string; // Unique identifier for the deadline
  title: string; // Name of the assignment or quiz
  subject: string; // Subject or course name
  type: "assignment" | "quiz"; // Type of deadline
  dueDate: Date; // The date and time the deadline is due
  priority: "high" | "medium" | "low"; // Priority level
  completed: boolean; // Status of the deadline (true if completed)
  description?: string; // Optional detailed description
}

const Index = () => {
  // --- State for Deadlines (with localStorage persistence) ---
  // Initializes the 'deadlines' state by trying to load data from localStorage.
  // If no data is found or an error occurs during parsing, it starts with an empty array.
  const [deadlines, setDeadlines] = useState<Deadline[]>(() => {
    try {
      const savedDeadlines = localStorage.getItem("appdata"); // Key used for localStorage
      if (savedDeadlines) {
        const parsedData: any[] = JSON.parse(savedDeadlines);
        // Crucial: Convert 'dueDate' strings (stored in localStorage) back to Date objects.
        const loadedDeadlines: Deadline[] = parsedData.map((deadline: any) => ({
          ...deadline,
          dueDate: new Date(deadline.dueDate),
        }));
        console.log("Loaded deadlines from localStorage:", loadedDeadlines); // For debugging purposes
        return loadedDeadlines;
      }
    } catch (error) {
      console.error("Failed to load deadlines from localStorage:", error);
      // If loading fails (e.g., corrupted data), return an empty array to prevent app crash.
    }
    console.log("No saved 'appdata' found, starting with an empty list."); // For debugging
    return []; // Default to an empty array if no saved data or an error occurs.
  });

  // --- State for Form Dialog Management ---
  // Controls whether the add/edit deadline form dialog is open or closed.
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  // Stores the deadline object currently being edited. Null if adding a new deadline.
  const [editingDeadline, setEditingDeadline] = useState<Deadline | null>(null);

  // --- useEffect for localStorage Updates ---
  // This effect runs every time the 'deadlines' state array changes.
  // It ensures that the latest deadline data is saved to localStorage.
  useEffect(() => {
    console.log(
      "Deadlines state changed, attempting to save to localStorage under 'appdata'."
    ); // For debugging
    try {
      // Before saving, convert 'dueDate' Date objects to ISO strings for proper storage.
      const deadlinesToSave = deadlines.map((deadline) => ({
        ...deadline,
        dueDate: deadline.dueDate.toISOString(),
      }));
      localStorage.setItem("appdata", JSON.stringify(deadlinesToSave)); // Save data to "appdata" key
      console.log(
        "Successfully saved deadlines to localStorage:",
        deadlinesToSave
      ); // For debugging
    } catch (error) {
      console.error("Failed to save deadlines to localStorage:", error);
    }
  }, [deadlines]); // Dependency array: Effect re-runs when 'deadlines' array reference changes.

  // --- Core CRUD Operations ---

  /**
   * Adds a new deadline to the list. This is called internally by handleSaveDeadline.
   * @param {Omit<Deadline, "id" | "completed">} newDeadlineData - The new deadline data without an ID.
   */
  const addNewDeadline = (
    newDeadlineData: Omit<Deadline, "id" | "completed">
  ) => {
    const deadline: Deadline = {
      ...newDeadlineData,
      id: Date.now().toString(), // Generate a unique ID based on the current timestamp
      completed: false, // New deadlines are always initially not completed
    };
    setDeadlines((prevDeadlines) => [...prevDeadlines, deadline]); // Add to existing deadlines
  };

  /**
   * Updates an existing deadline's properties.
   * @param {string} id - The ID of the deadline to update.
   * @param {Partial<Deadline>} updates - An object containing the properties to update.
   */
  const updateDeadline = (id: string, updates: Partial<Deadline>) => {
    setDeadlines(
      (
        prevDeadlines // Use functional update for reliable state updates
      ) =>
        prevDeadlines.map((deadline) =>
          deadline.id === id ? { ...deadline, ...updates } : deadline
        )
    );
  };

  /**
   * Deletes a deadline from the list.
   * @param {string} id - The ID of the deadline to delete.
   */
  const deleteDeadline = (id: string) => {
    setDeadlines(
      (
        prevDeadlines // Use functional update
      ) => prevDeadlines.filter((deadline) => deadline.id !== id)
    );
  };

  // --- Form Handling Logic ---

  /**
   * Handles opening the form dialog for adding a new deadline.
   */
  const handleOpenAddForm = () => {
    setEditingDeadline(null); // Ensure no deadline is selected for editing
    setIsFormOpen(true); // Open the form dialog
  };

  /**
   * Handles opening the form dialog for editing an existing deadline.
   * This function will be passed down to `DeadlineList` and then `DeadlineCard`.
   * @param {Deadline} deadlineToEdit - The deadline object to populate the form with.
   */
  const handleOpenEditForm = (deadlineToEdit: Deadline) => {
    setEditingDeadline(deadlineToEdit); // Set the deadline to be edited
    setIsFormOpen(true); // Open the form dialog
  };

  /**
   * A unified submission handler for the DeadlineForm.
   * Determines if it's an add or edit operation based on 'editingDeadline' state.
   * @param {Omit<Deadline, "id" | "completed">} formData - Data submitted from the form.
   */
  const handleSaveDeadline = (formData: Omit<Deadline, "id" | "completed">) => {
    if (editingDeadline) {
      // If 'editingDeadline' is set, it means we are updating an existing deadline.
      // Pass the original ID and potentially its 'completed' status.
      updateDeadline(editingDeadline.id, {
        ...formData,
        completed: editingDeadline.completed,
      });
    } else {
      // If 'editingDeadline' is null, it means we are adding a new deadline.
      addNewDeadline(formData);
    }
    // After saving, reset editing state and close the form dialog.
    setEditingDeadline(null);
    setIsFormOpen(false);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50'>
      {/* --- Header Component --- */}
      {/* Uncomment the line below if you have a a `Header` component.
          Ensure the path "@/components/Header" is correctly configured in your project.
      */}
      {/* <Header /> */}

      <main className='container mx-auto px-4 py-8'>
        {/* --- Main Heading and Add Deadline Button Section --- */}
        {/* Refined responsiveness:
            - On small screens (`flex-col`), title/desc stacks above the button.
            - On medium screens (`sm:flex-row`), they align side-by-side.
            - `gap-4` provides spacing.
            - Text sizes and button width are adjusted for better mobile aesthetics.
        */}
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4'>
          {/* Title and Description */}
          <div className='text-center sm:text-left'>
            {/* Adjusted font sizes for responsiveness */}
            <h1 className='text-3xl sm:text-4xl font-bold text-foreground mb-2'>
              Deadline Tracker
            </h1>
            <p className='text-base sm:text-lg text-muted-foreground'>
              Stay on top of your assignments and quizzes
            </p>
          </div>

          {/* Add Deadline Button and Dialog */}
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button
                size='lg'
                // Ensured button takes full width on small screens, but max-width for better look
                // And centers it horizontally on mobile.
                className='shadow-lg hover:shadow-xl transition-shadow bg-primary text-primary-foreground hover:bg-primary/90 w-full max-w-xs sm:w-auto mx-auto sm:mx-0'
                onClick={handleOpenAddForm} // Trigger adding new deadline
              >
                <Plus className='mr-2 h-5 w-5' />
                Add Deadline
              </Button>
            </DialogTrigger>
            <DialogContent
              // Responsive classes for the dialog content:
              // Takes almost full width on small screens, then max-width on larger screens.
              // `max-h-[calc(100vh-2rem)] overflow-y-auto` ensures vertical scrolling if content is too long.
              className='w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-lg md:max-w-xl lg:max-w-2xl'
            >
              {/* DeadlineForm receives the unified onSubmit handler and initialData for editing */}
              <DeadlineForm
                onSubmit={handleSaveDeadline}
                initialData={editingDeadline || undefined} // Pass `editingDeadline` to pre-fill form for editing
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* --- Tabs for List and Calendar Views --- */}
        <Tabs defaultValue='list' className='w-full'>
          <TabsList className='grid w-full max-w-md grid-cols-2 mb-6 bg-muted'>
            <TabsTrigger
              value='list'
              className='data-[state=active]:bg-background data-[state=active]:shadow-sm'
            >
              List View
            </TabsTrigger>
            <TabsTrigger
              value='calendar'
              className='data-[state=active]:bg-background data-[state=active]:shadow-sm'
            >
              Calendar
            </TabsTrigger>
          </TabsList>

          {/* List View Content */}
          <TabsContent value='list'>
            {/* DeadlineList component displays and manages the list of deadlines.
                It receives CRUD handlers and the `onEdit` handler to open the form for editing. */}
            <DeadlineList
              deadlines={deadlines}
              onUpdate={updateDeadline}
              onDelete={deleteDeadline}
              onEdit={handleOpenEditForm} // Pass the handler to open edit form
            />
          </TabsContent>

          {/* Calendar View Content */}
          <TabsContent value='calendar'>
            {/* CalendarView component displays deadlines on a calendar grid. */}
            <CalendarView deadlines={deadlines} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
