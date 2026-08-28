import React from "react";
import { useFormik } from "formik";
import { OnboardingProgress } from "./onboarding-progress";
import { CountrySelect } from "./country-select";
import { stepOneSchema } from "~/features/professional-onboarding/schemas";
import type { OnboardingFormValues } from "~/features/professional-onboarding/types";

interface StepOneAccountProps {
  initialValues: OnboardingFormValues;
  onContinue: (values: Partial<OnboardingFormValues>) => void;
}

export const StepOneAccount: React.FC<StepOneAccountProps> = ({
  initialValues,
  onContinue,
}) => {
  const formik = useFormik({
    initialValues: {
      firstName: initialValues.firstName || "",
      lastName: initialValues.lastName || "",
      email: initialValues.email || "",
      phoneNumber: initialValues.phoneNumber || "",
      country: initialValues.country || "",
    },
    validationSchema: stepOneSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values) => {
      onContinue(values);
    },
  });

  return (
    <div
      className="animate-in fade-in-50 flex w-full flex-col items-center duration-200"
      id="step-1-account-info"
    >
      <OnboardingProgress currentStep={1} />

      <div className="mb-6 text-center">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Set up your account
        </h1>
        <p className="mt-1.5 text-xs text-slate-500 sm:text-sm">
          Set up your account to begin your verification process.
        </p>
      </div>

      <form
        onSubmit={formik.handleSubmit}
        className="w-full space-y-4 text-left"
        noValidate
      >
        {/* First & Last Name */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-slate-800"
              id="label-firstName"
            >
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Enter your first name..."
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`h-12 w-full rounded-xl border bg-white px-4 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-none ${
                formik.touched.firstName && formik.errors.firstName
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-200 hover:border-slate-300 focus:border-blue-500"
              }`}
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <p
                className="text-xs font-medium text-red-600"
                id="error-firstName"
              >
                {formik.errors.firstName}
              </p>
            )}
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-slate-800"
              id="label-lastName"
            >
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Enter your last name..."
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`h-12 w-full rounded-xl border bg-white px-4 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-none ${
                formik.touched.lastName && formik.errors.lastName
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-200 hover:border-slate-300 focus:border-blue-500"
              }`}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <p
                className="text-xs font-medium text-red-600"
                id="error-lastName"
              >
                {formik.errors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col space-y-1.5">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-800"
            id="label-email"
          >
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email..."
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`h-12 w-full rounded-xl border bg-white px-4 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-none ${
              formik.touched.email && formik.errors.email
                ? "border-red-400 focus:border-red-500"
                : "border-slate-200 hover:border-slate-300 focus:border-blue-500"
            }`}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-xs font-medium text-red-600" id="error-email">
              {formik.errors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="flex flex-col space-y-1.5">
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-slate-800"
            id="label-phoneNumber"
          >
            Phone Number
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            placeholder="Enter your phone number..."
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`h-12 w-full rounded-xl border bg-white px-4 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-none ${
              formik.touched.phoneNumber && formik.errors.phoneNumber
                ? "border-red-400 focus:border-red-500"
                : "border-slate-200 hover:border-slate-300 focus:border-blue-500"
            }`}
          />
          {formik.touched.phoneNumber && formik.errors.phoneNumber && (
            <p
              className="text-xs font-medium text-red-600"
              id="error-phoneNumber"
            >
              {formik.errors.phoneNumber}
            </p>
          )}
        </div>

        {/* Country */}
        <CountrySelect
          id="country"
          label="Country of Residence"
          placeholder="Select Country"
          value={formik.values.country}
          onChange={(val) => {
            formik.setFieldValue("country", val);
          }}
          onBlur={() => formik.setFieldTouched("country", true)}
          error={formik.touched.country ? formik.errors.country : undefined}
        />

        <div className="pt-2">
          <button
            type="submit"
            id="btn-continue-step-1"
            className="h-12 w-full rounded-xl bg-blue-600 text-sm font-medium text-white shadow-sm shadow-blue-500/10 transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/30 focus:outline-none active:scale-[0.99] sm:text-base"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};
