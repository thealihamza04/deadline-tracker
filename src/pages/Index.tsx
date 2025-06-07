import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { DeadlineForm } from "@/components/DeadlineForm";
import { DeadlineList } from "@/components/DeadlineList";
import { CalendarView } from "@/components/CalendarView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

// Define the expected structure of a Deadline object using comments for JSX:
// {
//   id: string,
//   title: string,
//   subject: string,
//   type: "assignment" | "quiz",
//   dueDate: Date, // Stored as ISO string in localStorage, converted to Date object here
//   priority: "high" | "medium" | "low",
//   completed: boolean,
//   description?: string
// }

const Index = () => {
  // Initialize deadlines state by attempting to load from localStorage.
  // If no data is found or an error occurs, it starts with an empty array.
  const [deadlines, setDeadlines] = useState(() => {
    try {
      const savedDeadlines = localStorage.getItem("appdata");
      if (savedDeadlines) {
        const parsedData = JSON.parse(savedDeadlines);
        // Crucial: Convert dueDate strings back to Date objects, as localStorage stores strings.
        const loadedDeadlines = parsedData.map((deadline) => ({
          ...deadline,
          dueDate: new Date(deadline.dueDate),
        }));
        console.log("Loaded deadlines from localStorage:", loadedDeadlines); // For debugging
        return loadedDeadlines;
      }
    } catch (error) {
      console.error("Failed to load deadlines from localStorage:", error);
      // If loading fails, return an empty array to prevent app crash
    }
    console.log("No saved 'appdata' found, starting with an empty list."); // For debugging
    return []; // Return an empty array if no saved data or if an error occurred
  });
  
  const [isFormOpen, setIsFormOpen] = useState(false);

  // useEffect hook to store and update data on localStorage
  // This effect runs every time the 'deadlines' array state changes.
  useEffect(() => {
    console.log("Deadlines state changed, attempting to save to localStorage under 'appdata'."); // For debugging
    try {
      // Before saving, convert Date objects to ISO strings for proper storage.
      const deadlinesToSave = deadlines.map(deadline => ({
        ...deadline,
        dueDate: deadline.dueDate.toISOString(),
      }));
      localStorage.setItem("appdata", JSON.stringify(deadlinesToSave));
      console.log("Successfully saved deadlines to localStorage:", deadlinesToSave); // For debugging
    } catch (error) {
      console.error("Failed to save deadlines to localStorage:", error);
    }
  }, [deadlines]); // Dependency array: ensures effect runs only when 'deadlines' state changes

  /**
   * Adds a new deadline to the list.
   * @param {object} newDeadline - The new deadline object (excluding id and completed status).
   */
  const addDeadline = (newDeadline) => {
    const deadline = {
      ...newDeadline,
      id: Date.now().toString(), // Generate a unique ID based on timestamp
      completed: false, // New deadlines are always initially not completed
    };
    setDeadlines((prevDeadlines) => [...prevDeadlines, deadline]); // Use functional update
    setIsFormOpen(false); // Close the form dialog after adding
  };

  /**
   * Updates an existing deadline.
   * @param {string} id - The ID of the deadline to update.
   * @param {object} updates - An object containing the properties to update.
   */
  const updateDeadline = (id, updates) => {
    setDeadlines((prevDeadlines) => // Use functional update
      prevDeadlines.map(deadline => 
        deadline.id === id ? { ...deadline, ...updates } : deadline
      )
    );
  };

  /**
   * Deletes a deadline from the list.
   * @param {string} id - The ID of the deadline to delete.
   */
  const deleteDeadline = (id) => {
    setDeadlines((prevDeadlines) => // Use functional update
      prevDeadlines.filter(deadline => deadline.id !== id)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* The Header component (uncomment if you want to include it) */}
      {/* <Header /> */}
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Deadline Tracker
            </h1>
            <p className="text-muted-foreground text-lg">
              Stay on top of your assignments and quizzes
            </p>
          </div>
          
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
                <Plus className="mr-2 h-5 w-5" />
                Add Deadline
              </Button>
            </DialogTrigger>
            <DialogContent
              // UPDATED CLASSNAME FOR RESPONSIVENESS:
              className="w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-lg md:max-w-xl lg:max-w-2xl"
            >
              {/* Ensure DeadlineForm is correctly implemented for JS/TSX */}
              <DeadlineForm onSubmit={addDeadline} />
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <DeadlineList 
              deadlines={deadlines}
              onUpdate={updateDeadline}
              onDelete={deleteDeadline}
            />
          </TabsContent>
          
          <TabsContent value="calendar">
            <CalendarView deadlines={deadlines} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;