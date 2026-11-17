import express from 'express';
import cors from 'cors';
import paymentRouter from '../Routes/payment.routes.js';
import employeeRouter from '../Routes/employee.routes.js';
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/payment', paymentRouter);
app.use('/api/employee', employeeRouter);
export default app;
//# sourceMappingURL=app.js.map