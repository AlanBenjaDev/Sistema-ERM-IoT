import { PaymentService } from "../Services/payment.service.js";
export const addPaymentController = async (req, res) => {
    try {
        const { cantidad, tipo_pago, employee_id, concepto } = req.body;
        if (cantidad === undefined || tipo_pago === undefined || !concepto) {
            return res.status(400).json({ message: "Faltan datos requeridos (cantidad, tipo_pago, concepto)" });
        }
        if (Number(tipo_pago) === 1 && !employee_id) {
            return res.status(400).json({
                message: "Para registrar un pago de sueldo (tipo_pago = 1) se requiere un employee_id válido."
            });
        }
        const newPayment = await PaymentService.create({
            cantidad: Number(cantidad),
            tipo_pago: Number(tipo_pago),
            employee_id: employee_id ? Number(employee_id) : null,
            concepto
        });
        return res.status(201).json(newPayment);
    }
    catch (error) {
        console.error("Error in addPaymentController:", error);
        if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === 'ER_NO_REFERENCED_ROW') {
            return res.status(404).json({ message: "El empleado especificado no existe." });
        }
        return res.status(500).json({ message: "Error interno del servidor al procesar el pago." });
    }
};
//# sourceMappingURL=payment.controller.js.map