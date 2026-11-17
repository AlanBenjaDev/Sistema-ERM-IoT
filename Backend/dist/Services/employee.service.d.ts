import { IEmployee } from '../Models/employee.interface.js';
export declare class EmployeeService {
    static create(employee: IEmployee): Promise<IEmployee>;
    static findAll(): Promise<IEmployee[]>;
    static findById(id: number): Promise<IEmployee | null>;
    static findByUid(rfid_uid: string): Promise<IEmployee | null>;
    static assignRfid(id: number, rfid_uid: string): Promise<IEmployee | null>;
    static assignDni(id: number, dni: string): Promise<IEmployee | null>;
    static assignRfidWithDni(dni: number, rfid_uid: string): Promise<IEmployee | null>;
}
