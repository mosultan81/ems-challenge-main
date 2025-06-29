import {
  useLoaderData,
  redirect,
  type ActionFunction,
  type LoaderFunction,
} from "react-router";
import path from "path";
import fs from "fs/promises";
import { getDB } from "~/db/getDB";
import EmployeeForm from "~/Components/EmployeeForm";
import BackHomeBtn from "~/Components/BackHomeBtn";

type Employee = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  job_position: string;
  department: string;
  salary: string;
  start_date: string;
  end_date: string;
  photo?: string;
  document_cv?: string;
  document_id?: string;
};

export const loader: LoaderFunction = async ({ params }) => {
  const db = await getDB();
  const employee = await db.get("SELECT * FROM employees WHERE id = ?", [
    params.employeeId,
  ]);

  if (!employee) {
    throw new Response("Not Found", { status: 404 });
  }

  return employee;
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const db = await getDB();

  const saveFile = async (
    fieldName: string,
    folder: string
  ): Promise<string | null> => {
    const file = formData.get(fieldName) as File;
    if (!file || file.size === 0) return null;

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(
      process.cwd(),
      "public",
      "uploads",
      folder,
      fileName
    );

    await fs.mkdir(path.dirname(filePath), { recursive: true });

    await fs.writeFile(filePath, buffer);

    return `/uploads/${folder}/${fileName}`;
  };

  const photoPath = await saveFile("photo", "photos");
  const cvPath = await saveFile("document_cv", "docs");
  const idPath = await saveFile("document_id", "docs");

  await db.run(
    `UPDATE employees SET 
      full_name = ?, email = ?, phone = ?, date_of_birth = ?, 
      job_position = ?, department = ?, salary = ?, start_date = ?, end_date = ?,
      photo = COALESCE(?, photo),
      document_cv = COALESCE(?, document_cv),
      document_id = COALESCE(?, document_id)
     WHERE id = ?`,
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
      photoPath,
      cvPath,
      idPath,
      params.employeeId,
    ]
  );

  return redirect("/employees");
};

export default function EditEmployeePage() {
  const employee = useLoaderData() as Employee;

  return (
    <div className="new-employee-container">
      <h1>Edit Employee</h1>
      <EmployeeForm defaultValues={employee} submitLabel="Update Employee" />
      <BackHomeBtn />
    </div>
  );
}
