import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config as appConfig } from './app/app.config.server'; // ou app.config.ts, conforme seu projeto

const bootstrap = (context: BootstrapContext) =>
  bootstrapApplication(AppComponent, appConfig, context);

export default bootstrap;