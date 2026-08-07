import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, url } = req;
    console.log(`[${new Date().toISOString()}-${method}-${url}]`);
    next();
  }
}

export async function logger(req: Request, res: Response, next: NextFunction) {
  const { method, url } = req;
  console.log(`[${new Date().toISOString()}-${method}-${url}]`);
  next();
}

@Injectable()
export class PreAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      throw new UnauthorizedException('Missing Authorization Headers');
    }
    next();
  }
}
