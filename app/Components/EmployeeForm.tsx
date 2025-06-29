import { Form } from "react-router";
import { useState } from "react";

type EmployeeFormProps = {
  defaultValues?: {
    full_name?: string;
    email?: string;
    phone?: string;
    date_of_birth?: string;
    job_position?: string;
    department?: string;
    salary?: string;
    start_date?: string;
    end_date?: string;
  };
  submitLabel?: string;
};

export default function EmployeeForm({
  defaultValues = {},
  submitLabel = "Create Employee",
}: EmployeeFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const newErrors: Record<string, string> = {};

    const full_name = form.full_name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const salary = parseFloat(form.salary.value);
    const dobValue = form.date_of_birth.value;


    if (full_name.length < 3) {
      newErrors.full_name = "Full name must be at least 3 characters.";
    }


    if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!/^\+?\d{8,15}$/.test(phone)) {
      newErrors.phone = "Phone number must be 8–15 digits.";
    }

    if (isNaN(salary) || salary < 500) {
      newErrors.salary = "Salary must be a positive number and 500$ minimum.";
    }

    if (dobValue) {
      const dob = new Date(dobValue);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      const birthdayPassed =
        m > 0 || (m === 0 && today.getDate() >= dob.getDate());
      const actualAge = birthdayPassed ? age : age - 1;
      if (actualAge < 18) {
        newErrors.date_of_birth = "Employee must be at least 18 years old.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      e.preventDefault();
      setErrors(newErrors);
    }
  };

  return (
    <Form
      method="post"
      className="employee-form"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
    >
      <div className="form-group">
        <label htmlFor="full_name">Full Name</label>
        <input
          type="text"
          name="full_name"
          id="full_name"
          defaultValue={defaultValues.full_name || ""}
          required
        />
        {errors.full_name && <div className="error">{errors.full_name}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          defaultValue={defaultValues.email || ""}
          required
        />
        {errors.email && <div className="error">{errors.email}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone</label>
        <input
          type="text"
          name="phone"
          id="phone"
          defaultValue={defaultValues.phone || ""}
          required
        />
        {errors.phone && <div className="error">{errors.phone}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="date_of_birth">Date of Birth</label>
        <input
          type="date"
          name="date_of_birth"
          id="date_of_birth"
          defaultValue={defaultValues.date_of_birth || ""}
          required
        />
        {errors.date_of_birth && (
          <div className="error">{errors.date_of_birth}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="job_position">Job Position</label>
        <input
          type="text"
          name="job_position"
          id="job_position"
          defaultValue={defaultValues.job_position || ""}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="department">Department</label>
        <input
          type="text"
          name="department"
          id="department"
          defaultValue={defaultValues.department || ""}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="salary">Salary</label>
        <input
          type="number"
          name="salary"
          id="salary"
          defaultValue={defaultValues.salary || ""}
          required
        />
        {errors.salary && <div className="error">{errors.salary}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="start_date">Start Date</label>
        <input
          type="date"
          name="start_date"
          id="start_date"
          defaultValue={defaultValues.start_date || ""}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="end_date">End Date</label>
        <input
          type="date"
          name="end_date"
          id="end_date"
          defaultValue={defaultValues.end_date || ""}
        />
      </div>

      <div className="form-group">
        <label htmlFor="photo">Photo</label>
        <input type="file" name="photo" id="photo" accept="image/*" />
      </div>

      <div className="form-group">
        <label htmlFor="document_cv">CV Document</label>
        <input type="file" name="document_cv" id="document_cv" accept=".pdf" />
      </div>

      <div className="form-group">
        <label htmlFor="document_id">ID Document</label>
        <input type="file" name="document_id" id="document_id" accept=".pdf" />
      </div>

      <button type="submit" className="submit-btn">
        {submitLabel}
      </button>
    </Form>
  );
}
