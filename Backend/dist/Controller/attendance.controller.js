import { EmployeeService } from "../Services/employee.service.js";
import { AttendanceService } from "../Services/attendace.service.js";
import { io } from "../Server/main.js";
export const scanRfidController = async (req, res) => {
    const { rfid_uid } = req.body;
    if (!rfid_uid) {
        return res.status(400).json({ message: "UID del RFID es requerido" });
    }
    try {
        const employee = await EmployeeService.findByUid(rfid_uid);
        if (!employee) {
            console.log("Tarjeta RFID desconocida:", rfid_uid);
            io.emit("rfid:unknow_card", { rfid_uid });
            return res.status(404).json({ message: "Empleado no encontrado" });
        }
        const result = await AttendanceService.processClocking(employee.id);
        const isCheckIn = result.action === 'CHECK_IN';
        return res.status(200).json({
            message: isCheckIn ? "Entrada registrada" : "Salida registrada",
            empleado: employee.nombre,
            hora: isCheckIn ? result.horaEntrada : result.horaSalida,
            horas_trabajadas_hoy: isCheckIn ? 0 : result.horasTrabajadas
        });
    }
    catch (error) {
        console.error("Error en scanRfidController:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};
//# sourceMappingURL=attendance.controller.js.map