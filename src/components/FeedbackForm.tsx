import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../Firebase";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";

interface FeedbackFormProps {
  onClose: () => void;
}

export const FeedbackForm = ({ onClose }: FeedbackFormProps) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // await addDoc(collection(db, "feedback"), {
      //   subject: subject.trim(),
      //   message: message.trim(),
      //   userId: user?.uid || "anonymous",
      //   userEmail: user?.email || "anonymous",
      //   timestamp: new Date(),
      //   status: "new",
      // });

      await axios.post(import.meta.env.VITE_FEEDBACKS_URL, {
        webapp: "Dealin-tracker",
        senderName: "Anonymous",
        subject: subject.trim(),
        message: message.trim(),
        userId: user?.uid || "anonymous",
        senderEmail: user?.email || "anonymous",
        date: new Date(),
      });

      toast({
        title: "Feedback Sent!",
        description: "Thank you for your feedback. We appreciate it!",
      });

      setSubject("");
      setMessage("");
      onClose();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error",
        description: "Failed to send feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className='w-full shadow-none border-none'>
      <CardHeader>
        <CardTitle>Send Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='subject'>Subject</Label>
            <Input
              id='subject'
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What's your feedback about?"
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='message'>Message</Label>
            <Textarea
              id='message'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='Tell us more about your experience...'
              rows={5}
              required
              className='resize-none'
            />
          </div>

          <div className='flex gap-2 justify-end'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={loading}>
              {loading ? "Sending..." : "Send Feedback"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
