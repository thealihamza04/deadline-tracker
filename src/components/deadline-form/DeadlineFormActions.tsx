
import { Button } from "@/components/ui/button";

interface DeadlineFormActionsProps {
  isEditing: boolean;
}

export const DeadlineFormActions = ({ isEditing }: DeadlineFormActionsProps) => {
  return (
    <Button type='submit' className='w-full' size='lg'>
      {isEditing ? "Save Changes" : "Add Deadline"}
    </Button>
  );
};
