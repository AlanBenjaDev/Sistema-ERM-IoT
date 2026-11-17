import pool from '../config/db.js';
import { IEmployee } from '../Models/employee.interface.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class EmployeeService {
  
  static async create(employee: IEmployee): Promise<IEmployee> {
    const query = `
      INSERT INTO employees (nombre, rfid_uid, dni,correo, horas_diarias_trabajadas, dias_trabajados, puesto)
      VALUES (?, ?, ?, ?, ?, ?,?)
    `;
    
    const [result] = await pool.execute<ResultSetHeader>(query, [
      employee.nombre,
      employee.rfid_uid || null,
      employee.dni || null,
      employee.correo,
      employee.horas_diarias_trabajadas,
      employee.dias_trabajados,
      employee.puesto
    ]);

    return {
      id: result.insertId,
      ...employee
    };
  }

  static async findAll(): Promise<IEmployee[]> {
    const query = `SELECT id, rfid_uid, nombre, correo, dni,horas_diarias_trabajadas, dias_trabajados, puesto, created_at FROM employees`;
    
    const [rows] = await pool.execute<RowDataPacket[]>(query);
    return rows as IEmployee[];
  }

  static async findById(id: number): Promise<IEmployee | null> {
    const query = `SELECT id, rfid_uid, nombre, correo, horas_diarias_trabajadas, dias_trabajados, puesto, created_at FROM employees WHERE id = ?`;
    
    const [rows] = await pool.execute<RowDataPacket[]>(query, [id]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0] as IEmployee;
  }

  static async findByUid(rfid_uid: string): Promise<IEmployee | null> {
    const query = `SELECT id, rfid_uid, nombre, correo, horas_diarias_trabajadas, dias_trabajados, puesto, created_at FROM employees WHERE rfid_uid = ?`;
    
    const [rows] = await pool.execute<RowDataPacket[]>(query, [rfid_uid]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0] as IEmployee;
  }

  static async assignRfid(id: number, rfid_uid: string): Promise<IEmployee | null> {
    const query = "UPDATE employees SET rfid_uid = ? WHERE id = ?";
    await pool.execute(query, [rfid_uid, id]);

    return this.findById(id); 
  }
  static async assignDni(id: number, dni: string): Promise<IEmployee | null> {
    const query = "UPDATE employees SET dni = ? WHERE id = ?";
    await pool.execute(query, [dni, id]);

    return this.findById(id); 
  }
  static async assignRfidWithDni
  (dni: number, rfid_uid: string): Promise<IEmployee | null> {
    const query = "UPDATE employees SET rfid_uid = ? WHERE dni = ?";
    await pool.execute(query, [rfid_uid, dni]);
    return this.findByUid(rfid_uid);
  }
}