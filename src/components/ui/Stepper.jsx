import React from "react";
import colors from "../../utils/constants/colors";

const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between relative">
        {/* Ligne de progression */}
        <div
          className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2"
          style={{ backgroundColor: colors.primaryVeryLight }}
        >
          <div
            className="h-full transition-all duration-500"
            style={{
              backgroundColor: colors.primary,
              width: currentStep === steps.length 
                ? '100%' 
                : `${((currentStep - 0.5) / steps.length) * 100}%`,
            }}
          />
        </div>

        {/* Étapes */}
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div
              key={index}
              className="flex flex-col items-center relative z-10"
              style={{ flex: 1 }}
            >
              {/* Cercle de l'étape */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                  isActive ? "scale-110" : ""
                }`}
                style={{
                  backgroundColor:
                    isActive || isCompleted ? colors.primary : colors.white,
                  color: isActive || isCompleted ? colors.white : colors.text,
                  border: `3px solid ${
                    isActive || isCompleted
                      ? colors.primary
                      : colors.primaryLight
                  }`,
                  boxShadow: isActive ? `0 0 20px ${colors.primary}` : "none",
                }}
              >
                {isCompleted ? "✓" : stepNumber}
              </div>

              {/* Nom de l'étape */}
              <div
                className="mt-3 text-sm font-medium text-center px-2"
                style={{
                  color: isActive ? colors.primary : colors.text,
                  fontWeight: isActive ? "bold" : "normal",
                }}
              >
                {step.title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
