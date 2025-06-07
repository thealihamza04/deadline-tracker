
import { BookOpen, Clock } from "lucide-react";

export const Header = () => {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary rounded-lg text-primary-foreground">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">StudyTracker</h1>
            <p className="text-sm text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Academic Deadline Manager
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
