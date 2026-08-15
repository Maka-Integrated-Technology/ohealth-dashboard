import { useParams } from "react-router";
import { Skeleton } from "~/components/ui/skeleton";
import { Empty } from "~/components/ui/empty";
import {
  usePatientDetail,
  usePatientConsultations,
  usePatientNotes,
} from "~/features/patients/hooks";
import { PatientHeader } from "./_sections/patient-header";
import { PersonalInfoCard } from "./_sections/personal-info-card";
import { MedicalInfoCard } from "./_sections/medical-info-card";
import { ConsultationHistoryCard } from "./_sections/consultation-history-card";
import { NotesCard } from "./_sections/notes-card";

export default function PatientDetailPage() {
  const { id } = useParams();
  const { data: patient, isLoading, isError } = usePatientDetail(id);
  const { data: consultations = [] } = usePatientConsultations(id);
  const { data: notes = [] } = usePatientNotes(id);

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !patient) {
    return (
      <div className="p-6">
        <Empty>
          <p className="text-muted-foreground text-sm">
            Couldn&apos;t load this patient&apos;s record.
          </p>
        </Empty>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PatientHeader patient={patient} />

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PersonalInfoCard patient={patient} />
        <MedicalInfoCard patient={patient} />
        <ConsultationHistoryCard
          patientId={patient.id}
          consultations={consultations}
        />
        <NotesCard patientId={patient.id} notes={notes} />
      </div>
    </div>
  );
}