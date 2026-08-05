import { useNavigate, useParams } from "react-router";
import { Mic, Video, PhoneOff, Maximize2 } from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";
import { Empty } from "~/components/ui/empty";
import {
  useConsultationDetail,
  useCompleteAppointment,
} from "~/features/appointments/hooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { NotesTab } from "./_sections/notes-tab";
import { RxTab } from "./_sections/rx-tab";
import { LabTab } from "./_sections/lab-tab";
import { FollowUpTab } from "./_sections/follow-up-tab";
import { OHealthMark } from "~/components/ui/icons/ohealth-mark";
import { EndConsultationDialog } from "./_sections/end-consultation";
import { useState } from "react";

const TAB_TRIGGER_CLASSES =
  "flex-1 rounded-none border-x-0 border-t-0 border-b-2 border-transparent bg-transparent px-1 pb-3 text-sm font-medium text-muted-foreground shadow-none ring-0 data-[state=active]:border-x-0 data-[state=active]:border-t-0 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:ring-0";

function formatDateTimeHeader(startsAt: string, endsAt: string) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  const dateLabel = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const fmtTime = (d: Date) =>
    d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  return `${dateLabel} · ${fmtTime(start)} - ${fmtTime(end)}`;
}

export default function ConsultPage() {
  const { id } = useParams();
  const { data: consultation, isLoading, isError } = useConsultationDetail(id);

  const navigate = useNavigate();
  const [isEndDialogOpen, setIsEndDialogOpen] = useState(false);

  const { mutateAsync: completeAppointment, isPending: isEnding } =
    useCompleteAppointment();

  async function handleMarkCompleted() {
    if (id) {
      await completeAppointment(id);
    }
    setIsEndDialogOpen(false);
    navigate("/appointments");
  }

  return (
    <div className="flex h-[calc(100vh-0px)] p-3">
      {/* Left: patient snapshot */}
      <aside className="border-border bg-card w-72 shrink-0 overflow-y-auto border-r">
        <div className="border-border flex h-20 items-center gap-1.5 border-b p-4">
          <OHealthMark />
          <span className="text-foreground font-semibold">OHealth</span>
        </div>

        <div className="p-4">
          {isLoading && (
            <div className="space-y-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          )}

          {isError && (
            <Empty>
              <p className="text-muted-foreground text-sm">
                Couldn&apos;t load patient details.
              </p>
            </Empty>
          )}

          {consultation && (
            <div className="space-y-4">
              <div className="-mx-4 -mt-4 flex items-center gap-3 bg-blue-50 p-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                  {consultation.patientInitials}
                </div>
                <div>
                  <p className="text-foreground font-bold">
                    {consultation.patientName}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {consultation.patientSex}, {consultation.patientAge} yrs
                  </p>
                </div>
              </div>

              <div className="space-y-10 text-sm">
                <div>
                  <p className="text-muted-foreground">Condition</p>
                  <p className="text-foreground font-medium">
                    {consultation.condition}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Blood Type</p>
                  <p className="text-foreground font-medium">
                    {consultation.bloodType}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Allergies</p>
                  <p className="text-foreground font-medium">
                    {consultation.allergies}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Visit</p>
                  <p className="text-foreground font-medium">
                    {consultation.lastVisit}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Consult Type</p>
                  <p className="text-foreground font-medium">
                    {consultation.consultationType}
                  </p>
                </div>

                {consultation.previousConsultations.length > 0 && (
                  <div>
                    <p className="text-foreground mb-2 text-sm font-medium">
                      Previous Consultations
                    </p>
                    <ul className="space-y-1">
                      {consultation.previousConsultations.map((c, i) => (
                        <li key={i} className="text-muted-foreground text-sm">
                          {c.label} – {c.date}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Center: video feed + header */}
      <div className="flex flex-1 flex-col">
        <div className="border-border flex h-20 flex-col justify-center border-b p-4">
          {consultation ? (
            <>
              <h1 className="text-foreground truncate font-semibold">
                {consultation.title}
              </h1>
              <p className="text-muted-foreground truncate text-sm">
                {formatDateTimeHeader(
                  consultation.startsAt,
                  consultation.endsAt
                )}
              </p>
            </>
          ) : (
            <Skeleton className="h-5 w-48" />
          )}
        </div>

        <div className="bg-muted relative flex-1 overflow-hidden">
          {/* video feed placeholder goes here */}

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-3 bg-black/10 px-4 py-4 backdrop-blur-sm">
            <button className="flex size-11 items-center justify-center rounded-full bg-slate-700 text-white hover:bg-slate-600">
              <Mic className="size-5" />
            </button>
            <button className="flex size-11 items-center justify-center rounded-full bg-slate-700 text-white hover:bg-slate-600">
              <Video className="size-5" />
            </button>
            <button
              onClick={() => setIsEndDialogOpen(true)}
              className="bg-destructive hover:bg-destructive/90 flex h-11 items-center gap-2 rounded-full px-4 text-white"
            >
              <PhoneOff className="size-5" />
              <span className="text-sm font-medium">End</span>
            </button>
            <button className="flex size-11 items-center justify-center rounded-full bg-slate-700 text-white hover:bg-slate-600">
              <Maximize2 className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Right: tabs panel */}
      <aside className="border-border w-80 shrink-0 overflow-y-auto border-l">
        <Tabs defaultValue="notes">
          <div className="border-border flex h-20 items-center border-b p-4">
            <TabsList className="w-full justify-between gap-0 rounded-none bg-transparent p-0">
              <TabsTrigger value="notes" className={TAB_TRIGGER_CLASSES}>
                Notes
              </TabsTrigger>
              <TabsTrigger value="rx" className={TAB_TRIGGER_CLASSES}>
                Rx
              </TabsTrigger>
              <TabsTrigger value="lab" className={TAB_TRIGGER_CLASSES}>
                Lab
              </TabsTrigger>
              <TabsTrigger value="follow-up" className={TAB_TRIGGER_CLASSES}>
                Follow-up
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-4">
            <TabsContent value="notes">
              <NotesTab onSaveDraft={() => undefined} />
            </TabsContent>
            <TabsContent value="rx">
              <RxTab onAddPrescription={() => undefined} />
            </TabsContent>
            <TabsContent value="lab">
              <LabTab onSubmitRequest={() => undefined} />
            </TabsContent>
            <TabsContent value="follow-up">
              <FollowUpTab onSchedule={() => undefined} />
            </TabsContent>
          </div>
        </Tabs>
      </aside>
      <EndConsultationDialog
        open={isEndDialogOpen}
        onOpenChange={setIsEndDialogOpen}
        onMarkCompleted={handleMarkCompleted}
        isSubmitting={isEnding}
      />
    </div>
  );
}
