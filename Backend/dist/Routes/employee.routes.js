import { Router } from 'express';
import { createEmployeeController, getAllEmployeesController, getEmployeeByUidController, assignRfidController, assignRfidControllerWithDni, assignDniController } from '../Controller/employee.controller.js';
import { scanRfidController } from '../Controller/attendance.controller.js';
const employeeRouter = Router();
employeeRouter.post('/create', createEmployeeController);
employeeRouter.get('/all', getAllEmployeesController);
employeeRouter.get('/by-uid', getEmployeeByUidController);
employeeRouter.patch('/assign-rfid', assignRfidController);
employeeRouter.patch('/assign-rfid-dni', assignRfidControllerWithDni);
employeeRouter.patch('/assign-dni', assignDniController);
employeeRouter.post('/scan', scanRfidController);
export default employeeRouter;
//# sourceMappingURL=employee.routes.js.map