import { useLoaderData, Form, useSubmit } from "react-router";
import { getDB } from "~/db/getDB";
import type { LoaderFunctionArgs } from "react-router-dom";
import { useRef } from "react";

const validSortFields = ["date_of_birth", "salary", "start_date", "end_date"];
const validOrders = ["asc", "desc"];

export async function loader({ request }: LoaderFunctionArgs) {
  const db = await getDB();
  const url = new URL(request.url);

  const search = url.searchParams.get("search")?.trim() || "";
  let sortBy = url.searchParams.get("sortBy") || "";
  let order = url.searchParams.get("order") || "asc";

  let page = parseInt(url.searchParams.get("page") || "1", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") || "5", 10);
  const offset = (page - 1) * pageSize;

  if (!validSortFields.includes(sortBy)) sortBy = "";
  if (!validOrders.includes(order.toLowerCase())) order = "asc";

  let baseQuery = "FROM employees";
  const params: any[] = [];

  if (search) {
    baseQuery += " WHERE full_name LIKE ? OR email LIKE ?";
    params.push(`%${search}%`, `%${search}%`);
  }

  const countRow = await db.get(
    `SELECT COUNT(*) as total ${baseQuery}`,
    params
  );
  const totalItems = countRow.total;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (page > totalPages) page = totalPages;

  let query = `SELECT * ${baseQuery}`;
  if (sortBy) query += ` ORDER BY ${sortBy} ${order.toUpperCase()}`;
  query += " LIMIT ? OFFSET ?";
  params.push(pageSize, offset);

  const employees = await db.all(query, params);

  return {
    employees,
    search,
    sortBy,
    order,
    page,
    totalPages,
    pageSize,
    totalItems,
  };
}

export default function EmployeesPage() {
  const { employees, search, sortBy, order, page, totalPages } =
    useLoaderData() as {
      employees: any[];
      search: string;
      sortBy: string;
      order: string;
      page: number;
      totalPages: number;
    };

  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);

  const goToPage = (pageNumber: number) => {
    const form = formRef.current!;
    const formData = new FormData(form);
    formData.set("page", pageNumber.toString());
    submit(formData, { method: "get" });
  };

  function toggleOrder(field: string) {
    if (field !== sortBy) return "asc";
    return order === "asc" ? "desc" : "asc";
  }

  return (
    <div className="employees-container">
      <h1>Employees Page</h1>

      <Form method="get" className="search-form" ref={formRef}>
        <input
          type="text"
          name="search"
          className="searchBox"
          placeholder="Search by name or email"
          defaultValue={search}
          onChange={() => {
            if (formRef.current) submit(formRef.current);
          }}
        />

        <select
          name="sortBy"
          defaultValue={sortBy}
          className="filterBox"
          onChange={() => formRef.current && submit(formRef.current)}
        >
          <option value="">Sort By</option>
          <option value="date_of_birth">Age</option>
          <option value="salary">Salary</option>
          <option value="start_date">Start Date</option>
          <option value="end_date">End Date</option>
        </select>

        {sortBy && (
          <select
            name="order"
            defaultValue={order}
            className="filterBox"
            onChange={() => formRef.current && submit(formRef.current)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        )}

        <input type="hidden" name="page" value={page} />
      </Form>

      <br />

      <table className="employees-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Photo</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  const newOrder = toggleOrder("date_of_birth");
                  const formData = new FormData(formRef.current!);
                  formData.set("sortBy", "date_of_birth");
                  formData.set("order", newOrder);
                  submit(formRef.current!);
                }}
              >
                Age{" "}
                {sortBy === "date_of_birth"
                  ? order === "asc"
                    ? "↑"
                    : "↓"
                  : ""}
              </a>
            </th>
            <th>Job Position</th>
            <th>Department</th>
            <th>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  const newOrder = toggleOrder("salary");
                  const formData = new FormData(formRef.current!);
                  formData.set("sortBy", "salary");
                  formData.set("order", newOrder);
                  submit(formRef.current!);
                }}
              >
                Salary{" "}
                {sortBy === "salary" ? (order === "asc" ? "↑" : "↓") : ""}
              </a>
            </th>
            <th>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  const newOrder = toggleOrder("start_date");
                  const formData = new FormData(formRef.current!);
                  formData.set("sortBy", "start_date");
                  formData.set("order", newOrder);
                  submit(formRef.current!);
                }}
              >
                Start Date{" "}
                {sortBy === "start_date" ? (order === "asc" ? "↑" : "↓") : ""}
              </a>
            </th>
            <th>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  const newOrder = toggleOrder("end_date");
                  const formData = new FormData(formRef.current!);
                  formData.set("sortBy", "end_date");
                  formData.set("order", newOrder);
                  submit(formRef.current!);
                }}
              >
                End Date{" "}
                {sortBy === "end_date" ? (order === "asc" ? "↑" : "↓") : ""}
              </a>
            </th>
            <th>CV</th>
            <th>ID Doc</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>
                <img
                  src={employee.photo}
                  alt="Employee"
                  className="employee-photo"
                />
              </td>
              <td>{employee.full_name}</td>
              <td>{employee.email}</td>
              <td>{employee.phone}</td>
              <td>{employee.date_of_birth}</td>
              <td>{employee.job_position}</td>
              <td>{employee.department}</td>
              <td>${employee.salary}</td>
              <td>{employee.start_date}</td>
              <td>{employee.end_date || "—"}</td>
              <td>
                <a href={employee.document_cv} target="_blank" rel="noreferrer">
                  View CV
                </a>
              </td>
              <td>
                <a href={employee.document_id} target="_blank" rel="noreferrer">
                  View ID
                </a>
              </td>
              <td>
                <a href={`/employees/${employee.id}`}>View</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-controls" style={{ marginTop: "20px" }}>
        <button
          disabled={page <= 1}
          onClick={() => goToPage(page - 1)}
          className="btn"
        >
          ⬅ Prev
        </button>
        <span style={{ margin: "0 1rem" }}>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => goToPage(page + 1)}
          className="btn"
        >
          Next ➡
        </button>
      </div>

      <hr />

      <div className="employees-links">
        <a href="/employees/new" className="btn primary-btn">
          New Employee
        </a>
        <a href="/timesheets/" className="btn">
          Timesheets
        </a>
      </div>
    </div>
  );
}
