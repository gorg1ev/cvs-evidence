type Employee = {
  id: number | null;
  firstName: string;
  lastName: string;
  personalNumber: string | null;
};

type Absent = {
  id: number | null;
  employeeId: number;
  date: string;
  timeFrom: number;
  timeTo: number;
  note: string | null;
  total: number | null;
};

type AbsentFilter = {
  employeeId: number;
  startDate?: string;
  endDate?: string;
};

type SickLeaveFilter = {
  employeeId: number;
  startDate?: string;
  endDate?: string;
};

type VacationFilter = {
  employeeId: number;
  startDate?: string;
  endDate?: string;
};

type SickLeave = {
  id: number | null;
  employeeId: number;
  dateFrom: string;
  dateTo: string;
  note: string | null;
  total: number | null;
};

type Vacation = {
  id: number | null;
  employeeId: number;
  dateFrom: string;
  dateTo: string;
  note: string | null;
  total: number | null;
};

type Holidays = {
  date: Date | string;
  name: string;
  day: string;
};
