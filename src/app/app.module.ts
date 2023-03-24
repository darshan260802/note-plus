import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import {
  TuiRootModule,
  TuiDialogModule,
  TuiAlertModule,
  TUI_SANITIZER,
  TuiButtonModule,
  TuiLinkModule,
} from '@taiga-ui/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { TuiCheckboxBlockModule, TuiInputModule, TuiInputPasswordModule, TuiIslandModule, TuiToggleModule } from '@taiga-ui/kit';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthComponent } from './Components/auth/auth.component';
import {HttpClientModule} from '@angular/common/http';
import { DashboardComponent } from './Components/dashboard/dashboard.component';

@NgModule({
  declarations: [AppComponent, AuthComponent, DashboardComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TuiRootModule,
    TuiDialogModule,
    TuiInputModule,
    TuiButtonModule,
    TuiLinkModule,
    TuiToggleModule,
    TuiCheckboxBlockModule,
    TuiInputPasswordModule,
    TuiAlertModule,
    TuiIslandModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
  providers: [{ provide: TUI_SANITIZER, useClass: NgDompurifySanitizer }],
  bootstrap: [AppComponent],
})
export class AppModule {}
