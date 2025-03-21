import React from 'react';
import { PenLine, Type, Calendar, CheckSquare, Edit } from 'lucide-react';
import { DocumentField } from '../types';

interface SigningFieldProps {
  field: DocumentField;
  onChange: (fieldId: string, value: string) => void;
}

const fieldIcons = {
  signature: PenLine,
  text: Type,
  date: Calendar,
  checkbox: CheckSquare,
  initial: Edit,
};

export const SigningField: React.FC<SigningFieldProps> = ({ field, onChange }) => {
  const Icon = fieldIcons[field.type];

  const renderInput = () => {
    switch (field.type) {
      case 'signature':
      case 'initial':
        return (
          <button
            className="w-full h-full min-h-[40px] border-2 border-dashed border-blue-500 rounded flex items-center justify-center text-blue-600 hover:bg-blue-50"
            onClick={() => onChange(field.id, 'Signed')}
          >
            <Icon className="w-5 h-5 mr-2" />
            Click to {field.type}
          </button>
        );
      case 'date':
        return (
          <input
            type="date"
            onChange={(e) => onChange(field.id, e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );
      case 'checkbox':
        return (
          <input
            type="checkbox"
            onChange={(e) => onChange(field.id, e.target.checked ? 'true' : 'false')}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
        );
      default:
        return (
          <input
            type="text"
            onChange={(e) => onChange(field.id, e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={`Enter ${field.type}`}
          />
        );
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: field.position.x,
        top: field.position.y,
        width: field.size.width,
        height: field.size.height,
      }}
      className="bg-white shadow-sm"
    >
      {renderInput()}
      {field.required && (
        <span className="absolute -top-2 -right-2 text-red-500">*</span>
      )}
    </div>
  );
};