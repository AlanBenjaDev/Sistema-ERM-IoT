
import { EmployeeRole } from "../enum/Role.enum.js";

export interface IEmployee {
  id?: number;
  rfid_uid: string;
  dni?: string;
  nombre: string;
  correo: string;
  horas_diarias_trabajadas: number;
  dias_trabajados: number;
  puesto: EmployeeRole;
  createdAt?: Date;
}