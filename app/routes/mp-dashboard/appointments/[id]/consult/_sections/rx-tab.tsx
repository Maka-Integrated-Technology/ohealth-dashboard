import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { RxIcon } from "~/components/ui/icons/rx-icon";

interface RxFormValues {
  medicine: string;
  dosage: string;
  duration: string;
  instructions: string;
}

const initialValues: RxFormValues = {
  medicine: "",
  dosage: "",
  duration: "",
  instructions: "",
};

const validationSchema = Yup.object({
  medicine: Yup.string(),
  dosage: Yup.string(),
  duration: Yup.string(),
  instructions: Yup.string(),
});

interface RxTabProps {
  onAddPrescription: (values: RxFormValues) => void;
}

export function RxTab({ onAddPrescription }: RxTabProps) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => onAddPrescription(values)}
    >
      {({ values, handleChange, handleSubmit, isSubmitting }) => (
        <Form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-foreground text-sm font-medium">Prescription</p>

          <div className="space-y-2">
            <Label htmlFor="medicine">Medicine</Label>
            <Input
              id="medicine"
              name="medicine"
              value={values.medicine}
              onChange={handleChange}
              placeholder="e.g. Amlodipine 5mg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dosage">Dosage</Label>
            <Input
              id="dosage"
              name="dosage"
              value={values.dosage}
              onChange={handleChange}
              placeholder="e.g. Once daily"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              name="duration"
              value={values.duration}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions</Label>
            <textarea
              id="instructions"
              name="instructions"
              value={values.instructions}
              onChange={handleChange}
              placeholder="Take after meals, avoid alcohol..."
              rows={3}
              className="border-input bg-input-background placeholder:text-muted-foreground focus:ring-ring/50 w-full resize-none rounded-lg border p-3 text-sm focus:ring-2 focus:outline-none"
            />
          </div>

          <Button
            type="submit"
            isLoading={isSubmitting}
            className="w-full gap-1.5 p-6"
          >
            <RxIcon className="size-3.5" />
            Add Prescription
          </Button>
        </Form>
      )}
    </Formik>
  );
}
