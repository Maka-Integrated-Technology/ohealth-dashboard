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
import { OHealthMark } from "~/components/ui/icons/ohealth-mark";

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

  return (
    <div className="flex h-[calc(100vh-0px)] p-3">
      {/* Left: patient snapshot */}
      <aside className="w-72 shrink-0 overflow-y-auto border-r border-border bg-card">
        <div className="flex items-center gap-1.5 border-b border-border p-4">
          <OHealthMark />
          <span className="font-semibold text-foreground">OHealth</span>
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
              <p className="text-sm text-muted-foreground">
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
        </div>
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

        <div className="relative flex-1 overflow-hidden bg-muted">
          {/* video feed placeholder goes here */}

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-3 bg-black/10 px-4 py-4 backdrop-blur-sm">
            <button className="flex size-11 items-center justify-center rounded-full bg-slate-700 text-white hover:bg-slate-600">
              <Mic className="size-5" />
            </button>
            <button className="flex size-11 items-center justify-center rounded-full bg-slate-700 text-white hover:bg-slate-600">
              <Video className="size-5" />
            </button>
            <button className="flex h-11 items-center gap-2 rounded-full bg-destructive px-4 text-white hover:bg-destructive/90">
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
      <aside className="w-80 shrink-0 overflow-y-auto border-l border-border">
        <Tabs defaultValue="notes">
          <div className="border-b border-border p-4">
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
              <NotesTab
                onSaveDraft={(values) => console.log("save draft", values)}
              />
            </TabsContent>
            <TabsContent value="rx">
              <RxTab
                onAddPrescription={(values) =>
                  console.log("add prescription", values)
                }
              />
            </TabsContent>
            <TabsContent value="lab">
              <LabTab
                onSubmitRequest={(values) =>
                  console.log("submit lab request", values)
                }
              />
            </TabsContent>
            <TabsContent value="follow-up">
              <FollowUpTab
                onSchedule={(values) =>
                  console.log("schedule follow-up", values)
                }
              />
            </TabsContent>
          </div>
        </Tabs>
      </aside>
    </div>
  );
}