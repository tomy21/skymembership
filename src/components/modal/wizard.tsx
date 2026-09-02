/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Stepper from "./stepper";
import RolePermissionForm from "@/app/(admin)/admin/user-management/components/RolePermissionForms";
import { toast } from "sonner";

interface WizardProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  onSuccess?: () => void;
}

export default function Wizard({ open, setOpen, onSuccess }: WizardProps) {
  const [step, setStep] = useState(1);

  // State untuk form
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(false);

  const steps = [
    { id: 1, label: "Role" },
    { id: 2, label: "Permissions" },
    { id: 3, label: "Finish" },
  ];

  const handleNext = () => {
    if (step < steps.length) setStep(step + 1);
  };
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // Submit final
  const handleFinish = async () => {
    setLoading(true);
    try {
      // 1. Create role
      const roleRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_USERS}/v01/cms/api/auth/create-role`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ name: roleName }),
        },
      );
      const roleData = await roleRes.json();
      const roleId = roleData.data.id;

      // 2. Save permissions
      const payload = Object.values(permissions).map((p: any) => ({
        ...p,
        role_id: roleId,
      }));

      const permRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_USERS}/v01/cms/api/auth/add-role-permission-bulk`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ permissions: payload }),
        },
      );

      if (!permRes.ok) throw new Error("Failed to save permissions");
      toast.success("Role created successfully");
      if (onSuccess) onSuccess();

      setTimeout(() => {
        setOpen(false);
      }, 300);
      setOpen(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg">
        {/* Stepper */}
        <Stepper steps={steps} currentStep={step} />

        {/* Step Content */}
        <div className="mt-4 mb-6">
          {step === 1 && (
            <div>
              <h2 className="mb-4 text-lg font-bold">Role Name</h2>
              <input
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="Role Name"
                className="mb-3 w-full rounded-md bg-blue-50 p-2"
              />
            </div>
          )}
          {step === 2 && (
            <RolePermissionForm
              permissions={permissions}
              setPermissions={setPermissions}
            />
          )}
          {step === 3 && (
            <div>
              <h2 className="mb-4 text-lg font-bold">Review</h2>
              <p className="text-gray-600">Check your data before saving.</p>
              <div className="mt-3 rounded bg-gray-100 p-3 text-sm">
                <p>
                  <strong>Role Name:</strong> {roleName}
                </p>
                <p>
                  <strong>Total Permissions:</strong> {permissions.length}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1 || loading}
            className="rounded-lg border px-4 py-2 text-gray-500 disabled:opacity-50"
          >
            Back
          </button>
          {step < steps.length ? (
            <button
              onClick={handleNext}
              disabled={loading || (step === 1 && !roleName)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={loading}
              className="rounded-lg bg-green-600 px-4 py-2 text-white"
            >
              {loading ? "Saving..." : "Finish"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
