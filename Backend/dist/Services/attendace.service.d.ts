export interface IClockingResult {
    action: 'CHECK_IN' | 'CHECK_OUT';
    horaEntrada?: string;
    horaSalida?: string;
    horasTrabajadas?: number;
}
export declare class AttendanceService {
    static processClocking(employeeId: number): Promise<IClockingResult>;
}
