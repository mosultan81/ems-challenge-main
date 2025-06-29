import EmployeeForm from "~/Components/EmployeeForm";
import BackHomeBtn from "~/Components/BackHomeBtn";
import { redirect, type ActionFunction } from "react-router";
import { getDB } from "~/db/getDB";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const db = await getDB();
  await db.run(
    `INSERT INTO employees 
    (full_name, email, phone, date_of_birth, job_position, department, salary, start_date, end_date) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      formData.get("full_name"),
      formData.get("email"),
      formData.get("phone"),
      formData.get("date_of_birth"),
      formData.get("job_position"),
      formData.get("department"),
      formData.get("salary"),
      formData.get("start_date"),
      formData.get("end_date"),
    ]
  );

  return redirect("/employees");
};

export default function NewEmployeePage() {
  return (
    <div className="new-employee-container">
      <h1>Create New Employee</h1>
      <EmployeeForm />
      <BackHomeBtn />
    </div>
  );
}
