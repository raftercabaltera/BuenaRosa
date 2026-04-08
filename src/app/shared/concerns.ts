export type ConcernCategory =
  | 'Security'
  | 'Gate Access'
  | 'Visitor / Delivery'
  | 'Parking'
  | 'Maintenance'
  | 'Billing'
  | 'Noise / Neighbor'
  | 'Community';

export type ConcernStatus =
  | 'New'
  | 'In Review'
  | 'Pending Response'
  | 'Assigned'
  | 'Monitoring'
  | 'Received';

export interface ConcernItem {
  resident: string;
  unit: string;
  category: ConcernCategory;
  title: string;
  status: ConcernStatus;
}

export const concernCategories: ConcernCategory[] = [
  'Security',
  'Gate Access',
  'Visitor / Delivery',
  'Parking',
  'Maintenance',
  'Billing',
  'Noise / Neighbor',
  'Community',
];

export const guardVisibleCategories: ConcernCategory[] = [
  'Security',
  'Gate Access',
  'Visitor / Delivery',
  'Parking',
];

export const mockConcerns: ConcernItem[] = [
  {
    resident: 'Victor Samonte',
    unit: 'Block 3 Lot 14',
    category: 'Security',
    title: 'Unidentified visitor stayed near the gate entrance',
    status: 'New',
  },
  {
    resident: 'Angela Ramos',
    unit: 'Block 1 Lot 2',
    category: 'Maintenance',
    title: 'Streetlight near the corner is not working',
    status: 'In Review',
  },
  {
    resident: 'Cynthia Navarro',
    unit: 'Block 3 Lot 13',
    category: 'Billing',
    title: 'Statement balance does not match latest payment',
    status: 'Pending Response',
  },
  {
    resident: 'Harold Mendoza',
    unit: 'Block 5 Lot 2',
    category: 'Gate Access',
    title: 'Expected guest was delayed at the checkpoint',
    status: 'Assigned',
  },
  {
    resident: 'Leo Panganiban',
    unit: 'Block 7 Lot 14',
    category: 'Parking',
    title: 'Delivery motorcycle blocked the service lane',
    status: 'Monitoring',
  },
  {
    resident: 'Mica Villanueva',
    unit: 'Block 6 Lot 6',
    category: 'Visitor / Delivery',
    title: 'Courier arrived without prior resident notification',
    status: 'Received',
  },
];

export function getGuardConcerns(concerns: ConcernItem[]): ConcernItem[] {
  return concerns.filter((concern) => guardVisibleCategories.includes(concern.category));
}
