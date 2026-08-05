import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { NotesIcon } from "~/components/ui/icons/notes-icon";

interface NotesFormValues {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

const initialValues: NotesFormValues = {
  subjective: "",
  objective: "",
  assessment: "",
  plan: "",
};

const validationSchema = Yup.object({
  subjective: Yup.string(),
  objective: Yup.string(),
  assessment: Yup.string(),
  plan: Yup.string(),
});

interface NotesTabProps {
  onSaveDraft: (values: NotesFormValues) => void;
}

const FIELDS: {
  name: keyof NotesFormValues;
  label: string;
  placeholder: string;
}[] = [
  {
    name: "subjective",
    label: "S",
    placeholder: "Subjective — Patient complaints",
  },
  {
    name: "objective",
    label: "O",
    placeholder: "Objective — Examination findings",
  },
  { name: "assessment", label: "A", placeholder: "Assessment — Diagnosis" },
  { name: "plan", label: "P", placeholder: "Plan — Treatment steps" },
];

export function NotesTab({ onSaveDraft }: NotesTabProps) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => onSaveDraft(values)}
    >
      {({ values, handleChange, handleSubmit, isSubmitting }) => (
        <Form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-foreground text-sm font-medium">SOAP Notes</p>

          {FIELDS.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label
                htmlFor={field.name}
                className="text-primary text-xs font-semibold"
              >
                {field.label}
              </Label>
              <textarea
                id={field.name}
                name={field.name}
                value={values[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                rows={3}
                className="border-input bg-input-background placeholder:text-muted-foreground focus:ring-ring/50 w-full resize-none rounded-lg border p-3 text-sm focus:ring-2 focus:outline-none"
              />
            </div>
          ))}

          <Button
            type="submit"
            isLoading={isSubmitting}
            className="w-full gap-1.5 p-6"
          >
            <NotesIcon className="size-3.5" />
            Save Draft
          </Button>
        </Form>
      )}
    </Formik>
  );
}
