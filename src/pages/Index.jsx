
import { useState } from "react";
import { Header } from "@/components/Header";
import { DeadlineForm } from "@/components/DeadlineForm";
import { DeadlineList } from "@/components/DeadlineList";
import { CalendarView } from "@/components/CalendarView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const Index = () => {
  const [deadlines, setDeadlines] = useState([
    {
      id: "1",
      title: "Math Quiz Chapter 5",
      subject: "Mathematics",
      type: "quiz",
      dueDate: new Date(2025, 5, 10),
      priority: "high",
      completed: false,
      description: "Covers algebra and trigonometry"
    },
    {
      id: "2",
      title: "History Essay",
      subject: "History",
      type: "assignment",
      dueDate: new Date(2025, 5, 15),
      priority: "medium",
      completed: false,
      description: "World War II analysis"
    }
  ]);
  
  const [isFormOpen, setIsFormOpen] = useState(false);

  const addDeadline = (newDeadline) => {
    const deadline = {
      ...newDeadline,
      id: Date.now().toString(),
    };
    setDeadlines([...deadlines, deadline]);
    setIsFormOpen(false);
  };

  const updateDeadline = (id, updates) => {
    setDeadlines(deadlines.map(deadline => 
      deadline.id === id ? { ...deadline, ...updates } : deadline
    ));
  };

  const deleteDeadline = (id) => {
    setDeadlines(deadlines.filter(deadline => deadline.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
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
            <DialogContent className="max-w-2xl">
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
