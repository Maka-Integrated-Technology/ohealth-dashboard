import React from "react";
import { useFormik } from "formik";
import { OnboardingProgress } from "./onboarding-progress";
import { SpecializationSelect } from "~/components/onboarding/specialization-select";
import { ConsultationTypeSelect } from "./consultation-type-select";
import { stepTwoSchema } from "~/features/professional-onboarding/schemas.js";
import type {
  OnboardingFormValues,
  Specialization,
  ConsultationType,
} from "~/features/professional-onboarding/types";

interface StepTwoPracticeProps {
  initialValues: OnboardingFormValues;
  onContinue: (values: Partial<OnboardingFormValues>) => void;
}

export const StepTwoPractice: React.FC<StepTwoPracticeProps> = ({
  initialValues,
  onContinue,
}) => {
  const formik = useFormik({
    initialValues: {
      specialization: initialValues.specialization || "",
      licenseNumber: initialValues.licenseNumber || "",
      yearsOfExperience: initialValues.yearsOfExperience || "",
      consultationType: initialValues.consultationType || "",
      shortBio: initialValues.shortBio || "",
    },
    validationSchema: stepTwoSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values) => {
      onContinue({
        specialization: values.specialization as Specialization,
        licenseNumber: values.licenseNumber,
        yearsOfExperience: values.yearsOfExperience,
        consultationType: values.consultationType as ConsultationType,
        shortBio: values.shortBio,
      });
    },
  });

  const isFormValid =
    Boolean(formik.values.specialization) &&
    Boolean(formik.values.licenseNumber.trim()) &&
    Boolean(formik.values.yearsOfExperience.trim()) &&
    Boolean(formik.values.consultationType) &&
    Boolean(formik.values.shortBio.trim()) &&
    Object.keys(formik.errors).length === 0;

  return (
    <div
      className="animate-in fade-in-50 flex w-full flex-col items-center duration-200"
      id="step-2-practice-info"
    >
      <OnboardingProgress currentStep={2} />

      <div className="mb-6 text-center">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Tell Us About Your Practice
        </h1>
        <p className="mx-auto mt-1.5 max-w-sm text-xs text-slate-500 sm:text-sm">
          Help us build your professional profile so patients can learn more
          about you.
        </p>
      </div>

      <form
        onSubmit={formik.handleSubmit}
        className="w-full space-y-4 text-left"
        noValidate
      >
        {/* Specialization */}
        <SpecializationSelect
          id="specialization"
          label="Specialization"
          value={formik.values.specialization as Specialization}
          placeholder="Select specialization"
          onChange={(val) => {
            formik.setFieldValue("specialization", val);
          }}
          onBlur={() => formik.setFieldTouched("specialization", true)}
          error={
            formik.touched.specialization
              ? formik.errors.specialization
              : undefined
          }
        />

        {/* License Number & Years of Experience */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="licenseNumber"
              className="block text-sm font-medium text-slate-800"
              id="label-licenseNumber"
            >
              License Number
            </label>
            <input
              id="licenseNumber"
              name="licenseNumber"
              type="text"
              placeholder="Enter license number..."
              value={formik.values.licenseNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`h-12 w-full rounded-xl border bg-white px-4 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-none ${
                formik.touched.licenseNumber && formik.errors.licenseNumber
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-200 hover:border-slate-300 focus:border-blue-500"
              }`}
            />
            {formik.touched.licenseNumber && formik.errors.licenseNumber && (
              <p
                className="text-xs font-medium text-red-600"
                id="error-licenseNumber"
              >
                {formik.errors.licenseNumber}
              </p>
            )}
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="yearsOfExperience"
              className="block text-sm font-medium text-slate-800"
              id="label-yearsOfExperience"
            >
              Years of Experience
            </label>
            <input
              id="yearsOfExperience"
              name="yearsOfExperience"
              type="text"
              inputMode="numeric"
              placeholder="Enter years of experience..."
              value={formik.values.yearsOfExperience}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`h-12 w-full rounded-xl border bg-white px-4 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-none ${
                formik.touched.yearsOfExperience &&
                formik.errors.yearsOfExperience
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-200 hover:border-slate-300 focus:border-blue-500"
              }`}
            />
            {formik.touched.yearsOfExperience &&
              formik.errors.yearsOfExperience && (
                <p
                  className="text-xs font-medium text-red-600"
                  id="error-yearsOfExperience"
                >
                  {formik.errors.yearsOfExperience}
                </p>
              )}
          </div>
        </div>

        {/* Consultation Type */}
        <ConsultationTypeSelect
          id="consultationType"
          label="Consultation Type"
          value={formik.values.consultationType as ConsultationType}
          placeholder="Select consultation type.."
          onChange={(val) => {
            formik.setFieldValue("consultationType", val);
          }}
          onBlur={() => formik.setFieldTouched("consultationType", true)}
          error={
            formik.touched.consultationType
              ? formik.errors.consultationType
              : undefined
          }
        />

        {/* Short Bio */}
        <div className="flex flex-col space-y-1.5">
          <label
            htmlFor="shortBio"
            className="block text-sm font-medium text-slate-800"
            id="label-shortBio"
          >
            Short bio
          </label>
          <textarea
            id="shortBio"
            name="shortBio"
            rows={3}
            placeholder="Tell patients about your experience, areas of expertise..."
            value={formik.values.shortBio}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full resize-none rounded-xl border bg-white p-3.5 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-none ${
              formik.touched.shortBio && formik.errors.shortBio
                ? "border-red-400 focus:border-red-500"
                : "border-slate-200 hover:border-slate-300 focus:border-blue-500"
            }`}
          />
          {formik.touched.shortBio && formik.errors.shortBio && (
            <p className="text-xs font-medium text-red-600" id="error-shortBio">
              {formik.errors.shortBio}
            </p>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            id="btn-continue-step-2"
            disabled={!isFormValid}
            className={`h-12 w-full rounded-xl text-sm font-medium transition-all duration-150 focus:outline-none sm:text-base ${
              isFormValid
                ? "cursor-pointer bg-blue-600 text-white shadow-sm shadow-blue-500/10 hover:bg-blue-700 active:scale-[0.99]"
                : "cursor-not-allowed bg-slate-400 text-white opacity-80"
            }`}
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};
