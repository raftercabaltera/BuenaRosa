import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface SummaryCard {
  label: string;
  value: string;
  accent: 'property' | 'lease' | 'occupants' | 'requests';
}

interface Announcement {
  category: string;
  title: string;
  date: string;
  note: string;
}

interface QuickAction {
  title: string;
  route?: string;
  queryParams?: Record<string, string>;
}

interface RequestItem {
  title: string;
  status: string;
  date: string;
}

interface HouseholdMember {
  name: string;
  role: string;
  note: string;
}

interface LeaseDetail {
  label: string;
  value: string;
}

@Component({
  selector: 'app-owner-dashboard',
  imports: [RouterLink],
  templateUrl: './owner-dashboard.html',
  styleUrl: './owner-dashboard.scss',
})
export class OwnerDashboard {
  readonly summaryCards: SummaryCard[] = [
    {
      label: 'Home',
      value: 'Block 3 Lot 14',
      accent: 'property',
    },
    {
      label: 'Ownership Status',
      value: 'Active',
      accent: 'lease',
    },
    {
      label: 'Household Members',
      value: '4',
      accent: 'occupants',
    },
    {
      label: 'My Requests',
      value: '2',
      accent: 'requests',
    },
  ];

  readonly leaseDetails: LeaseDetail[] = [
    { label: 'Registered Owner', value: 'Cynthia Navarro' },
    { label: 'Occupancy Type', value: 'Owner-Occupied' },
    { label: 'Residency Since', value: 'Nov 30, 2016' },
    { label: 'Account Standing', value: 'Good standing' },
    { label: 'Owner Contact', value: '0917-810-1013' },
    { label: 'Registered Vehicles', value: '1 sedan | 1 motorcycle' },
  ];

  readonly announcements: Announcement[] = [
    {
      category: 'Community',
      title: 'General assembly scheduled for April 20',
      date: 'Mar 28, 2026',
      note: 'Agenda includes subdivision updates, maintenance planning, and homeowner concerns.',
    },
    {
      category: 'Utilities',
      title: 'Water line maintenance on Phase 1',
      date: 'Mar 25, 2026',
      note: 'Expected service interruption from 10:00 AM to 1:00 PM during line checks.',
    },
    {
      category: 'Security',
      title: 'Vehicle sticker inspection next week',
      date: 'Mar 24, 2026',
      note: 'Please prepare updated vehicle details for checkpoint verification.',
    },
  ];

  readonly quickActions: QuickAction[] = [
    {
      title: 'Update Owner Record',
    },
    {
      title: 'Update Household Info',
    },
    {
      title: 'Submit Concern',
      route: '/submit-concern',
      queryParams: { role: 'owner' },
    },
    {
      title: 'Request HOA Clearance',
    },
    {
      title: 'Register Visitor or Delivery',
    },
  ];

  readonly recentRequests: RequestItem[] = [
    {
      title: 'Update owner contact record',
      status: 'In Review',
      date: 'Mar 25, 2026',
    },
    {
      title: 'Gate pass for appliance delivery',
      status: 'Approved',
      date: 'Mar 27, 2026',
    },
    {
      title: 'Request for HOA clearance copy',
      status: 'Pending',
      date: 'Mar 23, 2026',
    },
  ];

  readonly householdMembers: HouseholdMember[] = [
    {
      name: 'Cynthia Navarro',
      role: 'Property Owner',
      note: 'Primary homeowner account holder on file',
    },
    {
      name: 'Rogelio Navarro',
      role: 'Spouse',
      note: 'Co-resident and emergency contact on file',
    },
    {
      name: 'Patricia Navarro',
      role: 'Household Member',
      note: 'Resident profile updated this quarter',
    },
  ];
}
