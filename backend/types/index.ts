import { Request, Response, NextFunction } from 'express';
import { DecodedIdToken } from 'firebase-admin/auth';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

export interface AuthenticatedRequest extends Request<ParamsDictionary, any, any, ParsedQs> {
  user?: DecodedIdToken;
}

export type AuthMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => Promise<any>;

export type AuthenticatedHandler = (
  req: AuthenticatedRequest,
  res: Response
) => Promise<any>; 