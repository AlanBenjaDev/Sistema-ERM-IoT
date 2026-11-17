import { Request, Response } from 'express';
export declare const uploadCsvController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const queryCsvController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
