import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MesVoyagesComponent } from './pages/mes-voyages/mes-voyages.component';
import { AjouterVoyageComponent } from './pages/ajouter-voyage/ajouter-voyage.component';
import { PointsGeographiquesComponent } from './pages/points-geographiques/points-geographiques.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'mes-voyages', component: MesVoyagesComponent, canActivate: [AuthGuard] },
  { path: 'ajouter-voyage', component: AjouterVoyageComponent, canActivate: [AuthGuard] },
  { path: 'points-geographiques', component: PointsGeographiquesComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/mes-voyages', pathMatch: 'full' },
  { path: '**', redirectTo: '/mes-voyages' }
];