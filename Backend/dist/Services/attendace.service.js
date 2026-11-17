// src/Services/attendance.service.ts
export class AttendanceService {
    static async processClocking(employeeId) {
        return {
            action: "CHECK_IN",
            horaEntrada: new Date().toTimeString().split(' ')[0],
            horasTrabajadas: 0
        };
    }
}
//# sourceMappingURL=attendace.service.js.map