import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { ProjectService } from '../../modules/project/project.service';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class ProjectInterceptor implements NestInterceptor {

  constructor(private projectService: ProjectService) {}

  /**
   * check id validity
   * then and add project to request
   * or return 404 if not
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const projectUUID = request.params.projectUUID;

    return from((new ParseUUIDPipe()).transform(projectUUID, { type: 'param' }))
      .pipe(
        catchError(() => {
          throw new HttpException("Invalid UUID", HttpStatus.BAD_REQUEST);
        }),
        switchMap(() => {
          const projectEntity = this.projectService.findEntity(user, projectUUID);
          return from(projectEntity)
            .pipe(
              tap(entity => {
                if (!entity) {
                  throw new HttpException("Project not found", HttpStatus.NOT_FOUND)
                }
                request.project = entity;
              }),
              switchMap(() => next.handle())
            )
        })
      )
  }
}