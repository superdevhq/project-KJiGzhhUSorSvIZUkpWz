
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, Building, Calendar, Edit } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import CallCustomerDialog from './CallCustomerDialog';

interface CustomerViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
  onEdit?: (contact: Contact) => void;
}

const CustomerViewDialog = ({
  open,
  onOpenChange,
  contact,
  onEdit,
}: CustomerViewDialogProps) => {
  const [callDialogOpen, setCallDialogOpen] = useState(false);

  if (!contact) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Customer Details</span>
              {contact.position && (
                <Badge variant="outline" className="ml-2">
                  {contact.position}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              View detailed information about this customer
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6">
            {/* Customer header with avatar and name */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={contact.avatar} alt={contact.name} />
                <AvatarFallback className="text-lg">{contact.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{contact.name}</h2>
                <p className="text-muted-foreground">{contact.email}</p>
              </div>
            </div>

            {/* Contact information */}
            <div className="grid gap-3">
              <h3 className="font-medium">Contact Information</h3>
              <div className="grid gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{contact.phone || 'No phone number'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{contact.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{contact.company.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Added {formatDistanceToNow(new Date(contact.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>

            {/* Company information */}
            <div className="grid gap-3">
              <h3 className="font-medium">Company Information</h3>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={contact.company.logo} alt={contact.company.name} />
                  <AvatarFallback>{contact.company.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{contact.company.name}</p>
                  <p className="text-sm text-muted-foreground">{contact.company.industry}</p>
                </div>
              </div>
              {contact.company.website && (
                <a 
                  href={contact.company.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 hover:underline"
                >
                  {contact.company.website}
                </a>
              )}
              {contact.company.size && (
                <p className="text-sm">
                  <span className="text-muted-foreground">Size:</span> {contact.company.size}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="flex justify-between items-center gap-2 sm:gap-0">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setCallDialogOpen(true)}
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Customer
              </Button>
              {onEdit && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    onOpenChange(false);
                    onEdit(contact);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
            <Button 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CallCustomerDialog
        open={callDialogOpen}
        onOpenChange={setCallDialogOpen}
        contact={contact}
      />
    </>
  );
};

export default CustomerViewDialog;
