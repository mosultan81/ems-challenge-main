import { redirect, useLoaderData } from "react-router";
import BackHomeBtn from "~/Components/BackHomeBtn";
import TimesheetForm from "~/Components/TimesSheetForm";
import { getDB } from "~/db/getDB";

export async function loader() {
  const db = await getDB();
  const employees = await db.all("SELECT id, full_name FROM employees");
  return { employees };
}

export async function action({ request }: { request: Request }) {
  const db = await getDB();
  const formData = await request.formData();

  const id = formData.get("id");
  const employee_id = formData.get("employee_id");
  const start_time = formData.get("start_time");
  const end_time = formData.get("end_time");
  const notes = formData.get("notes");

  if (!employee_id || !start_time || !end_time) {
    throw new Error("Missing required form fields");
  }

  if (id) {
    await db.run(
      `UPDATE timesheets SET employee_id = ?, start_time = ?, end_time = ?, notes = ? WHERE id = ?`,
      employee_id,
      start_time,
      end_time,
      notes,
      id
    );
  } else {
    await db.run(
      `INSERT INTO timesheets (employee_id, start_time, end_time, notes) VALUES (?, ?, ?, ?)`,
      employee_id,
      start_time,
      end_time,
      notes
    );
  }

  return redirect("/timesheets");
}

export default function NewTimesheetPage() {
  const { employees } = useLoaderData() as {
    employees: { id: number; full_name: string }[];
  };

  return (
    <div className="form-container">
      <TimesheetForm submitLabel="Create Timesheet" employees={employees} />
    </div>
  );
}
