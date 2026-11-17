import path from 'path';
import { inspectCsvColumns, queryCsvData } from '../middlewares/ingester.js';
export const uploadCsvController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: 'error', message: 'No se subió ningún archivo' });
        }
        const filePath = path.resolve(req.file.path);
        const columns = await inspectCsvColumns(filePath);
        return res.json({
            status: 'success',
            message: 'Dataset procesado con éxito por DuckDB',
            filePath,
            columns
        });
    }
    catch (error) {
        console.error('Error al inspeccionar CSV:', error);
        return res.status(500).json({ status: 'error', message: error.message });
    }
};
export const queryCsvController = async (req, res) => {
    try {
        const { filePath, selectedColumns, limit = 50 } = req.body;
        if (!filePath) {
            return res.status(400).json({ status: 'error', message: 'Se requiere la ruta del archivo (filePath)' });
        }
        if (!selectedColumns || selectedColumns.length === 0) {
            return res.status(400).json({ status: 'error', message: 'Selecciona al menos una columna' });
        }
        const data = await queryCsvData(filePath, selectedColumns, limit);
        return res.json({
            status: 'success',
            totalRows: data.length,
            data
        });
    }
    catch (error) {
        console.error('Error al consultar datos:', error);
        return res.status(500).json({ status: 'error', message: error.message });
    }
};
//# sourceMappingURL=data.controller.js.map