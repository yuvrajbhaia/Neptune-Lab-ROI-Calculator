"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";

interface LeadFormProps {
  onSubmit: (data: LeadFormData) => Promise<void>;
  isLoading: boolean;
}

export interface LeadFormData {
  name: string;
  position: string;
  company: string;
  phone: string;
  email: string;
}

export function LeadForm({ onSubmit, isLoading }: LeadFormProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    name: "",
    position: "",
    company: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState<Partial<LeadFormData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<LeadFormData> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.position.trim()) newErrors.position = "Position is required";
    if (!formData.company.trim()) newErrors.company = "Company name is required";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      await onSubmit(formData);
    }
  };

  const handleChange = (field: keyof LeadFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl border border-[#E5E7EB] p-6 md:p-8"
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">
          Get Your Detailed ROI Report
        </h3>
        <p className="text-sm text-[#6B7280]">
          Fill in your details to reveal the total and receive a comprehensive report
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            error={errors.name}
            disabled={isLoading}
          />
          <Input
            label="Position/Designation"
            placeholder="Production Manager"
            value={formData.position}
            onChange={(e) => handleChange("position", e.target.value)}
            error={errors.position}
            disabled={isLoading}
          />
        </div>

        <Input
          label="Company Name"
          placeholder="Your Company Ltd."
          value={formData.company}
          onChange={(e) => handleChange("company", e.target.value)}
          error={errors.company}
          disabled={isLoading}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            error={errors.phone}
            disabled={isLoading}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="john@company.com"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={errors.email}
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full mt-6"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Reveal Total & Get Report
            </>
          )}
        </Button>
      </form>

      <p className="text-xs text-[#9CA3AF] text-center mt-4">
        By submitting, you agree to receive communication from Neptune Plastics
      </p>
    </motion.div>
  );
}
