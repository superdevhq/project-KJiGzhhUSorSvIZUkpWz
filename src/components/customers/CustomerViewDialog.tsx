
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
import { 
  Phone, 
  Mail, 
  Building, 
  Calendar, 
  Edit, 
  MapPin, 
  Globe, 
  Users, 
  Clock 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import CallCustomerDialog from './CallCustomerDialog';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';

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
        <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden">
          {/* Header with background color */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 text-white">
            <DialogHeader className="mb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-bold text-white">Customer Profile</DialogTitle>
                {contact.position && (
                  <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                    {contact.position}
                  </Badge>
                )}
              </div>
              <DialogDescription className="text-indigo-100 opacity-90">
                View detailed information about this customer
              </DialogDescription>
            </DialogHeader>

            {/* Customer header with avatar and name */}
            <div className="flex items-center gap-4 mt-4">
              <Avatar className="h-20 w-20 border-2 border-white/30">
                <AvatarImage src={contact.avatar} alt={contact.name} />
                <AvatarFallback className="text-xl bg-indigo-400">{contact.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-white">{contact.name}</h2>
                <div className="flex items-center gap-2 mt-1 text-indigo-100">
                  <Mail className="h-4 w-4" />
                  <span>{contact.email}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-indigo-100">
                  <Phone className="h-4 w-4" />
                  <span>{contact.phone || 'No phone number'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Company information */}
            <Card className="mb-6 overflow-hidden border-indigo-100">
              <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100">
                <h3 className="font-medium flex items-center gap-2 text-indigo-800">
                  <Building className="h-4 w-4" />
                  Company Information
                </h3>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={contact.company.logo} alt={contact.company.name} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-800">{contact.company.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-800">{contact.company.name}</p>
                    <Badge variant="outline" className="mt-1">
                      {contact.company.industry}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  {contact.company.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-indigo-600" />
                      <a 
                        href={contact.company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        {contact.company.website}
                      </a>
                    </div>
                  )}
                  {contact.company.size && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-indigo-600" />
                      <span>
                        <span className="text-gray-500">Size:</span> {contact.company.size}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-medium text-gray-700 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-indigo-600" />
                  Timeline
                </h3>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-indigo-600" />
                    <span>Added {formatDistanceToNow(new Date(contact.createdAt), { addSuffix: true })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm mt-2">
                    <MapPin className="h-4 w-4 text-indigo-600" />
                    <span>{contact.location || 'Location not specified'}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium text-gray-700 flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-600" />
                  Relationship
                </h3>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                  <div className="text-sm">
                    <span className="text-gray-500">Status:</span> 
                    <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                      Active
                    </Badge>
                  </div>
                  <div className="text-sm mt-2">
                    <span className="text-gray-500">Last Contact:</span> 
                    <span className="ml-2">2 weeks ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <DialogFooter className="p-4 bg-gray-50">
            <div className="flex justify-between items-center w-full gap-2">
              <div className="flex gap-2">
                <Button 
                  className="bg-indigo-600 hover:bg-indigo-700"
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
            </div>
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
