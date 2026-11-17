import pool from '../config/db.js';
export class PaymentService {
    static async create(payment) {
        const query = `
      INSERT INTO payments (cantidad, tipo_pago, employee_id, concepto)
      VALUES (?, ?, ?, ?)
    `;
        const [result] = await pool.execute(query, [
            payment.cantidad,
            payment.tipo_pago,
            payment.employee_id ?? null,
            payment.concepto
        ]);
        return {
            id: result.insertId,
            ...payment
        };
    }
    static async findAllWithEmployee() {
        const query = `
      SELECT 
        p.id,
        p.cantidad,
        p.tipo_pago,
        p.employee_id,
        p.concepto,
        p.fecha,
        e.nombre AS empleado_nombre,
        e.correo AS empleado_correo,
        e.puesto AS empleado_puesto
      FROM payments p
      LEFT JOIN employees e ON p.employee_id = e.id
      ORDER BY p.fecha DESC
    `;
        const [rows] = await pool.execute(query);
        return rows;
    }
    static async findSalaryPayments() {
        const query = `
      SELECT 
        p.id,
        p.cantidad,
        p.concepto,
        p.fecha,
        e.id AS employee_id,
        e.nombre AS empleado_nombre,
        e.correo AS empleado_correo,
        e.puesto AS empleado_puesto
      FROM payments p
      INNER JOIN employees e ON p.employee_id = e.id
      WHERE p.tipo_pago = 1
      ORDER BY p.fecha DESC
    `;
        const [rows] = await pool.execute(query);
        return rows;
    }
}
//# sourceMappingURL=payment.service.js.map