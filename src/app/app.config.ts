import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';  // ← Ajouter withHashLocation
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),  // ← Ajouter withHashLocation()
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi())
  ]
};