import { EmployeeService } from "../Services/employee.service.js";
export const createEmployeeController = async (req, res) => {
    const { nombre, rfid_uid, dni, correo, horas_diarias_trabajadas, dias_trabajados, puesto } = req.body;
    if (!nombre || !dni || !correo || horas_diarias_trabajadas === undefined || dias_trabajados === undefined || !puesto) {
        return res.status(400).json({ message: "Faltan datos requeridos" });
    }
    try {
        const newEmployee = await EmployeeService.create({
            nombre,
            rfid_uid,
            dni,
            correo,
            horas_diarias_trabajadas,
            dias_trabajados,
            puesto
        });
        return res.status(201).json(newEmployee);
    }
    catch (error) {
        console.error("Error en createEmployeeController:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            const sqlMsg = error.sqlMessage || "";
            if (sqlMsg.includes('correo')) {
                return res.status(409).json({ message: "El correo ya se encuentra registrado" });
            }
            if (sqlMsg.includes('rfid_uid')) {
                return res.status(409).json({ message: "El RFID UID ya se encuentra registrado" });
            }
            if (sqlMsg.includes('dni')) {
                return res.status(409).json({ message: "El DNI ya se encuentra registrado" });
            }
            return res.status(409).json({ message: "Registro duplicado en la base de datos" });
        }
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};
export const getAllEmployeesController = async (_req, res) => {
    try {
        const employees = await EmployeeService.findAll();
        return res.status(200).json(employees);
    }
    catch (error) {
        console.error("Error en getAllEmployeesController:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};
export const getEmployeeByUidController = async (req, res) => {
    const rfid_uid = String(req.query.rfid_uid || "").trim();
    if (!rfid_uid) {
        return res.status(400).json({ message: "El parámetro rfid_uid es requerido" });
    }
    try {
        const employee = await EmployeeService.findByUid(rfid_uid);
        if (!employee) {
            return res.status(404).json({ message: "Empleado no encontrado" });
        }
        return res.status(200).json(employee);
    }
    catch (error) {
        console.error("Error en getEmployeeByUidController:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};
export const assignRfidController = async (req, res) => {
    const { employee_id, rfid_uid } = req.body;
    if (!employee_id || !rfid_uid) {
        return res.status(400).json({ message: "Se requiere el ID del usuario y el rfid_uid" });
    }
    try {
        const updatedEmployee = await EmployeeService.assignRfid(employee_id, rfid_uid);
        if (!updatedEmployee) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        return res.status(200).json({
            message: "Tarjeta vinculada correctamente",
            empleado: updatedEmployee
        });
    }
    catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "Esta tarjeta ya pertenece a otro usuario" });
        }
        console.error("Error en assignRfidController:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};
export const assignRfidControllerWithDni = async (req, res) => {
    const { dni, rfid_uid } = req.body;
    if (!dni || !rfid_uid) {
        return res.status(400).json({ message: "Se requiere el DNI del usuario y el rfid_uid" });
    }
    try {
        const updatedEmployee = await EmployeeService.assignRfidWithDni(dni, rfid_uid);
        if (!updatedEmployee) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        return res.status(200).json({
            message: "Tarjeta vinculada correctamente",
            empleado: updatedEmployee
        });
    }
    catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "Esta tarjeta ya pertenece a otro usuario" });
        }
        console.error("Error en assignRfidControllerWithDni:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};
export const assignDniController = async (req, res) => {
    const { employee_id, dni } = req.body;
    if (!employee_id || !dni) {
        return res.status(400).json({ message: "Se requiere el ID del usuario y el DNI" });
    }
    try {
        const updatedEmployee = await EmployeeService.assignDni(employee_id, dni);
        if (!updatedEmployee) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        return res.status(200).json({
            message: "DNI vinculado correctamente",
            empleado: updatedEmployee
        });
    }
    catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "Este DNI ya pertenece a otro usuario" });
        }
        console.error("Error en assignDniController:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};
//# sourceMappingURL=employee.controller.js.map