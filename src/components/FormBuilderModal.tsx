import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  RotateCcw, 
  Check, 
  Sliders, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { FormField, FieldType, FormPreset } from '../types/n8n';
import { FORM_PRESETS } from '../constants/presets';

interface FormBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  fields: FormField[];
  onSaveFields: (newFields: FormField[]) => void;
  onSelectPreset: (preset: FormPreset) => void;
  formTitle: string;
  setFormTitle: (t: string) => void;
}

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: 'text', label: 'Single-line Text' },
  { value: 'email', label: 'Email Address' },
  { value: 'tel', label: 'Phone Number' },
  { value: 'number', label: 'Number' },
  { value: 'textarea', label: 'Multi-line Paragraph' },
  { value: 'select', label: 'Dropdown Select' },
  { value: 'date', label: 'Date Picker' },
  { value: 'checkbox', label: 'Checkbox Switch' },
];

export const FormBuilderModal: React.FC<FormBuilderModalProps> = ({
  isOpen,
  onClose,
  fields,
  onSaveFields,
  onSelectPreset,
  formTitle,
  setFormTitle,
}) => {
  const [localFields, setLocalFields] = useState<FormField[]>(fields);
  const [localTitle, setLocalTitle] = useState(formTitle);

  // Synchronize when opened
  React.useEffect(() => {
    if (isOpen) {
      setLocalFields(fields);
      setLocalTitle(formTitle);
    }
  }, [isOpen, fields, formTitle]);

  if (!isOpen) return null;

  const handleAddField = () => {
    const id = `field_${Date.now()}`;
    const newField: FormField = {
      id,
      name: `field_${localFields.length + 1}`,
      label: `Custom Field ${localFields.length + 1}`,
      type: 'text',
      placeholder: 'Enter text here...',
      required: false,
    };
    setLocalFields([...localFields, newField]);
  };

  const handleRemoveField = (id: string) => {
    setLocalFields(localFields.filter((f) => f.id !== id));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= localFields.length) return;
    const copy = [...localFields];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setLocalFields(copy);
  };

  const handleUpdateField = (id: string, updates: Partial<FormField>) => {
    setLocalFields(
      localFields.map((f) => {
        if (f.id !== id) return f;
        const updated = { ...f, ...updates };
        // If type changed to select and has no options
        if (updates.type === 'select' && (!updated.options || updated.options.length === 0)) {
          updated.options = ['Option 1', 'Option 2', 'Option 3'];
        }
        return updated;
      })
    );
  };

  const handleApply = () => {
    setFormTitle(localTitle);
    onSaveFields(localFields);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#EA4B71]/10 text-[#FF6D5A]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Customize Form Schema &amp; Fields</h2>
              <p className="text-xs text-slate-400">
                Tailor fields to match your exact n8n Form Trigger or Webhook payload keys
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Preset Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Load Preset Template
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {FORM_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setLocalFields(preset.fields);
                    setLocalTitle(preset.title);
                  }}
                  className="flex flex-col text-left p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 transition-colors"
                >
                  <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    {preset.title}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {preset.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Portal Form Heading
            </label>
            <input
              type="text"
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#EA4B71]"
              placeholder="e.g. Workflow Intake Request"
            />
          </div>

          {/* Fields List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Form Fields ({localFields.length})
              </label>
              <button
                type="button"
                onClick={handleAddField}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#EA4B71]/20 hover:bg-[#EA4B71]/30 text-[#FF6D5A] border border-[#EA4B71]/30 text-xs font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Field</span>
              </button>
            </div>

            <div className="space-y-3">
              {localFields.map((field, idx) => (
                <div
                  key={field.id}
                  className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-medium text-slate-400">
                      #{idx + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded text-slate-500 hover:text-slate-300 disabled:opacity-30"
                        title="Move Up"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 'down')}
                        disabled={idx === localFields.length - 1}
                        className="p-1 rounded text-slate-500 hover:text-slate-300 disabled:opacity-30"
                        title="Move Down"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveField(field.id)}
                        className="p-1 rounded text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 ml-1"
                        title="Delete Field"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Display Label
                      </label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#EA4B71]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        JSON Key Name in n8n
                      </label>
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) =>
                          handleUpdateField(field.id, {
                            name: e.target.value.replace(/\s+/g, '_').toLowerCase(),
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs font-mono text-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        placeholder="field_name"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Field Type
                      </label>
                      <select
                        value={field.type}
                        onChange={(e) =>
                          handleUpdateField(field.id, { type: e.target.value as FieldType })
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#EA4B71]"
                      >
                        {FIELD_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-900">
                    <div className="flex-1 min-w-[200px]">
                      {field.type !== 'checkbox' && (
                        <input
                          type="text"
                          value={field.placeholder || ''}
                          onChange={(e) =>
                            handleUpdateField(field.id, { placeholder: e.target.value })
                          }
                          placeholder="Placeholder text hint..."
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-600"
                        />
                      )}
                      {field.type === 'select' && (
                        <div className="mt-2">
                          <label className="block text-[10px] text-slate-400 mb-1">
                            Dropdown Options (comma separated):
                          </label>
                          <input
                            type="text"
                            value={(field.options || []).join(', ')}
                            onChange={(e) =>
                              handleUpdateField(field.id, {
                                options: e.target.value.split(',').map((s) => s.trim()),
                              })
                            }
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none"
                            placeholder="Option 1, Option 2, Option 3"
                          />
                        </div>
                      )}
                    </div>

                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={!!field.required}
                        onChange={(e) =>
                          handleUpdateField(field.id, { required: e.target.checked })
                        }
                        className="rounded border-slate-700 text-[#EA4B71] focus:ring-0 focus:ring-offset-0 bg-slate-900"
                      />
                      <span>Required Field</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/80">
          <button
            type="button"
            onClick={() => {
              setLocalFields(FORM_PRESETS[0].fields);
              setLocalTitle(FORM_PRESETS[0].title);
            }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#EA4B71] hover:bg-[#d43f63] text-white shadow-sm transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Apply Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
