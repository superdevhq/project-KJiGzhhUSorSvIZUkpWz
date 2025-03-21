
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
    
    try {
      // Prepare data for webhook
      const callData = {
        name: contact.name,
        phone: contact.phone || 'No phone number available',
        company: contact.company.name,
        callGoal: callGoal
      };
      
      // Send data to webhook
      const response = await fetch('https://hook.us2.make.com/j44id7ybiv777ov8esagfm8gtiv44wdw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(callData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send call data');
      }
      
      // Show success toast
      toast({
        title: 'Call initiated',
        description: `Call to ${contact.name} with goal: ${callGoal}`,
      });
      
      // Reset and close
      setCallGoal('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error sending call data:', error);
      toast({
        title: 'Error',
        description: 'Failed to initiate call. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
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
