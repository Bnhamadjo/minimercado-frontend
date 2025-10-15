import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './app/auth-interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    // ✅ PRIMEIRO: Providers das ROTAS (CRÍTICO!)
    ...appConfig.providers,
    
    // register the class-based interceptor with the DI token
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },

    // ✅ DEPOIS: Seus outros providers
    // provide HttpClient configured to use DI-registered interceptors
    provideHttpClient(withInterceptorsFromDi()),
    provideCharts(withDefaultRegisterables())
  ]
})
.catch((err) => console.error(err));