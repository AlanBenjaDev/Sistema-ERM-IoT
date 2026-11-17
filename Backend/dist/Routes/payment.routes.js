import { Router } from "express";
import { addPaymentController } from "../Controller/payment.controller.js";
const paymentRouter = Router();
paymentRouter.post("/add", addPaymentController);
export default paymentRouter;
//# sourceMappingURL=payment.routes.js.map