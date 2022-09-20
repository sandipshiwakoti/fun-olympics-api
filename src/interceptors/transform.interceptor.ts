import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  mixin,
  Type,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  message: string;
  data: Record<string, T>;
}

function TransformInterceptor(message = ''): Type<NestInterceptor> {
  @Injectable()
  class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Observable<Response<T>> {
      return next.handle().pipe(
        map((data) => ({
          success: true,
          reqId: context.switchToHttp().getRequest().reqId,
          message: message,
          data: instanceToPlain(data),
        })),
      );
    }
  }
  return mixin(TransformInterceptor);
}

export default TransformInterceptor;
