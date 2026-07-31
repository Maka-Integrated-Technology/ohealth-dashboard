import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";

interface FollowUpFormValues {
  followUpDate: string;
  consultationType: string;
  sendReminder: boolean;
}

const initialValues: FollowUpFormValues = {
  followUpDate: "",
  consultationType: "",
  sendReminder: true,
};

const validationSchema = Yup.object({
  followUpDate: Yup.string(),
  consultationType: Yup.string(),
  sendReminder: Yup.boolean(),
});

interface FollowUpTabProps {
  onSchedule: (values: FollowUpFormValues) => void;
}

export function FollowUpTab({ onSchedule }: FollowUpTabProps) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => onSchedule(values)}
    >
      {({ values, handleChange, setFieldValue, handleSubmit, isSubmitting }) => (
        <Form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm font-medium text-foreground">Schedule Follow-up</p>

          <div className="space-y-1">
            <Label htmlFor="followUpDate">Follow-up Date</Label>
            <Input
              id="followUpDate"
              name="followUpDate"
              type="date"
              value={values.followUpDate}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="consultationType">Consultation Type</Label>
            <Input
              id="consultationType"
              name="consultationType"
              value={values.consultationType}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="sendReminder">Send reminder to patient</Label>
            <Switch
              id="sendReminder"
              checked={values.sendReminder}
              onCheckedChange={(checked) => setFieldValue("sendReminder", checked)}
            />
          </div>

          <Button type="submit" isLoading={isSubmitting} className="w-full">
            Schedule Follow-up
          </Button>
        </Form>
      )}
    </Formik>
  );
}