import axiosInstance from "~/lib/config/axios";
import { unwrapApiData, type ApiEnvelope } from "~/lib/utils/api-response";
import type {
  ConsultationType,
  OnboardingFormValues,
  Specialization,
  SubmissionResponse,
  UploadedDocument,
} from "./types.js";

interface ISpeciality {
  id: string;
  name: string;
}

interface IProfessionalProfile {
  id: string;
}

const CONSULTATION_TYPE_TO_SERVER: Record<ConsultationType, string> = {
  "Chat Consultation": "chat",
  "Video Consultation": "video",
  Both: "both",
};

async function findSpecialityId(name: Specialization): Promise<string> {
  const { data } =
    await axiosInstance.get<ApiEnvelope<ISpeciality[]>>("/api/specialities");
  const specialities = unwrapApiData(data);
  const normalizedName = name.trim().toLocaleLowerCase();
  const match = specialities.find(
    (speciality) =>
      speciality.name.trim().toLocaleLowerCase() === normalizedName
  );
  if (!match) {
    throw new Error(`Unrecognized specialization: ${name}`);
  }
  return match.id;
}

async function uploadVerificationDocument(
  documentType: "professional_license" | "government_id",
  document: UploadedDocument
): Promise<void> {
  if (!document.file) {
    // A document restored from sessionStorage across a reload has no File
    // object (see hooks.ts) — nothing new to upload in that case.
    return;
  }

  const formData = new FormData();
  formData.append("file", document.file, document.name);

  await axiosInstance.post(
    `/api/professionals/me/verification-documents/${documentType}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
}

export interface SubmitOnboardingParams {
  values: OnboardingFormValues;
}

export async function submitProfessionalOnboarding(
  params: SubmitOnboardingParams
): Promise<SubmissionResponse> {
  const { values } = params;

  if (
    !values.firstName ||
    !values.licenseNumber ||
    !values.professionalLicense ||
    !values.governmentId
  ) {
    throw new Error(
      "Incomplete onboarding payload. Please fill in all required fields."
    );
  }

  await axiosInstance.patch("/api/auth/me", {
    first_name: values.firstName,
    last_name: values.lastName,
    phone: values.phoneNumber,
    country: values.country,
  });

  const specialityId = await findSpecialityId(
    values.specialization as Specialization
  );

  const { data: profileEnvelope } = await axiosInstance.put<
    ApiEnvelope<{ profile: IProfessionalProfile }>
  >("/api/professionals/me/profile", {
    speciality_id: specialityId,
    license_number: values.licenseNumber,
    years_of_experience: Number(values.yearsOfExperience),
    consultation_type:
      CONSULTATION_TYPE_TO_SERVER[values.consultationType as ConsultationType],
    about: values.shortBio,
  });
  const professionalId = unwrapApiData(profileEnvelope).profile.id;

  await uploadVerificationDocument(
    "professional_license",
    values.professionalLicense
  );
  await uploadVerificationDocument("government_id", values.governmentId);

  return {
    success: true,
    applicationId: professionalId,
    submittedAt: new Date().toISOString(),
    message:
      "Your documents have been submitted successfully. Our team is reviewing your information and will notify you once your account has been approved.",
  };
}
