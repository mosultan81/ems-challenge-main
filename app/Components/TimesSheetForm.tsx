import { Form, useSubmit } from "react-router";
import { useRef, useState } from "react";

type TimesheetFormProps = {
  defaultValues?: {
    id?: number;
    employee_id?: number;
    start_time?: string;
    end_time?: string;
    notes?: string;
  };
  employees: { id: number; full_name: string }[];
  submitLabel?: string;
};

export default function TimesheetForm({
  defaultValues = {},
  submitLabel = "Save Timesheet",
  employees = [],
}: TimesheetFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const start = new Date((form.start_time as any).value);
    const end = new Date((form.end_time as any).value);

    if (end <= start) {
      setError("End Time must be after Start Time.");
      return;
    }

    setError("");
    form.submit(); 
  };

  return (
    <div className="form-card">
      <h2 className="form-title">Timesheet</h2>

      {error && <div className="error-message">{error}</div>}

      <Form
        method="post"
        ref={formRef}
        onSubmit={handleSubmit}
        className="timesheet-form"
      >
        {defaultValues?.id && (
          <input type="hidden" name="id" value={defaultValues.id} />
        )}

        <div className="form-group">
          <label htmlFor="employee_id">Employee</label>
          <select
            id="employee_id"
            name="employee_id"
            defaultValue={defaultValues.employee_id || ""}
            required
          >
            <option value="" disabled>
              -- Select an Employee --
            </option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.full_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="start_time">Start Time</label>
          <input
            type="datetime-local"
            id="start_time"
            name="start_time"
            defaultValue={defaultValues.start_time || ""}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="end_time">End Time</label>
          <input
            type="datetime-local"
            id="end_time"
            name="end_time"
            defaultValue={defaultValues.end_time || ""}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            defaultValue={defaultValues.notes || ""}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn primary-btn">
            {submitLabel}
          </button>
          <a href="/timesheets" className="btn" style={{ marginLeft: "1rem" }}>
            Back to Timesheets
          </a>
        </div>
      </Form>
    </div>
  );
}
