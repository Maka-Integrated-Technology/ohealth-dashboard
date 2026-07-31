import { useParams } from "react-router";
import { Mic, Video, PhoneOff, Maximize2 } from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";
import { Empty } from "~/components/ui/empty";
import { useConsultationDetail } from "~/features/appointments/hooks";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs";
import { NotesTab } from "./_sections/notes-tab";
import { RxTab } from "./_sections/rx-tab";
import { LabTab } from "./_sections/lab-tab";
import { FollowUpTab } from "./_sections/follow-up-tab";

function formatDateTimeHeader(startsAt: string, endsAt: string) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  const dateLabel = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const fmtTime = (d: Date) =>
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  return `${dateLabel} · ${fmtTime(start)} - ${fmtTime(end)}`;
}

export default function ConsultPage() {
  const { id } = useParams();
  const { data: consultation, isLoading, isError } = useConsultationDetail(id);

  return (
    <div className="flex h-[calc(100vh-0px)]">
      {/* Left: patient snapshot */}
      <aside className="w-72 shrink-0 overflow-y-auto border-r border-border bg-card p-4">
        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        )}

        {isError && (
          <Empty>
            <p className="text-sm text-muted-foreground">
              Couldn&apos;t load patient details.
            </p>
          </Empty>
        )}

        {consultation && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                {consultation.patientInitials}
              </div>
              <div>
                <p className="font-bold text-foreground">
                  {consultation.patientName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {consultation.patientSex}, {consultation.patientAge} yrs
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Condition</p>
                <p className="font-medium text-foreground">
                  {consultation.condition}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Blood Type</p>
                <p className="font-medium text-foreground">
                  {consultation.bloodType}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Allergies</p>
                <p className="font-medium text-foreground">
                  {consultation.allergies}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Visit</p>
                <p className="font-medium text-foreground">
                  {consultation.lastVisit}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Consult Type</p>
                <p className="font-medium text-foreground">
                  {consultation.consultationType}
                </p>
              </div>
            </div>

            {consultation.previousConsultations.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">
                  Previous Consultations
                </p>
                <ul className="space-y-1">
                  {consultation.previousConsultations.map((c, i) => (
                    <li key={i} className="text-sm text-muted-foreground">
                      {c.label} — {c.date}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </aside>

      {/* Center: video feed + header */}
      <div className="flex flex-1 flex-col">
        <div className="border-b border-border p-4">
          {consultation ? (
            <>
              <h1 className="font-semibold text-foreground">
                {consultation.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {formatDateTimeHeader(consultation.startsAt, consultation.endsAt)}
              </p>
            </>
          ) : (
            <Skeleton className="h-5 w-48" />
          )}
        </div>

        <div className="relative flex-1 bg-muted">
          {/* video feed placeholder */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-background/90 px-4 py-2 shadow-lg">
            <button className="rounded-full bg-secondary p-3">
              <Mic className="size-5" />
            </button>
            <button className="rounded-full bg-secondary p-3">
              <Video className="size-5" />
            </button>
            <button className="rounded-full bg-destructive p-3 text-destructive-foreground">
              <PhoneOff className="size-5" />
            </button>
            <button className="rounded-full bg-secondary p-3">
              <Maximize2 className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Right: tabs panel */}
      <aside className="w-80 shrink-0 overflow-y-auto border-l border-border p-4">
        <Tabs defaultValue="notes">
          <TabsList className="w-full">
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="rx">Rx</TabsTrigger>
            <TabsTrigger value="lab">Lab</TabsTrigger>
            <TabsTrigger value="follow-up">Follow-up</TabsTrigger>
          </TabsList>

          <TabsContent value="notes">
            <NotesTab onSaveDraft={(values) => console.log("save draft", values)} />
          </TabsContent>
          <TabsContent value="rx">
            <RxTab onAddPrescription={(values) => console.log("add prescription", values)} />
          </TabsContent>
          <TabsContent value="lab">
            <LabTab onSubmitRequest={(values) => console.log("submit lab request", values)} />
          </TabsContent>
          <TabsContent value="follow-up">
            <FollowUpTab onSchedule={(values) => console.log("schedule follow-up", values)} />
          </TabsContent>
        </Tabs>
      </aside>
    </div>
  );
}