
interface DeadlineFormHeaderProps {
  isEditing: boolean;
}

export const DeadlineFormHeader = ({ isEditing }: DeadlineFormHeaderProps) => {
  return (
    <div className='text-center mb-6'>
      <h2 className='text-2xl font-bold text-foreground'>
        {isEditing ? "Edit Deadline" : "Add New Deadline"}
      </h2>
      <p className='text-muted-foreground'>
        Keep track of your assignments and quizzes
      </p>
    </div>
  );
};
