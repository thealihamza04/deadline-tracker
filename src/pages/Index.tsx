
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { DeadlineForm } from "@/components/DeadlineForm";
import { DeadlineList } from "@/components/DeadlineList";
import { CalendarView } from "@/components/CalendarView";
import { AuthForm } from "@/components/auth/AuthForm";
import { UserMenu } from "@/components/auth/UserMenu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { db } from "../Firebase";
import { useAuth } from "@/hooks/useAuth";

export interface Deadline {
  id: string;
  title: string;
  subject: string;
  type: "assignment" | "quiz" | "mid" | "final" | "presentation";
  dueDate: Date;
  priority: "high" | "medium" | "low";
  completed: boolean;
  description?: string;
  userId: string;
}

const Index = () => {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingDeadline, setEditingDeadline] = useState<Deadline | null>(null);
  
  const { user, loading } = useAuth();

  useEffect(() => {
    const fetchDeadlines = async () => {
      if (!user) return;
      
      try {
        const q = query(collection(db, "deadlines"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const fetched: Deadline[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            dueDate: data.dueDate.toDate(),
            id: doc.id,
          };
        }) as Deadline[];
        setDeadlines(fetched);
        console.log("Loaded user deadlines from Firebase:", fetched);
      } catch (error) {
        console.error("Error loading deadlines:", error);
      }
    };

    fetchDeadlines();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const addNewDeadline = async (
    newDeadlineData: Omit<Deadline, "id" | "completed" | "userId">
  ) => {
    const deadline: Deadline = {
      ...newDeadlineData,
      id: Date.now().toString(),
      completed: false,
      userId: user.uid,
    };

    await setDoc(doc(db, "deadlines", deadline.id), deadline);
    setDeadlines((prevDeadlines) => [...prevDeadlines, deadline]);
  };

  const updateDeadline = async (id: string, updates: Partial<Deadline>) => {
    await updateDoc(doc(db, "deadlines", id), updates);

    setDeadlines((prevDeadlines) =>
      prevDeadlines.map((deadline) =>
        deadline.id === id ? { ...deadline, ...updates } : deadline
      )
    );
  };

  const deleteDeadline = async (id: string) => {
    await deleteDoc(doc(db, "deadlines", id));
    setDeadlines((prev) => prev.filter((d) => d.id !== id));
  };

  const handleOpenAddForm = () => {
    setEditingDeadline(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (deadlineToEdit: Deadline) => {
    setEditingDeadline(deadlineToEdit);
    setIsFormOpen(true);
  };

  const handleSaveDeadline = (formData: Omit<Deadline, "id" | "completed" | "userId">) => {
    if (editingDeadline) {
      updateDeadline(editingDeadline.id, {
        ...formData,
        completed: editingDeadline.completed,
      });
    } else {
      addNewDeadline(formData);
    }
    setEditingDeadline(null);
    setIsFormOpen(false);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50'>
      <main className='container mx-auto px-4 py-8'>
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4'>
          <div className='text-center sm:text-left'>
            <h1 className='text-3xl sm:text-4xl font-bold text-foreground mb-2'>
              Deadline Tracker
            </h1>
            <p className='text-base sm:text-lg text-muted-foreground'>
              Stay on top of your assignments and quizzes
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <UserMenu />
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button
                  size='lg'
                  className='shadow-lg hover:shadow-xl transition-shadow bg-primary text-primary-foreground hover:bg-primary/90 w-full max-w-xs sm:w-auto mx-auto sm:mx-0'
                  onClick={handleOpenAddForm}
                >
                  <Plus className='mr-2 h-5 w-5' />
                  Add Deadline
                </Button>
              </DialogTrigger>
              <DialogContent className='w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-lg md:max-w-xl lg:max-w-2xl'>
                <DeadlineForm
                  onSubmit={handleSaveDeadline}
                  initialData={editingDeadline || undefined}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

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

          <TabsContent value='list'>
            <DeadlineList
              deadlines={deadlines}
              onUpdate={updateDeadline}
              onDelete={deleteDeadline}
              onEdit={handleOpenEditForm}
            />
          </TabsContent>

          <TabsContent value='calendar'>
            <CalendarView deadlines={deadlines} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
