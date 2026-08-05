import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { LabIcon } from "~/components/ui/icons/lab-icon";

interface LabFormValues {
  testType: string;
  priority: string;
  notes: string;
}

const initialValues: LabFormValues = {
  testType: "",
  priority: "",
  notes: "",
};

const validationSchema = Yup.object({
  testType: Yup.string(),
  priority: Yup.string(),
  notes: Yup.string(),
});

interface LabTabProps {
  onSubmitRequest: (values: LabFormValues) => void;
}

export function LabTab({ onSubmitRequest }: LabTabProps) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => onSubmitRequest(values)}
    >
      {({ values, handleChange, handleSubmit, isSubmitting }) => (
        <Form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-foreground text-sm font-medium">Lab Request</p>

          <div className="space-y-2">
            <Label htmlFor="testType">Test Type</Label>
            <Input
              id="testType"
              name="testType"
              value={values.testType}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Input
              id="priority"
              name="priority"
              value={values.priority}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              name="notes"
              value={values.notes}
              onChange={handleChange}
              placeholder="Additional clinical notes for the lab..."
              rows={3}
              className="border-input bg-input-background placeholder:text-muted-foreground focus:ring-ring/50 w-full resize-none rounded-lg border p-3 text-sm focus:ring-2 focus:outline-none"
            />
          </div>

          <Button
            type="submit"
            isLoading={isSubmitting}
            className="w-full gap-1.5 p-6"
          >
            <LabIcon className="size-3.5" />
            Submit Request
          </Button>
        </Form>
      )}
    </Formik>
  );
}
