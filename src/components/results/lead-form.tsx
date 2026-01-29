"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Check } from "lucide-react";

// Quotation options
const QUOTATION_OPTIONS = [
  "25mm Raffia Tape Lab Extrusion line (INR)",
  "25mm Blown film Lab Extrusion Line (INR)",
] as const;

// Country code mapping
const COUNTRIES = [
  { name: "India", code: "+91" },
  { name: "United States", code: "+1" },
  { name: "Canada", code: "+1" },
  { name: "United Kingdom", code: "+44" },
  { name: "UAE", code: "+971" },
  { name: "Singapore", code: "+65" },
  { name: "Australia", code: "+61" },
  { name: "Germany", code: "+49" },
  { name: "France", code: "+33" },
  { name: "China", code: "+86" },
  { name: "Japan", code: "+81" },
  { name: "South Korea", code: "+82" },
  { name: "Brazil", code: "+55" },
  { name: "Mexico", code: "+52" },
  { name: "Italy", code: "+39" },
];

interface LeadFormProps {
  onSubmit: (data: LeadFormData) => Promise<void>;
  isLoading: boolean;
}

export interface LeadFormData {
  name: string;
  position: string;
  company: string;
  quotationTypes: string[];
  country: string;
  countryCode: string;
  phone: string;
  email: string;
}

export function LeadForm({ onSubmit, isLoading }: LeadFormProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    name: "",
    position: "",
    company: "",
    quotationTypes: [],
    country: "India",
    countryCode: "+91",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = e.target.value;
    const country = COUNTRIES.find(c => c.name === selectedCountry);

    setFormData(prev => ({
      ...prev,
      country: selectedCountry,
      countryCode: country?.code || ""
    }));

    // Clear country error if exists
    if (errors.country) {
      setErrors(prev => ({ ...prev, country: undefined }));
    }
  };

  const handleQuotationToggle = (quotationType: string) => {
    setFormData((prev) => {
      const currentTypes = prev.quotationTypes;
      const newTypes = currentTypes.includes(quotationType)
        ? currentTypes.filter(t => t !== quotationType)
        : [...currentTypes, quotationType];

      return { ...prev, quotationTypes: newTypes };
    });

    // Clear error if at least one is now selected
    if (errors.quotationTypes) {
      setErrors(prev => ({ ...prev, quotationTypes: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof LeadFormData, string>> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.position.trim()) newErrors.position = "Position is required";
    if (!formData.company.trim()) newErrors.company = "Company name is required";
    if (formData.quotationTypes.length === 0) {
      newErrors.quotationTypes = "Please select at least one quotation type";
    }
    if (!formData.country.trim()) newErrors.country = "Country is required";
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
          Download Detailed Report & Quotation
        </h3>
        <p className="text-sm text-[#6B7280]">
          Get a comprehensive breakdown and pricing for the 25mm Lab Raffia Tape Line
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

        {/* Quotation Type Multi-Select */}
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
            Quotation Type <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            {QUOTATION_OPTIONS.map((option) => (
              <label
                key={option}
                className="flex items-start gap-3 cursor-pointer group"
              >
                {/* Custom Checkbox */}
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all mt-0.5 ${
                    formData.quotationTypes.includes(option)
                      ? "border-[#E07A5F] bg-[#E07A5F]"
                      : "border-[#D1D5DB] bg-white group-hover:border-[#E07A5F]/50"
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => !isLoading && handleQuotationToggle(option)}
                >
                  {formData.quotationTypes.includes(option) && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Label Text */}
                <div className="flex-1">
                  <span className="text-base text-[#1A1A1A]">
                    {option}
                  </span>
                </div>
              </label>
            ))}
          </div>
          {errors.quotationTypes && (
            <p className="text-red-500 text-sm mt-2">{errors.quotationTypes}</p>
          )}
        </div>

        {/* Country Selector and Country Code Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Country Dropdown */}
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-[#1A1A1A] mb-2">
              Country
            </label>
            <select
              id="country"
              value={formData.country}
              onChange={handleCountryChange}
              disabled={isLoading}
              className={`w-full h-14 px-4 text-base font-semibold text-[#1A1A1A] bg-white border-2 rounded-xl
                focus:outline-none focus:ring-2 focus:ring-[#E07A5F] focus:border-[#E07A5F]
                transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                ${errors.country ? 'border-red-500' : 'border-[#E5E7EB]'}`}
            >
              {COUNTRIES.map((country) => (
                <option key={`${country.name}-${country.code}`} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="text-red-500 text-sm mt-1">{errors.country}</p>
            )}
          </div>

          {/* Country Code Display (Read-only) */}
          <div>
            <label htmlFor="countryCode" className="block text-sm font-medium text-[#1A1A1A] mb-2">
              Country Code
            </label>
            <div className="w-full h-14 px-4 flex items-center text-base font-semibold text-[#1A1A1A] bg-gray-50 border-2 border-[#E5E7EB] rounded-xl">
              {formData.countryCode}
            </div>
          </div>
        </div>

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
              Generating Report...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Download Report & Quotation
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
