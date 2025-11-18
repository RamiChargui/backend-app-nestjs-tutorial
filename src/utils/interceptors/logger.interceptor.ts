import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable, tap } from "rxjs";

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      console.log('Before...');
      return next.handle().pipe(map( (data) => {
            const { password, ...rest } = data;
            return rest;
      }));
      
  }
}