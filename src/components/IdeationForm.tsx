
'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { IdeationFormData } from '@/lib/types'; // Assuming types are defined here
import { format } from "date-fns"

interface IdeationFormProps {
  formData: Partial<IdeationFormData>;
  onFormChange: (field: keyof IdeationFormData, value: any) => void;
  disabled?: boolean;
}

export function IdeationForm({ formData, onFormChange, disabled = false }: IdeationFormProps) {

    // Get current date for display, update only on client
    const [currentDate, setCurrentDate] = React.useState('');
    React.useEffect(() => {
        setCurrentDate(format(new Date(), "PPP")); // Format like "Dec 31st, 2023"
    }, []);


  return (
    <form className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="ideationFormNumber">Ideation Form Number</Label>
                <Input
                id="ideationFormNumber"
                value={formData.ideationFormNumber || ''}
                readOnly // Make it read-only
                className="bg-muted/50" // Style to indicate read-only
                disabled={disabled}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" value={currentDate} readOnly className="bg-muted/50" disabled={disabled} />
            </div>
        </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="space-y-2">
                <Label htmlFor="targetPersona">Target Persona <span className="text-destructive">*</span></Label>
                <Input
                id="targetPersona"
                placeholder="e.g., Project Managers, Team Leads"
                value={formData.targetPersona || ''}
                onChange={(e) => onFormChange('targetPersona', e.target.value)}
                required
                disabled={disabled}
                />
           </div>
           <div className="space-y-2">
               <Label htmlFor="businessSponsor">Business Sponsor <span className="text-destructive">*</span></Label>
                <Input
                id="businessSponsor"
                placeholder="e.g., Head of Product"
                value={formData.businessSponsor || ''}
                onChange={(e) => onFormChange('businessSponsor', e.target.value)}
                required
                disabled={disabled}
                />
           </div>
       </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="space-y-2">
                <Label htmlFor="originator">Originator <span className="text-destructive">*</span></Label>
                <Input
                id="originator"
                placeholder="Your Name"
                value={formData.originator || ''}
                onChange={(e) => onFormChange('originator', e.target.value)}
                required
                disabled={disabled}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="dascApproval">DASC Approval Number</Label>
                <Input
                id="dascApproval"
                placeholder="Optional DASC Number"
                value={formData.dascApproval || ''}
                onChange={(e) => onFormChange('dascApproval', e.target.value)}
                disabled={disabled}
                />
            </div>
        </div>

      <div className="space-y-2">
        <Label htmlFor="problemStatement">Problem Statement <span className="text-destructive">*</span></Label>
        <Textarea
          id="problemStatement"
          placeholder="Describe the problem your project aims to solve. You can also generate this with the AI chat."
          value={formData.problemStatement || ''}
          onChange={(e) => onFormChange('problemStatement', e.target.value)}
          rows={4}
          required
          disabled={disabled}
           className={formData.problemStatement ? 'border-green-500 focus:border-green-600' : ''} // Highlight if filled
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="solutionStatement">Solution Statement <span className="text-destructive">*</span></Label>
        <Textarea
          id="solutionStatement"
          placeholder="Describe the proposed solution. You can also generate this with the AI chat."
          value={formData.solutionStatement || ''}
          onChange={(e) => onFormChange('solutionStatement', e.target.value)}
          rows={4}
          required
          disabled={disabled}
           className={formData.solutionStatement ? 'border-green-500 focus:border-green-600' : ''} // Highlight if filled
        />
      </div>
       <p className="text-xs text-muted-foreground">* Required fields</p>
    </form>
  );
}
