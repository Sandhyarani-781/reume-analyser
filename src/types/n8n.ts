export type FieldType = 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'select' | 'date' | 'checkbox';

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string | boolean | number;
  options?: string[]; // for select
  helpText?: string;
}

export interface FormPreset {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
}

export interface SubmissionLogItem {
  id: string;
  timestamp: string;
  targetUrl: string;
  format: 'json' | 'form-urlencoded';
  payload: Record<string, any>;
  status?: number;
  statusText?: string;
  durationMs?: number;
  success: boolean;
  isListeningPrompt?: boolean;
  responseData?: any;
  error?: string;
}

export interface EndpointStatus {
  status: number | null;
  statusText: string | null;
  durationMs: number | null;
  isListeningPrompt: boolean;
  isReady: boolean;
  title: string | null;
  lastChecked: string | null;
  checking: boolean;
}
