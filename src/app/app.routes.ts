import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Landing } from './pages/landing/landing';
import {Login} from './pages/login/login';
import { LearnMore } from './pages/learn-more/learn-more';
import { OwnerDashboard } from './pages/owner-dashboard/owner-dashboard';
import { GuardDashboard } from './pages/guard-dashboard/guard-dashboard';
import { RenterDashboard } from './pages/renter-dashboard/renter-dashboard';
import { SubmitConcern } from './pages/submit-concern/submit-concern';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'dashboard', component: Home },
  { path: 'owner-dashboard', component: OwnerDashboard },
  { path: 'renter-dashboard', component: RenterDashboard },
  { path: 'guard-dashboard', component: GuardDashboard },
  { path: 'submit-concern', component: SubmitConcern },
  { path: 'login', component: Login },
  { path: 'learn-more', component: LearnMore }
];
