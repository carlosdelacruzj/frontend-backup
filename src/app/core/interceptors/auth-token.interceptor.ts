// src/app/core/interceptors/auth-token.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor funcional (Angular 15+) que agrega el header Authorization
 * si existe un token en localStorage (ajusta el storage según tu app).
 */
export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  try {
    const token = localStorage.getItem('token'); // <-- ajusta si usas otro storage/clave
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
  } catch {
    // sin token o storage inaccesible: seguimos sin modificar la request
  }
  return next(req);
};
