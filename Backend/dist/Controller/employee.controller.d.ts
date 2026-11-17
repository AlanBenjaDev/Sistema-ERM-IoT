import { Request, Response } from "express";
export declare const createEmployeeController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllEmployeesController: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getEmployeeByUidController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const assignRfidController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const assignRfidControllerWithDni: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const assignDniController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
