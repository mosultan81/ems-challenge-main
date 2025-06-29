import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfigPath = path.join(__dirname, '../database.yaml');
const dbConfig = yaml.load(fs.readFileSync(dbConfigPath, 'utf8'));

const {
  'sqlite_path': sqlitePath,
} = dbConfig;

const db = new sqlite3.Database(sqlitePath);

const employees = [
  {
    full_name: 'Layla Hammoud',
    email: 'layla.hammoud@gmail.com',
    phone: '+96171111333',
    date_of_birth: '1991-07-12',
    job_position: 'UI/UX Designer',
    department: 'Design',
    salary: 2100,
    start_date: '2021-09-15',
    end_date: null,
    photo: 'https://randomuser.me/api/portraits/women/45.jpg',
    document_cv: 'uploads/docs/layla_cv.pdf',
    document_id: 'uploads/docs/layla_id.pdf'
  },
  {
    full_name: 'Karim Nassar',
    email: 'karim.nassar@gmail.com',
    phone: '+96171111444',
    date_of_birth: '1988-03-08',
    job_position: 'Project Manager',
    department: 'Management',
    salary: 3200,
    start_date: '2020-01-10',
    end_date: null,
    photo: 'https://randomuser.me/api/portraits/men/52.jpg',
    document_cv: 'uploads/docs/karim_cv.pdf',
    document_id: 'uploads/docs/karim_id.pdf'
  },
  {
    full_name: 'Nour Abou Khalil',
    email: 'nour.khalil@gmail.com',
    phone: '+96171111555',
    date_of_birth: '1995-11-23',
    job_position: 'QA Engineer',
    department: 'Quality Assurance',
    salary: 1900,
    start_date: '2023-05-01',
    end_date: null,
    photo: 'https://randomuser.me/api/portraits/women/68.jpg',
    document_cv: 'uploads/docs/nour_cv.pdf',
    document_id: 'uploads/docs/nour_id.pdf'
  },
  {
    full_name: 'Omar Saad',
    email: 'omar.saad@gmail.com',
    phone: '+96171111666',
    date_of_birth: '1990-02-14',
    job_position: 'DevOps Engineer',
    department: 'IT',
    salary: 2700,
    start_date: '2019-07-20',
    end_date: null,
    photo: 'https://randomuser.me/api/portraits/men/35.jpg',
    document_cv: 'uploads/docs/omar_cv.pdf',
    document_id: 'uploads/docs/omar_id.pdf'
  },
  {
    full_name: 'Jana Mroueh',
    email: 'jana.mroueh@gmail.com',
    phone: '+96171111777',
    date_of_birth: '1996-10-05',
    job_position: 'Data Analyst',
    department: 'Analytics',
    salary: 2300,
    start_date: '2022-11-11',
    end_date: null,
    photo: 'https://randomuser.me/api/portraits/women/12.jpg',
    document_cv: 'uploads/docs/jana_cv.pdf',
    document_id: 'uploads/docs/jana_id.pdf'
  },
  {
    full_name: 'Rami Sleiman',
    email: 'rami.sleiman@gmail.com',
    phone: '+96171111888',
    date_of_birth: '1987-06-17',
    job_position: 'Backend Developer',
    department: 'IT',
    salary: 2500,
    start_date: '2021-03-22',
    end_date: null,
    photo: 'https://randomuser.me/api/portraits/men/60.jpg',
    document_cv: 'uploads/docs/rami_cv.pdf',
    document_id: 'uploads/docs/rami_id.pdf'
  },
  {
    full_name: 'Hana Chami',
    email: 'hana.chami@gmail.com',
    phone: '+96171111999',
    date_of_birth: '1993-12-30',
    job_position: 'Marketing Specialist',
    department: 'Marketing',
    salary: 2200,
    start_date: '2020-08-18',
    end_date: null,
    photo: 'https://randomuser.me/api/portraits/women/80.jpg',
    document_cv: 'uploads/docs/hana_cv.pdf',
    document_id: 'uploads/docs/hana_id.pdf'
  },
  {
    full_name: 'Tarek Haddad',
    email: 'tarek.haddad@gmail.com',
    phone: '+96171111000',
    date_of_birth: '1985-01-19',
    job_position: 'Financial Analyst',
    department: 'Finance',
    salary: 3100,
    start_date: '2018-04-10',
    end_date: null,
    photo: 'https://randomuser.me/api/portraits/men/70.jpg',
    document_cv: 'uploads/docs/tarek_cv.pdf',
    document_id: 'uploads/docs/tarek_id.pdf'
  },
  {
    full_name: 'Samar Fares',
    email: 'samar.fares@gmail.com',
    phone: '+96171111111',
    date_of_birth: '1994-09-02',
    job_position: 'HR Officer',
    department: 'Human Resources',
    salary: 2000,
    start_date: '2023-01-03',
    end_date: null,
    photo: 'https://randomuser.me/api/portraits/women/56.jpg',
    document_cv: 'uploads/docs/samar_cv.pdf',
    document_id: 'uploads/docs/samar_id.pdf'
  },
  {
    full_name: 'Fadi Khoury',
    email: 'fadi.khoury@gmail.com',
    phone: '+96171111223',
    date_of_birth: '1992-04-04',
    job_position: 'Frontend Developer',
    department: 'IT',
    salary: 2400,
    start_date: '2022-06-06',
    end_date: null,
    photo: 'https://randomuser.me/api/portraits/men/48.jpg',
    document_cv: 'uploads/docs/fadi_cv.pdf',
    document_id: 'uploads/docs/fadi_id.pdf'
  }

];


const timesheets = [
  {
    employee_id: 1,
    start_time: '2025-02-10 08:00:00',
    end_time: '2025-02-10 17:00:00',
    notes: 'Excellent start to the week'
  },
  {
    employee_id: 2,
    start_time: '2025-02-10 08:00:00',
    end_time: '2025-02-10 17:00:00',
    notes: 'Creative contributions expected'
  },
  {
    employee_id: 3,
    start_time: '2025-02-10 08:00:00',
    end_time: '2025-02-10 17:00:00',
    notes: 'Leadership in meetings'
  },
  {
    employee_id: 4,
    start_time: '2025-02-10 08:00:00',
    end_time: '2025-02-10 17:00:00',
    notes: 'A great one to be'
  },
  {
    employee_id: 5,
    start_time: '2025-02-10 08:00:00',
    end_time: '2025-02-10 17:00:00',
    notes: 'Focused on dashboard report'
  },
  {
    employee_id: 6,
    start_time: '2025-02-10 08:00:00',
    end_time: '2025-02-10 17:00:00',
    notes: 'Deployment tasks scheduled'
  },
  {
    employee_id: 7,
    start_time: '2025-02-10 08:00:00',
    end_time: '2025-02-10 17:00:00',
    notes: 'Marketing plan presentation'
  },
  {
    employee_id: 8,
    start_time: '2025-02-10 08:00:00',
    end_time: '2025-02-10 17:00:00',
    notes: 'Finance report analysis'
  },
  {
    employee_id: 9,
    start_time: '2025-02-10 08:00:00',
    end_time: '2025-02-10 17:00:00',
    notes: 'Team onboarding support'
  },
  {
    employee_id: 10,
    start_time: '2025-02-10 08:00:00',
    end_time: '2025-02-10 17:00:00',
    notes: 'Front-end refactor in progress'
  }
];


const insertData = (table, data) => {
  const columns = Object.keys(data[0]).join(', ');
  const placeholders = Object.keys(data[0]).map(() => '?').join(', ');

  const insertStmt = db.prepare(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`);

  data.forEach(row => {
    insertStmt.run(Object.values(row));
  });

  insertStmt.finalize();
};

db.serialize(() => {
  insertData('employees', employees);
  insertData('timesheets', timesheets);
});

db.close(err => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Database seeded successfully.');
  }
});

