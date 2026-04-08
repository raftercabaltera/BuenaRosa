import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface SummaryCard {
  label: string;
  value: string;
  accent: 'home' | 'lease' | 'billing' | 'requests';
}

interface QuickAction {
  title: string;
  route?: string;
  queryParams?: Record<string, string>;
}

interface NoticeItem {
  category: string;
  title: string;
  date: string;
  note: string;
}

interface RequestItem {
  title: string;
  status: string;
  date: string;
}

interface DetailItem {
  label: string;
  value: string;
}

interface AccountStatusItem {
  label: string;
  value: string;
}

@Component({
  selector: 'app-renter-dashboard',
  imports: [RouterLink],
  templateUrl: './renter-dashboard.html',
  styleUrl: './renter-dashboard.scss',
})
export class RenterDashboard {
  readonly summaryCards: SummaryCard[] = [
    {
      label: 'Home',
      value: 'Block 3 Lot 14',
      accent: 'home',
    },
    {
      label: 'Lease Status',
      value: 'Active',
      accent: 'lease',
    },
    {
      label: 'Dues Advisory',
      value: 'Current',
      accent: 'billing',
    },
    {
      label: 'My Requests',
      value: '2',
      accent: 'requests',
    },
  ];

  readonly unitDetails: DetailItem[] = [
    { label: 'Primary Renter', value: 'Victor Samonte' },
    { label: 'Occupancy Type', value: 'Tenant-Occupied' },
    { label: 'Move-In Date', value: 'Feb 12, 2025' },
    { label: 'Registered Vehicles', value: '1 sedan | 1 motorcycle' },
    { label: 'Emergency Contact', value: 'Lara Samonte | 0917-999-1422' },
  ];

  readonly accountStatus: AccountStatusItem[] = [
    { label: 'Outstanding Balance', value: 'PHP 1,250' },
    { label: 'Last Payment', value: 'Jan 10, 2026' },
    { label: 'Next Due Date', value: 'Apr 15, 2026' },
  ];

  readonly notices: NoticeItem[] = [
    {
      category: 'Community',
      title: 'General assembly scheduled for April 20',
      date: 'Mar 24, 2026',
      note: 'Residents are encouraged to attend the HOA community briefing.',
    },
    {
      category: 'Utilities',
      title: 'Water line maintenance on Phase 1',
      date: 'Mar 22, 2026',
      note: 'Expected service interruption from 10:00 AM to 1:00 PM.',
    },
    {
      category: 'Security',
      title: 'Vehicle sticker inspection next week',
      date: 'Mar 20, 2026',
      note: 'Please ensure your registered vehicles have updated details on file.',
    },
  ];

  readonly quickActions: QuickAction[] = [
    {
      title: 'Register Visitor',
    },
    {
      title: 'Submit Concern',
      route: '/submit-concern',
      queryParams: { role: 'renter' },
    },
    {
      title: 'Update Household Info',
    },
    {
      title: 'Request Gate Pass',
    },
  ];

  readonly recentRequests: RequestItem[] = [
    {
      title: 'Gate pass for appliance delivery',
      status: 'Approved',
      date: 'Mar 27, 2026',
    },
    {
      title: 'Update vehicle record',
      status: 'In Review',
      date: 'Mar 25, 2026',
    },
    {
      title: 'Report water pressure concern',
      status: 'Received',
      date: 'Mar 21, 2026',
    },
  ];
}
