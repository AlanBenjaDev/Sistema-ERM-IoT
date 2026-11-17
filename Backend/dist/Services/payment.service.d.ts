import { IPayment, IPaymentWithEmployee } from '../Models/payment.interface.js';
export declare class PaymentService {
    static create(payment: IPayment): Promise<IPayment>;
    static findAllWithEmployee(): Promise<IPaymentWithEmployee[]>;
    static findSalaryPayments(): Promise<IPaymentWithEmployee[]>;
}
