import * as Yup from "yup";

/**
 * Step 1: Account Information Schema
 */
export const stepOneSchema = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
  email: Yup.string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email address is required"),
  phoneNumber: Yup.string()
    .trim()
    .matches(
      /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
      "Please enter a valid phone number"
    )
    .required("Phone number is required"),
  country: Yup.string().required("Please select your country of residence"),
});

/**
 * Step 2: Practice Information Schema
 */
export const stepTwoSchema = Yup.object().shape({
  specialization: Yup.string()
    .oneOf(
      ["General Doctor", "Nurse", "Nutritionist", "Counsellor"],
      "Please select a valid specialization"
    )
    .required("Specialization is required"),
  licenseNumber: Yup.string()
    .trim()
    .min(3, "License number must be at least 3 characters")
    .required("License number is required"),
  yearsOfExperience: Yup.string()
    .trim()
    .matches(/^[0-9]{1,2}$/, "Please enter a valid number of years (0-99)")
    .required("Years of experience is required"),
  consultationType: Yup.string()
    .oneOf(
      ["Chat Consultation", "Video Consultation", "Both"],
      "Please select a consultation type"
    )
    .required("Consultation type is required"),
  shortBio: Yup.string()
    .trim()
    .min(20, "Please provide a short bio of at least 20 characters")
    .max(500, "Bio cannot exceed 500 characters")
    .required("Short bio is required"),
});

/**
 * Step 3: Professional Identity Verification Schema
 */
export const stepThreeSchema = Yup.object().shape({
  professionalLicense: Yup.object()
    .nullable()
    .required("Professional license document is required")
    .test("file-size", "License document exceeds 10MB limit", (value) => {
      if (!value) return false;
      return (value as { size: number }).size <= 10 * 1024 * 1024;
    }),
  governmentId: Yup.object()
    .nullable()
    .required("Government-issued ID document is required")
    .test("file-size", "Government ID document exceeds 10MB limit", (value) => {
      if (!value) return false;
      return (value as { size: number }).size <= 10 * 1024 * 1024;
    }),
});

/**
 * Full Composite Onboarding Schema
 */
export const fullOnboardingSchema = Yup.object().shape({
  accountType: Yup.string()
    .oneOf(["healthcare_professional", "facility"])
    .required(),
  ...stepOneSchema.fields,
  ...stepTwoSchema.fields,
  ...stepThreeSchema.fields,
});
