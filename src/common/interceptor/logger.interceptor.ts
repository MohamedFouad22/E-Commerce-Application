import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { url, method } = request;
    const now = Date.now();

    console.log(`[${method}-${url}-Request Started At(${now})]`);

    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(
            `[${method}-${url}-Request completed At(${Date.now() - now}ms)]`,
          ),
        ),
      );
  }
}
