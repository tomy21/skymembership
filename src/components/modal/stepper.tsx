"use client";

import { motion } from "framer-motion";

interface Step {
  id: number;
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      {/* Progress Bar Background */}
      <div className="absolute top-1/2 left-0 h-1 w-full -translate-y-1/2 rounded-full bg-gray-200" />

      {/* Animated Progress */}
      <motion.div
        className="absolute top-1/2 left-0 h-1 rounded-full bg-blue-500"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.4 }}
      />

      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step) => (
          <div key={step.id} className="flex w-20 flex-col items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300 ${
                currentStep === step.id
                  ? "border-blue-500 bg-blue-500 text-white"
                  : currentStep > step.id
                    ? "border-blue-500 bg-blue-500 text-white"
                    : "border-gray-300 bg-white text-gray-500"
              }`}
            >
              {currentStep > step.id ? "✓" : step.id}
            </div>
            <span
              className={`mt-2 text-xs font-medium ${
                currentStep >= step.id ? "text-blue-600" : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
