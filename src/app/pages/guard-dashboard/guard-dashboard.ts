import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { getGuardConcerns, mockConcerns } from '../../shared/concerns';

interface SummaryCard {
  label: string;
  value: string;
  note: string;
  accent: 'visitors' | 'deliveries' | 'pending' | 'alerts';
}

interface VisitorItem {
  name: string;
  destination: string;
  type: string;
  time: string;
  status: string;
}

interface DeliveryItem {
  courier: string;
  destination: string;
  item: string;
  time: string;
}

interface QuickAction {
  title: string;
  note: string;
}

@Component({
  selector: 'app-guard-dashboard',
  imports: [RouterLink],
  templateUrl: './guard-dashboard.html',
  styleUrl: './guard-dashboard.scss',
})
export class GuardDashboard {
  readonly summaryCards: SummaryCard[] = [
    {
      label: 'Visitors Today',
      value: '18',
      note: '12 checked in, 6 completed exit log',
      accent: 'visitors',
    },
    {
      label: 'Deliveries',
      value: '9',
      note: 'Packages and service drop-offs logged today',
      accent: 'deliveries',
    },
    {
      label: 'Pending Verification',
      value: '3',
      note: 'Waiting for resident confirmation',
      accent: 'pending',
    },
    {
      label: 'Security Alerts',
      value: '2',
      note: 'Items needing follow-up before shift end',
      accent: 'alerts',
    },
  ];

  readonly visitorQueue: VisitorItem[] = [
    {
      name: 'Arvin Dizon',
      destination: 'Block 3 Lot 14',
      type: 'Guest',
      time: '09:10 AM',
      status: 'Waiting Approval',
    },
    {
      name: 'Meralco Service Crew',
      destination: 'Block 8 Lot 19',
      type: 'Maintenance',
      time: '09:02 AM',
      status: 'Verified',
    },
    {
      name: 'J&T Express Rider',
      destination: 'Block 2 Lot 10',
      type: 'Delivery',
      time: '08:56 AM',
      status: 'On Site',
    },
    {
      name: 'Paula Enriquez',
      destination: 'Block 5 Lot 5',
      type: 'Guest',
      time: '08:41 AM',
      status: 'Checked In',
    },
  ];

  readonly deliveryLog: DeliveryItem[] = [
    {
      courier: 'LBC',
      destination: 'Block 1 Lot 2',
      item: 'Document envelope',
      time: '08:30 AM',
    },
    {
      courier: 'Shopee Xpress',
      destination: 'Block 3 Lot 14',
      item: 'Home appliance package',
      time: '08:48 AM',
    },
    {
      courier: 'Grab Delivery',
      destination: 'Block 6 Lot 10',
      item: 'Food delivery',
      time: '09:05 AM',
    },
  ];

  readonly quickActions: QuickAction[] = [
    {
      title: 'Log New Visitor',
      note: 'Create a visitor entry at the checkpoint.',
    },
    {
      title: 'Register Delivery',
      note: 'Record package or courier arrival details.',
    },
    {
      title: 'Call Resident',
      note: 'Request gate approval from the destination household.',
    },
    {
      title: 'File Incident Note',
      note: 'Record unusual activity or security observations.',
    },
  ];

  readonly guardConcerns = getGuardConcerns(mockConcerns);
}
