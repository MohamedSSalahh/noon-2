import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  // Skip loader for some requests if needed (e.g. chat polling if not socket)
  // if (req.url.includes('chat')) return next(req);

  loadingService.show();

  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
};
