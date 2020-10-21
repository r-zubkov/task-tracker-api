import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { ProjectService } from '../../modules/project/project.service';
import { switchMap, tap } from 'rxjs/operators';

@Injectable()
export class ProjectInterceptor implements NestInterceptor {

  constructor(private projectService: ProjectService) {}

  /**
   * Find and add project to request
   * or return 404 if not
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const projectId = request.params.projectId;
    const projectEntity = this.projectService.findEntity(projectId, user);

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
  }
}