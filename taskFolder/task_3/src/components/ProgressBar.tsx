import React from 'react';
import { Check } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const steps = [
  { path: '/upload', label: 'Upload' },
  { path: '/recipients', label: 'Recipients' },
  { path: '/editor', label: 'Editor' },
  { path: '/summary', label: 'Summary' },
];

export const ProgressBar: React.FC = () => {
  const location = useLocation();
  const currentStepIndex = steps.findIndex((step) => step.path === location.pathname);

  return (
    //FIX ME: I added the z-10 class to the w-8 h-8 div to make sure the checkmark is visible
    //FIX ME: I added the z-0 class to the text-sm div to make sure the text is behind the checkmark
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div
            key={step.path}
            className="flex flex-col items-center relative flex-1"
          >
            <div
              className={`w-8 h-8 z-10 rounded-full flex items-center justify-center ${
                index <= currentStepIndex
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index < currentStepIndex ? (
                <Check className="w-5 h-5" />
              ) : (
                index + 1
              )}
            </div>
            <div className="text-sm mt-2 z-0">{step.label}</div>
            {index < steps.length - 1 && (
              <div
                className={`absolute top-4 -right-1/2 h-0.5 w-full ${
                  index < currentStepIndex ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};