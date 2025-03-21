
import { useState } from 'react';
import { Contact } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CallCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact;
}

const CallCustomerDialog = ({
  open,
  onOpenChange,
  contact,
}: CallCustomerDialogProps) => {
  const [callGoal, setCallGoal] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleCall = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success toast
    toast({
      title: 'Call initiated',
      description: `Call to ${contact.name} with goal: ${callGoal}`,
    });
    
    // Reset and close
    setCallGoal('');
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Call Customer</DialogTitle>
          <DialogDescription>
            Set a goal for your call with {contact.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{contact.phone || 'No phone number available'}</span>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="call-goal">Call Goal</Label>
            <Textarea
              id="call-goal"
              placeholder="What do you want to achieve with this call?"
              value={callGoal}
              onChange={(e) => setCallGoal(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCall}
            disabled={isSubmitting || !callGoal.trim() || !contact.phone}
          >
            {isSubmitting ? 'Initiating Call...' : 'Start Call'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CallCustomerDialog;
