import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  const steps = [
    { number: 1, label: 'Identitas' },
    { number: 2, label: 'Identifikasi' },
    { number: 3, label: 'Desain' },
    { number: 4, label: 'Prinsip' },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                  transition-all duration-300
                  ${
                    currentStep > step.number
                      ? 'bg-primary text-primary-foreground'
                      : currentStep === step.number
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                      : 'bg-muted text-muted-foreground'
                  }
                `}
              >
                {currentStep > step.number ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`
                  text-xs mt-2 font-medium
                  ${currentStep >= step.number ? 'text-primary' : 'text-muted-foreground'}
                `}
              >
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-2 mt-[-24px]">
                <div
                  className={`
                    h-full rounded-full transition-all duration-300
                    ${currentStep > step.number ? 'bg-primary' : 'bg-muted'}
                  `}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress Text */}
      <div className="text-center mt-4">
        <p className="text-sm text-muted-foreground">
          Langkah {currentStep} dari {totalSteps}
        </p>
      </div>
    </div>
  );
};

export default StepIndicator;
