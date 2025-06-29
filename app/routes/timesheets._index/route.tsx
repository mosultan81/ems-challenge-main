import { useLoaderData } from "react-router";
import { useState, useRef } from "react";
import { getDB } from "~/db/getDB";
import type { LoaderFunctionArgs } from "react-router-dom";
import { Form, useSubmit } from "react-router";

import CalendarApp from "~/Components/Calendar";

export async function loader({ request }: LoaderFunctionArgs) {
  const db = await getDB();
  const url = new URL(request.url);

  const search = url.searchParams.get("search")?.trim() || "";
  const employeeId = url.searchParams.get("employeeId")?.trim() || "";

  let query = `
    SELECT timesheets.*, employees.full_name, employees.id AS employee_id
    FROM timesheets
    JOIN employees ON timesheets.employee_id = employees.id
  `;
  const params: any[] = [];
  const conditions: string[] = [];

  if (search) {
    conditions.push("employees.full_name LIKE ?");
    params.push(`%${search}%`);
  }

  if (employeeId) {
    conditions.push("employees.id = ?");
    params.push(employeeId);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  const timesheetsAndEmployees = await db.all(query, params);
  const employees = await db.all("SELECT id, full_name FROM employees");

  return { timesheetsAndEmployees, search, employeeId, employees };
}

function toDateOnly(dateTimeStr: string) {
  if (!dateTimeStr) return "";
  return dateTimeStr.slice(0, 10);
}

export default function TimesheetsPage() {
  const { timesheetsAndEmployees, search, employeeId, employees } =
    useLoaderData() as {
      timesheetsAndEmployees: any[];
      search: string;
      employeeId: string;
      employees: { id: number; full_name: string }[];
    };

  const [view, setView] = useState<"table" | "calendar">("table");
  const formRef = useRef<HTMLFormElement>(null);
  const submit = useSubmit();

  const onFilterChange = () => {
    if (formRef.current) submit(formRef.current);
  };

  const events = timesheetsAndEmployees.map((ts) => ({
    id: String(ts.id),
    title: `${ts.full_name}${ts.notes ? ` - ${ts.notes}` : ""}`,
    start: toDateOnly(ts.start_time),
    end: toDateOnly(ts.end_time),
  }));

  return (
    <div className="timesheets-container">
      <Form
        method="get"
        ref={formRef}
        className="search-form"
        style={{ marginBottom: "1rem", display: "flex", gap: "10px" }}
      >
        <input
          type="text"
          name="search"
          placeholder="Search by employee name"
          defaultValue={search}
          onChange={onFilterChange}
          className="searchBox"
          autoComplete="off"
        />

        <select
          name="employeeId"
          defaultValue={employeeId}
          onChange={onFilterChange}
          className="filterBox"
        >
          <option value="">All Employees</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.full_name}
            </option>
          ))}
        </select>
      </Form>

      <div style={{ marginBottom: "1rem" }}>
        <button className="btn" onClick={() => setView("table")}>
          Table View
        </button>
        <button
          className="btn"
          onClick={() => setView("calendar")}
          style={{ marginLeft: "1rem" }}
        >
          Calendar View
        </button>
      </div>

      {view === "calendar" ? (
        <CalendarApp events={events} />
      ) : (
        <table className="employees-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Notes</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {timesheetsAndEmployees.map((ts) => (
              <tr key={ts.id}>
                <td>{ts.id}</td>
                <td>
                  <a href={`/employees/${ts.employee_id}`}>{ts.full_name}</a>
                </td>
                <td>{ts.start_time}</td>
                <td>{ts.end_time}</td>
                <td>{ts.notes || "—"}</td>
                <td>
                  <a href={`/timesheets/${ts.id}`} className="btn btn-sm">
                    Edit
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <hr />

      <div className="employees-links">
        <a href="/timesheets/new" className="btn primary-btn">
          New Timesheet
        </a>
        <a href="/employees" className="btn">
          Employees
        </a>
      </div>
    </div>
  );
}
