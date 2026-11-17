// src/Services/attendance.service.ts

export interface IClockingResult {
    action: 'CHECK_IN' | 'CHECK_OUT';
    horaEntrada?: string;
    horaSalida?: string;
    horasTrabajadas?: number;
}

export class AttendanceService {
    static async processClocking(employeeId: number): Promise<IClockingResult> {
        
        
      
        return {
            action: "CHECK_IN",
            horaEntrada: new Date().toTimeString().split(' ')[0],
            horasTrabajadas: 0
        };
    }
}