import { Routes } from '@angular/router';
import { OfficerDashboard } from './pages/officer-dashboard/officer-dashboard';
import { Landing } from './pages/landing/landing';
import {Login} from './pages/login/login';
import { LearnMore } from './pages/learn-more/learn-more';
import { OwnerDashboard } from './pages/owner-dashboard/owner-dashboard';
import { GuardDashboard } from './pages/guard-dashboard/guard-dashboard';
import { RenterDashboard } from './pages/renter-dashboard/renter-dashboard';
import { SubmitConcern } from './pages/submit-concern/submit-concern';
import { GoogleLogin } from './pages/google-login/google-login';
import { GooglePassword } from './pages/google-password/google-password';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'officer-dashboard', component: OfficerDashboard },
  { path: 'dashboard', redirectTo: 'officer-dashboard', pathMatch: 'full' },
  { path: 'owner-dashboard', component: OwnerDashboard },
  { path: 'renter-dashboard', component: RenterDashboard },
  { path: 'guard-dashboard', component: GuardDashboard },
  { path: 'submit-concern', component: SubmitConcern },
  { path: 'login', component: Login },
  { path: 'learn-more', component: LearnMore },
  { path: 'google-login', component: GoogleLogin },
  { path: 'google-password', component: GooglePassword }
];
