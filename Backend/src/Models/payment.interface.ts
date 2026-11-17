// src/interfaces/Payment.interface.ts
export enum PaymentType {
  SALARY = 1,      // Egreso
  CLIENT_INCOME = 2 // Ingreso
}

export interface IPayment {
  id?: number;
  cantidad: number;
  tipo_pago: PaymentType;
  employee_id?: number | null;
  concepto: string;
  fecha?: Date;
}

export interface IPaymentWithEmployee extends IPayment {
  empleado_nombre?: string | null;
  empleado_correo?: string | null;
  empleado_puesto?: string | null;
}