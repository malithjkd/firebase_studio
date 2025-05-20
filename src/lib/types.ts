
export interface IdeationFormData {
  ideationFormNumber: string;
  date: string; // Or Date if you prefer
  targetPersona: string;
  businessSponsor: string;
  originator: string;
  dascApproval?: string; // Optional
  problemStatement: string;
  solutionStatement: string;
}

export interface Message {
  role: 'user' | 'model'; // Can expand later if needed (e.g., 'system')
  content: string;
}
```