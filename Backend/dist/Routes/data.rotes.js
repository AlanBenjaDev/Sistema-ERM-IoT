// src/routes/etl.routes.ts
import { Router } from 'express';
import { uploadCsvController, queryCsvController } from '../Controller/data.controller.js';
import { upload } from '../middlewares/upload.js';
const router = Router();
router.post('/upload', upload.single('file'), uploadCsvController);
router.post('/query', queryCsvController);
export default router;
//# sourceMappingURL=data.rotes.js.map