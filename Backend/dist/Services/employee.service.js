import pool from '../config/db.js';
export class EmployeeService {
    static async create(employee) {
        const query = `
      INSERT INTO employees (nombre, rfid_uid, dni,correo, horas_diarias_trabajadas, dias_trabajados, puesto)
      VALUES (?, ?, ?, ?, ?, ?,?)
    `;
        const [result] = await pool.execute(query, [
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
    static async findAll() {
        const query = `SELECT id, rfid_uid, nombre, correo, dni,horas_diarias_trabajadas, dias_trabajados, puesto, created_at FROM employees`;
        const [rows] = await pool.execute(query);
        return rows;
    }
    static async findById(id) {
        const query = `SELECT id, rfid_uid, nombre, correo, horas_diarias_trabajadas, dias_trabajados, puesto, created_at FROM employees WHERE id = ?`;
        const [rows] = await pool.execute(query, [id]);
        if (rows.length === 0) {
            return null;
        }
        return rows[0];
    }
    static async findByUid(rfid_uid) {
        const query = `SELECT id, rfid_uid, nombre, correo, horas_diarias_trabajadas, dias_trabajados, puesto, created_at FROM employees WHERE rfid_uid = ?`;
        const [rows] = await pool.execute(query, [rfid_uid]);
        if (rows.length === 0) {
            return null;
        }
        return rows[0];
    }
    static async assignRfid(id, rfid_uid) {
        const query = "UPDATE employees SET rfid_uid = ? WHERE id = ?";
        await pool.execute(query, [rfid_uid, id]);
        return this.findById(id);
    }
    static async assignDni(id, dni) {
        const query = "UPDATE employees SET dni = ? WHERE id = ?";
        await pool.execute(query, [dni, id]);
        return this.findById(id);
    }
    static async assignRfidWithDni(dni, rfid_uid) {
        const query = "UPDATE employees SET rfid_uid = ? WHERE dni = ?";
        await pool.execute(query, [rfid_uid, dni]);
        return this.findByUid(rfid_uid);
    }
}
//# sourceMappingURL=employee.service.js.map