import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './Components/auth/auth.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { NotesComponent } from './Components/notes/notes.component';
import { AuthGuardGuard } from './RouteProtectors/auth-guard.guard';

const routes: Routes = [
  {
    path:'',
    pathMatch:'full',
    redirectTo:'dashboard'
  },
  {
    path:'auth',
    component: AuthComponent
  },
  {
    path:'dashboard',
    canActivate: [AuthGuardGuard],
    component: DashboardComponent
  },
  {
    path:'notes',
    canActivate: [AuthGuardGuard],
    component: NotesComponent
  },
  {
    path:'**',
    redirectTo:'auth'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
