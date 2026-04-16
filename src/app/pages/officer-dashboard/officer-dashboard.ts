import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ConcernCategory, ConcernItem, ConcernStatus, mockConcerns } from '../../shared/concerns';

type OccupancyStatus = 'owner' | 'renter' | 'vacant' | 'pending';
type SortField = 'block-lot' | 'resident' | 'status' | 'move-in';
type SortDirection = 'asc' | 'desc';
type FilterPhase = 'all' | HouseRecord['phase'];
type FilterStatus = 'all' | OccupancyStatus;
type RecordFormMode = 'view' | 'create' | 'edit';
type AuditScope = 'selected' | 'all';
type AuditAction = 'Created' | 'Updated' | 'Deleted';
type OfficerRole = 'President' | 'VP' | 'Treasurer' | 'Secretary' | 'Assistant Secretary' | 'Auditor' | 'Peace and Order' | 'BOD';
type DashboardModule = 'overview' | 'concerns' | 'house-records' | 'audit';
type DashboardPermission =
  | 'houses.read'
  | 'houses.create'
  | 'houses.update'
  | 'houses.delete'
  | 'concerns.read'
  | 'concerns.manage'
  | 'audit.read';

interface HouseRecord {
  id: string;
  phase: 'Phase 1' | 'Phase 2';
  block: number;
  lot: number;
  residentName: string;
  status: OccupancyStatus;
  contactNumber: string;
  moveInDate: string;
  remarks: string;
}

interface HouseFormModel {
  phase: HouseRecord['phase'];
  block: number | null;
  lot: number | null;
  residentName: string;
  status: OccupancyStatus;
  contactNumber: string;
  moveInDate: string;
  remarks: string;
}

interface StatCard {
  label: string;
  value: string;
  accent: 'owner' | 'renter' | 'vacant' | 'pending' | 'household' | 'rate';
  note: string;
}

interface PhaseSummary {
  phase: HouseRecord['phase'];
  totalHomes: number;
  occupiedHomes: number;
  tenantHomes: number;
  vacantHomes: number;
  pendingHomes: number;
}

interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: AuditAction;
  houseId: string;
  location: string;
  summary: string;
}

interface RoleAccessProfile {
  restrictionLevel: number;
  modules: DashboardModule[];
  permissions: DashboardPermission[];
  concernCategories: 'all' | ConcernCategory[];
  restrictions: string[];
}

interface RoleWidget {
  label: string;
  value: string;
  note: string;
}

@Component({
  selector: 'app-officer-dashboard',
  imports: [RouterLink, FormsModule],
  templateUrl: './officer-dashboard.html',
  styleUrl: './officer-dashboard.scss',
})
export class OfficerDashboard {
  readonly officerRoles: OfficerRole[] = [
    'President',
    'VP',
    'Treasurer',
    'Secretary',
    'Assistant Secretary',
    'Auditor',
    'Peace and Order',
    'BOD',
  ];
  readonly occupancyStatuses: OccupancyStatus[] = ['owner', 'renter', 'vacant', 'pending'];
  readonly phaseOptions: Array<HouseRecord['phase']> = ['Phase 1', 'Phase 2'];
  readonly sortFields: SortField[] = ['block-lot', 'resident', 'status', 'move-in'];
  readonly residentConcerns: ConcernItem[] = mockConcerns.map((concern) => ({ ...concern }));

  selectedOfficerRole: OfficerRole = 'President';

  private readonly roleAccessProfiles: Record<OfficerRole, RoleAccessProfile> = {
    President: {
      restrictionLevel: 1,
      modules: ['overview', 'concerns', 'house-records', 'audit'],
      permissions: ['houses.read', 'houses.create', 'houses.update', 'houses.delete', 'concerns.read', 'concerns.manage', 'audit.read'],
      concernCategories: 'all',
      restrictions: ['Full operational access in this dashboard scope.'],
    },
    VP: {
      restrictionLevel: 2,
      modules: ['overview', 'concerns', 'house-records', 'audit'],
      permissions: ['houses.read', 'houses.create', 'houses.update', 'concerns.read', 'concerns.manage', 'audit.read'],
      concernCategories: 'all',
      restrictions: [
        'Cannot delete resident/house records.',
        'Escalation approvals remain under President.',
      ],
    },
    Treasurer: {
      restrictionLevel: 4,
      modules: ['overview', 'concerns', 'house-records', 'audit'],
      permissions: ['houses.read', 'houses.update', 'concerns.read', 'audit.read'],
      concernCategories: ['Billing', 'Maintenance'],
      restrictions: [
        'Can only view concerns under Billing and Maintenance.',
        'Cannot add or delete house records.',
        'Concern status updates are disabled for this role.',
      ],
    },
    Secretary: {
      restrictionLevel: 3,
      modules: ['overview', 'concerns', 'house-records'],
      permissions: ['houses.read', 'houses.create', 'houses.update', 'concerns.read', 'concerns.manage'],
      concernCategories: 'all',
      restrictions: [
        'No audit module access.',
        'Cannot delete resident/house records.',
      ],
    },
    'Assistant Secretary': {
      restrictionLevel: 5,
      modules: ['overview', 'concerns', 'house-records'],
      permissions: ['houses.read', 'houses.create', 'houses.update', 'concerns.read'],
      concernCategories: 'all',
      restrictions: [
        'No audit module access.',
        'Concern status updates are disabled for this role.',
        'Cannot delete resident/house records.',
      ],
    },
    Auditor: {
      restrictionLevel: 8,
      modules: ['overview', 'house-records', 'audit'],
      permissions: ['houses.read', 'audit.read'],
      concernCategories: [],
      restrictions: [
        'No concerns module access.',
        'Read-only access for house records and logs.',
      ],
    },
    'Peace and Order': {
      restrictionLevel: 7,
      modules: ['overview', 'concerns', 'house-records'],
      permissions: ['houses.read', 'concerns.read', 'concerns.manage'],
      concernCategories: ['Security', 'Gate Access', 'Visitor / Delivery', 'Parking'],
      restrictions: [
        'Can only view/manage concerns under security categories.',
        'Read-only access for house records.',
        'No audit module access.',
      ],
    },
    BOD: {
      restrictionLevel: 6,
      modules: ['overview', 'concerns', 'house-records', 'audit'],
      permissions: ['houses.read', 'concerns.read', 'audit.read'],
      concernCategories: 'all',
      restrictions: [
        'Read-only access for house records.',
        'Cannot create, edit, or delete records.',
        'Concern status updates are disabled for this role.',
      ],
    },
  };

  private readonly concernStatusFlow: Record<ConcernStatus, ConcernStatus> = {
    New: 'In Review',
    'In Review': 'Assigned',
    Assigned: 'Monitoring',
    Monitoring: 'Pending Response',
    'Pending Response': 'Received',
    Received: 'Received',
  };

  concernsExpanded = false;
  searchTerm = '';
  phaseFilter: FilterPhase = 'all';
  statusFilter: FilterStatus = 'all';
  sortField: SortField = 'block-lot';
  sortDirection: SortDirection = 'asc';

  formMode: RecordFormMode = 'view';
  houseForm: HouseFormModel = this.createEmptyForm();
  formError = '';
  deleteConfirmationOpen = false;

  auditScope: AuditScope = 'selected';
  auditLogs: AuditLogEntry[] = [];
  private nextAuditId = 1;

  houses: HouseRecord[] = [
    this.createHouse('Phase 1', 1, 1, 'owner', 'Mario Dela Cruz', '0917-810-1001', 'Jan 14, 2018', 'Association dues updated.'),
    this.createHouse('Phase 1', 1, 2, 'renter', 'Angela Ramos', '0917-810-1002', 'Aug 02, 2023', 'Tenant under 1-year lease.'),
    this.createHouse('Phase 1', 1, 3, 'vacant', 'No current occupant', 'N/A', 'N/A', 'Available for occupancy.'),
    this.createHouse('Phase 1', 1, 4, 'pending', 'Pending verification', 'N/A', 'N/A', 'Documents under review.'),
    this.createHouse('Phase 1', 1, 5, 'owner', 'Ramon Bautista', '0917-810-1005', 'Mar 19, 2019', 'Senior resident household.'),
    this.createHouse('Phase 1', 2, 6, 'renter', 'Jessa Enriquez', '0917-810-1006', 'Sep 11, 2024', 'Newly registered tenant.'),
    this.createHouse('Phase 1', 2, 7, 'vacant', 'No current occupant', 'N/A', 'N/A', 'House listed for rent.'),
    this.createHouse('Phase 1', 2, 8, 'pending', 'Pending verification', 'N/A', 'N/A', 'Awaiting owner confirmation.'),
    this.createHouse('Phase 1', 2, 9, 'owner', 'Lourdes Manaloto', '0917-810-1009', 'Jun 08, 2017', 'Corner property.'),
    this.createHouse('Phase 1', 2, 10, 'renter', 'Paolo Fernandez', '0917-810-1010', 'Apr 25, 2022', 'Family of four.'),
    this.createHouse('Phase 1', 3, 11, 'vacant', 'No current occupant', 'N/A', 'N/A', 'Recently vacated.'),
    this.createHouse('Phase 1', 3, 12, 'pending', 'Pending verification', 'N/A', 'N/A', 'Transfer request in process.'),
    this.createHouse('Phase 1', 3, 13, 'owner', 'Cynthia Navarro', '0917-810-1013', 'Nov 30, 2016', 'Active in HOA meetings.'),
    this.createHouse('Phase 1', 3, 14, 'renter', 'Victor Samonte', '0917-810-1014', 'Feb 12, 2025', 'Updated resident profile pending ID upload.'),
    this.createHouse('Phase 1', 3, 15, 'vacant', 'No current occupant', 'N/A', 'N/A', 'House maintenance scheduled.'),
    this.createHouse('Phase 1', 4, 16, 'pending', 'Pending verification', 'N/A', 'N/A', 'Awaiting signed occupancy form.'),
    this.createHouse('Phase 1', 4, 17, 'owner', 'Rosario Lim', '0917-810-1017', 'May 21, 2020', 'Updated emergency contact on file.'),
    this.createHouse('Phase 1', 4, 18, 'renter', 'Dennis Fajardo', '0917-810-1018', 'Jul 09, 2021', 'Tenant endorsed by unit owner.'),
    this.createHouse('Phase 1', 4, 19, 'vacant', 'No current occupant', 'N/A', 'N/A', 'Ready for viewing.'),
    this.createHouse('Phase 1', 4, 20, 'pending', 'Pending verification', 'N/A', 'N/A', 'Barangay clearance requested.'),
    this.createHouse('Phase 2', 5, 1, 'owner', 'Evelyn Santos', '0917-820-2001', 'Apr 03, 2015', 'Long-term resident.'),
    this.createHouse('Phase 2', 5, 2, 'renter', 'Harold Mendoza', '0917-820-2002', 'Dec 18, 2022', 'Tenant with parking pass.'),
    this.createHouse('Phase 2', 5, 3, 'vacant', 'No current occupant', 'N/A', 'N/A', 'Owner abroad.'),
    this.createHouse('Phase 2', 5, 4, 'pending', 'Pending verification', 'N/A', 'N/A', 'Registration awaiting HOA approval.'),
    this.createHouse('Phase 2', 5, 5, 'owner', 'Joel Sarmiento', '0917-820-2005', 'Oct 10, 2018', 'Complete resident profile.'),
    this.createHouse('Phase 2', 6, 6, 'renter', 'Mica Villanueva', '0917-820-2006', 'Mar 07, 2024', 'Recent utility account update.'),
    this.createHouse('Phase 2', 6, 7, 'vacant', 'No current occupant', 'N/A', 'N/A', 'Available for sale.'),
    this.createHouse('Phase 2', 6, 8, 'pending', 'Pending verification', 'N/A', 'N/A', 'Submitted proof of billing.'),
    this.createHouse('Phase 2', 6, 9, 'owner', 'Nestor Aguas', '0917-820-2009', 'Jun 16, 2019', 'Lives with two dependents.'),
    this.createHouse('Phase 2', 6, 10, 'renter', 'Kate Aquino', '0917-820-2010', 'Jan 13, 2025', 'Temporary access card issued.'),
    this.createHouse('Phase 2', 7, 11, 'vacant', 'No current occupant', 'N/A', 'N/A', 'Interior repair ongoing.'),
    this.createHouse('Phase 2', 7, 12, 'pending', 'Pending verification', 'N/A', 'N/A', 'Occupant interview scheduled.'),
    this.createHouse('Phase 2', 7, 13, 'owner', 'Bernadette Cruz', '0917-820-2013', 'Feb 28, 2017', 'Updated vehicle sticker info.'),
    this.createHouse('Phase 2', 7, 14, 'renter', 'Leo Panganiban', '0917-820-2014', 'May 05, 2023', 'Tenant endorsed by broker.'),
    this.createHouse('Phase 2', 7, 15, 'vacant', 'No current occupant', 'N/A', 'N/A', 'Ready for new application.'),
    this.createHouse('Phase 2', 8, 16, 'pending', 'Pending verification', 'N/A', 'N/A', 'Supporting IDs incomplete.'),
    this.createHouse('Phase 2', 8, 17, 'owner', 'Faith Corpuz', '0917-820-2017', 'Sep 22, 2020', 'Updated household member list.'),
    this.createHouse('Phase 2', 8, 18, 'renter', 'Gilbert Ortega', '0917-820-2018', 'Nov 14, 2021', 'Renewal due next quarter.'),
    this.createHouse('Phase 2', 8, 19, 'vacant', 'No current occupant', 'N/A', 'N/A', 'Unit under repainting.'),
    this.createHouse('Phase 2', 8, 20, 'pending', 'N/A', 'N/A', 'N/A', 'Final check by admin pending.'),
  ];

  selectedHouseId: string | null = this.houses[0]?.id ?? null;

  private readonly fallbackHouse: HouseRecord = {
    id: 'no-selection',
    phase: 'Phase 1',
    block: 0,
    lot: 0,
    residentName: 'No resident selected',
    status: 'vacant',
    contactNumber: 'N/A',
    moveInDate: 'N/A',
    remarks: 'Select or add a house record.',
  };

  get allHouses(): HouseRecord[] {
    return this.houses;
  }

  get activeRoleProfile(): RoleAccessProfile {
    return this.roleAccessProfiles[this.selectedOfficerRole];
  }

  get canCreateHouse(): boolean {
    return this.hasPermission('houses.create');
  }

  get canEditHouse(): boolean {
    return this.hasPermission('houses.update');
  }

  get canDeleteHouse(): boolean {
    return this.hasPermission('houses.delete');
  }

  get canManageConcerns(): boolean {
    return this.hasPermission('concerns.manage');
  }

  get concernScopeLabel(): string {
    if (!this.canAccessModule('concerns')) {
      return 'No concerns access.';
    }

    if (this.activeRoleProfile.concernCategories === 'all') {
      return 'All concern categories';
    }

    return `Categories: ${this.activeRoleProfile.concernCategories.join(', ')}`;
  }

  get accessibleMenus(): Array<{ id: DashboardModule; label: string }> {
    return this.activeRoleProfile.modules.map((module) => ({
      id: module,
      label: this.getModuleLabel(module),
    }));
  }

  get selectedRoleRestrictions(): string[] {
    return this.activeRoleProfile.restrictions;
  }

  get restrictionTierLabel(): string {
    return `Restriction Tier ${this.activeRoleProfile.restrictionLevel} of 8`;
  }

  get roleWidgets(): RoleWidget[] {
    switch (this.selectedOfficerRole) {
      case 'President':
        return [
          {
            label: 'Governance Queue',
            value: `${this.pendingCount + this.getUnresolvedConcernCount()}`,
            note: 'Pending occupancy records + unresolved concerns',
          },
          {
            label: 'Escalation Cases',
            value: `${this.getConcernCountByStatuses(['New', 'Pending Response'])}`,
            note: 'Cases that usually need final executive review',
          },
          {
            label: 'Actions Logged Today',
            value: `${this.getAuditCountForDate(new Date())}`,
            note: 'Create/update/delete actions recorded today',
          },
        ];
      case 'VP':
        return [
          {
            label: 'Operational Load',
            value: `${this.getConcernCountByStatuses(['In Review', 'Assigned', 'Monitoring'])}`,
            note: 'Concerns currently in active handling stages',
          },
          {
            label: 'Records Pending Validation',
            value: `${this.pendingCount}`,
            note: 'House records that still require verification',
          },
          {
            label: 'Resolved Concern Ratio',
            value: this.getConcernResolutionRatio(),
            note: 'Received concerns compared to total concerns',
          },
        ];
      case 'Secretary':
        return [
          {
            label: 'Documentation Backlog',
            value: `${this.pendingCount + this.getConcernCountByStatuses(['Pending Response'])}`,
            note: 'Pending records plus concerns awaiting resident response',
          },
          {
            label: 'Profiles Missing Contacts',
            value: `${this.getHouseCountWithMissingContacts()}`,
            note: 'Resident profiles with incomplete contact data',
          },
          {
            label: 'Recent Move-ins',
            value: `${this.getRecentMoveInCount(2024)}`,
            note: 'Households with move-in year 2024 and later',
          },
        ];
      case 'Treasurer':
        return [
          {
            label: 'Billing Concerns',
            value: `${this.getConcernCountByCategory('Billing')}`,
            note: 'Concerns that may impact dues and collections',
          },
          {
            label: 'Maintenance Cost Signals',
            value: `${this.getConcernCountByCategory('Maintenance')}`,
            note: 'Maintenance issues with potential budget impact',
          },
          {
            label: 'Dues-Tagged Homes',
            value: `${this.getDuesTaggedHomesCount()}`,
            note: 'House records mentioning dues, billing, or payment follow-up',
          },
        ];
      case 'Assistant Secretary':
        return [
          {
            label: 'Data Entry Queue',
            value: `${this.pendingCount + this.getHouseCountWithMissingContacts()}`,
            note: 'Pending records plus profiles missing contact details',
          },
          {
            label: 'Records Updated',
            value: `${this.getAuditCountByAction('Updated')}`,
            note: 'Update actions captured in the current session log',
          },
          {
            label: 'Concerns Awaiting Assignment',
            value: `${this.getConcernCountByStatuses(['In Review'])}`,
            note: 'Concerns still waiting to be assigned',
          },
        ];
      case 'BOD':
        return [
          {
            label: 'Oversight Alerts',
            value: `${this.pendingCount + this.vacantCount}`,
            note: 'Pending approvals plus currently vacant units',
          },
          {
            label: 'Executive Decisions Tracked',
            value: `${this.getAuditCountByActions(['Created', 'Updated', 'Deleted'])}`,
            note: 'Total governance-relevant record actions logged',
          },
          {
            label: 'Monthly Activity Coverage',
            value: `${this.getAuditCountForMonth(new Date())}`,
            note: 'Audit entries recorded during the current month',
          },
        ];
      case 'Peace and Order':
        return [
          {
            label: 'Security Scope Cases',
            value: `${this.getConcernCountByCategories(['Security', 'Gate Access', 'Visitor / Delivery', 'Parking'])}`,
            note: 'All concerns within security and access categories',
          },
          {
            label: 'Open Security Cases',
            value: `${this.getConcernCountByStatusesAndCategories(['New', 'In Review', 'Assigned', 'Monitoring', 'Pending Response'], ['Security', 'Gate Access', 'Visitor / Delivery', 'Parking'])}`,
            note: 'Security-related concerns not yet marked as received',
          },
          {
            label: 'Gate Access Incidents',
            value: `${this.getConcernCountByCategory('Gate Access')}`,
            note: 'Focused count for checkpoint and access-related reports',
          },
        ];
      case 'Auditor':
        return [
          {
            label: 'Audit Entries Logged',
            value: `${this.auditLogs.length}`,
            note: 'All activity entries currently tracked in dashboard session',
          },
          {
            label: 'Deletion Events',
            value: `${this.getAuditCountByAction('Deleted')}`,
            note: 'Records removed during this session',
          },
          {
            label: 'High-Risk Change Events',
            value: `${this.getAuditCountByActions(['Updated', 'Deleted'])}`,
            note: 'Combined update and deletion actions for review',
          },
        ];
    }
  }

  get selectedHouse(): HouseRecord {
    return this.getSelectedHouseRecord() ?? this.fallbackHouse;
  }

  get hasSelectedHouse(): boolean {
    return this.getSelectedHouseRecord() !== null;
  }

  get totalHomes(): number {
    return this.allHouses.length;
  }

  get phase1TotalHomes(): number {
    return this.allHouses.filter((house) => house.phase === 'Phase 1').length;
  }

  get phase2TotalHomes(): number {
    return this.allHouses.filter((house) => house.phase === 'Phase 2').length;
  }

  get ownerCount(): number {
    return this.countByStatus('owner');
  }

  get renterCount(): number {
    return this.countByStatus('renter');
  }

  get vacantCount(): number {
    return this.countByStatus('vacant');
  }

  get pendingCount(): number {
    return this.countByStatus('pending');
  }

  get occupiedCount(): number {
    return this.ownerCount + this.renterCount;
  }

  get occupancyRate(): string {
    if (!this.totalHomes) {
      return '0%';
    }

    return `${Math.round((this.occupiedCount / this.totalHomes) * 100)}%`;
  }

  get occupancyRateValue(): number {
    if (!this.totalHomes) {
      return 0;
    }

    return Math.round((this.occupiedCount / this.totalHomes) * 100);
  }

  get statCards(): StatCard[] {
    return [
      {
        label: 'Total Homes',
        value: `${this.totalHomes}`,
        accent: 'household',
        note: 'Across Phase 1 and Phase 2',
      },
      {
        label: 'Owner-Occupied',
        value: `${this.ownerCount}`,
        accent: 'owner',
        note: `${this.ownerShare} of all homes`,
      },
      {
        label: 'Tenant-Occupied',
        value: `${this.renterCount}`,
        accent: 'renter',
        note: `${this.tenantShare} of all homes`,
      },
      {
        label: 'Vacant Units',
        value: `${this.vacantCount}`,
        accent: 'vacant',
        note: 'Ready for viewing or turnover',
      },
      {
        label: 'Pending Approvals',
        value: `${this.pendingCount}`,
        accent: 'pending',
        note: 'For admin review and validation',
      },
      {
        label: 'Occupied Rate',
        value: this.occupancyRate,
        accent: 'rate',
        note: `${this.occupiedCount} currently occupied`,
      },
    ];
  }

  get phaseSummaries(): PhaseSummary[] {
    return this.phaseOptions.map((phase) => {
      const houses = this.allHouses.filter((house) => house.phase === phase);
      return {
        phase,
        totalHomes: houses.length,
        occupiedHomes: houses.filter((house) => house.status === 'owner' || house.status === 'renter').length,
        tenantHomes: houses.filter((house) => house.status === 'renter').length,
        vacantHomes: houses.filter((house) => house.status === 'vacant').length,
        pendingHomes: houses.filter((house) => house.status === 'pending').length,
      };
    });
  }

  get ownerShare(): string {
    return this.getPercent(this.ownerCount);
  }

  get tenantShare(): string {
    return this.getPercent(this.renterCount);
  }

  get filteredSortedHouses(): HouseRecord[] {
    const normalizedSearch = this.searchTerm.trim().toLowerCase();
    const filtered = this.allHouses.filter((house) => {
      const matchesPhase = this.phaseFilter === 'all' || house.phase === this.phaseFilter;
      const matchesStatus = this.statusFilter === 'all' || house.status === this.statusFilter;
      const matchesSearch = !normalizedSearch || this.getHouseSearchValue(house).includes(normalizedSearch);
      return matchesPhase && matchesStatus && matchesSearch;
    });

    return filtered.sort((first, second) => {
      const compareValue = this.compareHouses(first, second);
      return this.sortDirection === 'asc' ? compareValue : compareValue * -1;
    });
  }

  get filteredPhase1Houses(): HouseRecord[] {
    return this.filteredSortedHouses.filter((house) => house.phase === 'Phase 1');
  }

  get filteredPhase2Houses(): HouseRecord[] {
    return this.filteredSortedHouses.filter((house) => house.phase === 'Phase 2');
  }

  get visibleConcerns() {
    const concerns = this.roleScopedConcerns;
    return this.concernsExpanded ? concerns : concerns.slice(0, 3);
  }

  get visibleAuditLogs(): AuditLogEntry[] {
    const logs = this.auditScope === 'selected' && this.selectedHouseId
      ? this.auditLogs.filter((entry) => entry.houseId === this.selectedHouseId)
      : this.auditLogs;

    return logs.slice(0, 12);
  }

  toggleConcerns(): void {
    this.concernsExpanded = !this.concernsExpanded;
  }

  setOfficerRole(role: OfficerRole): void {
    this.selectedOfficerRole = role;
    this.concernsExpanded = false;
    this.formMode = 'view';
    this.formError = '';
    this.deleteConfirmationOpen = false;
  }

  canAccessModule(module: DashboardModule): boolean {
    return this.activeRoleProfile.modules.includes(module);
  }

  advanceConcernStatus(concern: ConcernItem): void {
    if (!this.canManageConcerns || !this.canAccessModule('concerns')) {
      return;
    }

    if (this.activeRoleProfile.concernCategories !== 'all' && !this.activeRoleProfile.concernCategories.includes(concern.category)) {
      return;
    }

    concern.status = this.concernStatusFlow[concern.status];
  }

  selectHouse(house: HouseRecord): void {
    this.selectedHouseId = house.id;
    this.formMode = 'view';
    this.formError = '';
    this.deleteConfirmationOpen = false;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.phaseFilter = 'all';
    this.statusFilter = 'all';
    this.sortField = 'block-lot';
    this.sortDirection = 'asc';
  }

  beginCreateHouse(): void {
    if (!this.canCreateHouse) {
      this.formError = 'Current role has no permission to create records.';
      return;
    }

    this.formMode = 'create';
    this.formError = '';
    this.deleteConfirmationOpen = false;
    this.houseForm = this.createEmptyForm();
    if (this.phaseFilter !== 'all') {
      this.houseForm.phase = this.phaseFilter;
    }
  }

  beginEditSelectedHouse(): void {
    if (!this.canEditHouse) {
      this.formError = 'Current role has no permission to edit records.';
      return;
    }

    const selected = this.getSelectedHouseRecord();
    if (!selected) {
      return;
    }

    this.formMode = 'edit';
    this.formError = '';
    this.deleteConfirmationOpen = false;
    this.houseForm = {
      phase: selected.phase,
      block: selected.block,
      lot: selected.lot,
      residentName: selected.residentName,
      status: selected.status,
      contactNumber: selected.contactNumber,
      moveInDate: selected.moveInDate,
      remarks: selected.remarks,
    };
  }

  saveHouse(): void {
    if (this.formMode === 'create' && !this.canCreateHouse) {
      this.formError = 'Current role has no permission to create records.';
      return;
    }

    if (this.formMode === 'edit' && !this.canEditHouse) {
      this.formError = 'Current role has no permission to edit records.';
      return;
    }

    const normalizedForm = this.normalizeHouseForm();
    if (!normalizedForm) {
      return;
    }

    if (this.formMode === 'create') {
      const createdHouse: HouseRecord = {
        id: this.createGeneratedHouseId(normalizedForm.phase, normalizedForm.block, normalizedForm.lot),
        ...normalizedForm,
      };

      this.houses = [...this.houses, createdHouse];
      this.selectedHouseId = createdHouse.id;
      this.addAuditEntry('Created', createdHouse, `Added record for ${createdHouse.residentName}.`);
      this.auditScope = 'selected';
      this.formMode = 'view';
      return;
    }

    const selected = this.getSelectedHouseRecord();
    if (!selected) {
      this.formError = 'Select a house record before editing.';
      return;
    }

    const updatedHouse: HouseRecord = {
      ...selected,
      ...normalizedForm,
    };

    this.houses = this.houses.map((house) => (house.id === selected.id ? updatedHouse : house));
    this.selectedHouseId = updatedHouse.id;
    this.addAuditEntry('Updated', updatedHouse, this.buildUpdateSummary(selected, updatedHouse));
    this.auditScope = 'selected';
    this.formMode = 'view';
  }

  cancelForm(): void {
    this.formMode = 'view';
    this.formError = '';
  }

  requestDeleteSelectedHouse(): void {
    if (!this.canDeleteHouse) {
      this.formError = 'Current role has no permission to delete records.';
      return;
    }

    if (!this.hasSelectedHouse) {
      return;
    }

    this.deleteConfirmationOpen = true;
    this.formMode = 'view';
    this.formError = '';
  }

  cancelDeleteSelectedHouse(): void {
    this.deleteConfirmationOpen = false;
  }

  confirmDeleteSelectedHouse(): void {
    if (!this.canDeleteHouse) {
      this.formError = 'Current role has no permission to delete records.';
      this.deleteConfirmationOpen = false;
      return;
    }

    const selected = this.getSelectedHouseRecord();
    if (!selected) {
      return;
    }

    this.houses = this.houses.filter((house) => house.id !== selected.id);
    this.addAuditEntry('Deleted', selected, `Deleted record for ${selected.residentName}.`);
    this.deleteConfirmationOpen = false;

    if (!this.houses.length) {
      this.selectedHouseId = null;
      return;
    }

    const fallback = this.houses.find((house) => house.phase === selected.phase) ?? this.houses[0];
    this.selectedHouseId = fallback.id;
  }

  getStatusLabel(status: OccupancyStatus): string {
    switch (status) {
      case 'owner':
        return 'Owner-Occupied';
      case 'renter':
        return 'Tenant-Occupied';
      case 'vacant':
        return 'Vacant';
      case 'pending':
        return 'Pending';
    }
  }

  getPhaseOccupancyRate(summary: PhaseSummary): string {
    if (!summary.totalHomes) {
      return '0%';
    }

    return `${Math.round((summary.occupiedHomes / summary.totalHomes) * 100)}%`;
  }

  formatAuditTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleString('en-PH', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  private getSelectedHouseRecord(): HouseRecord | null {
    if (!this.selectedHouseId) {
      return null;
    }

    return this.houses.find((house) => house.id === this.selectedHouseId) ?? null;
  }

  private get roleScopedConcerns(): ConcernItem[] {
    if (!this.canAccessModule('concerns') || !this.hasPermission('concerns.read')) {
      return [];
    }

    if (this.activeRoleProfile.concernCategories === 'all') {
      return this.residentConcerns;
    }

    return this.residentConcerns.filter((concern) => this.activeRoleProfile.concernCategories.includes(concern.category));
  }

  private hasPermission(permission: DashboardPermission): boolean {
    return this.activeRoleProfile.permissions.includes(permission);
  }

  private getModuleLabel(module: DashboardModule): string {
    switch (module) {
      case 'overview':
        return 'Overview';
      case 'concerns':
        return 'Concerns';
      case 'house-records':
        return 'House Records';
      case 'audit':
        return 'Audit Log';
    }
  }

  private getUnresolvedConcernCount(): number {
    return this.residentConcerns.filter((concern) => concern.status !== 'Received').length;
  }

  private getConcernCountByCategory(category: ConcernCategory): number {
    return this.residentConcerns.filter((concern) => concern.category === category).length;
  }

  private getConcernCountByCategories(categories: ConcernCategory[]): number {
    return this.residentConcerns.filter((concern) => categories.includes(concern.category)).length;
  }

  private getConcernCountByStatuses(statuses: ConcernStatus[]): number {
    return this.residentConcerns.filter((concern) => statuses.includes(concern.status)).length;
  }

  private getConcernCountByStatusesAndCategories(statuses: ConcernStatus[], categories: ConcernCategory[]): number {
    return this.residentConcerns.filter(
      (concern) => statuses.includes(concern.status) && categories.includes(concern.category),
    ).length;
  }

  private getConcernResolutionRatio(): string {
    if (!this.residentConcerns.length) {
      return '0%';
    }

    const resolvedCount = this.getConcernCountByStatuses(['Received']);
    return `${Math.round((resolvedCount / this.residentConcerns.length) * 100)}%`;
  }

  private getHouseCountWithMissingContacts(): number {
    return this.houses.filter((house) => house.contactNumber.trim().toUpperCase() === 'N/A').length;
  }

  private getRecentMoveInCount(minYear: number): number {
    return this.houses.filter((house) => {
      const parsedDate = this.parseMoveInDate(house.moveInDate);
      if (parsedDate === null) {
        return false;
      }
      return new Date(parsedDate).getFullYear() >= minYear;
    }).length;
  }

  private getDuesTaggedHomesCount(): number {
    return this.houses.filter((house) => {
      const remarks = house.remarks.toLowerCase();
      return remarks.includes('dues') || remarks.includes('billing') || remarks.includes('payment');
    }).length;
  }

  private getAuditCountForDate(date: Date): number {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    return this.auditLogs.filter((entry) => {
      const stamp = new Date(entry.timestamp);
      return stamp.getFullYear() === year && stamp.getMonth() === month && stamp.getDate() === day;
    }).length;
  }

  private getAuditCountForMonth(date: Date): number {
    const year = date.getFullYear();
    const month = date.getMonth();

    return this.auditLogs.filter((entry) => {
      const stamp = new Date(entry.timestamp);
      return stamp.getFullYear() === year && stamp.getMonth() === month;
    }).length;
  }

  private getAuditCountByAction(action: AuditAction): number {
    return this.auditLogs.filter((entry) => entry.action === action).length;
  }

  private getAuditCountByActions(actions: AuditAction[]): number {
    return this.auditLogs.filter((entry) => actions.includes(entry.action)).length;
  }

  private normalizeHouseForm(): Omit<HouseRecord, 'id'> | null {
    this.formError = '';

    if (this.houseForm.block === null || this.houseForm.block < 1) {
      this.formError = 'Block number must be 1 or higher.';
      return null;
    }

    if (this.houseForm.lot === null || this.houseForm.lot < 1) {
      this.formError = 'Lot number must be 1 or higher.';
      return null;
    }

    const residentName = this.houseForm.residentName.trim();
    const contactNumber = this.houseForm.contactNumber.trim();
    const moveInDate = this.houseForm.moveInDate.trim();
    const remarks = this.houseForm.remarks.trim();

    if (!residentName) {
      this.formError = 'Resident name is required.';
      return null;
    }

    if (!contactNumber) {
      this.formError = 'Contact number is required.';
      return null;
    }

    if (!moveInDate) {
      this.formError = 'Move-in date is required.';
      return null;
    }

    if (!remarks) {
      this.formError = 'Remarks are required.';
      return null;
    }

    return {
      phase: this.houseForm.phase,
      block: this.houseForm.block,
      lot: this.houseForm.lot,
      residentName,
      status: this.houseForm.status,
      contactNumber,
      moveInDate,
      remarks,
    };
  }

  private createEmptyForm(): HouseFormModel {
    return {
      phase: 'Phase 1',
      block: null,
      lot: null,
      residentName: '',
      status: 'pending',
      contactNumber: '',
      moveInDate: '',
      remarks: '',
    };
  }

  private createGeneratedHouseId(phase: HouseRecord['phase'], block: number, lot: number): string {
    return `${phase.toLowerCase().replace(' ', '-')}-b${block}-l${lot}-${Date.now().toString(36)}`;
  }

  private addAuditEntry(action: AuditAction, house: HouseRecord, summary: string): void {
    const entry: AuditLogEntry = {
      id: `audit-${this.nextAuditId++}`,
      timestamp: new Date().toISOString(),
      action,
      houseId: house.id,
      location: `${house.phase} | Block ${house.block} Lot ${house.lot}`,
      summary,
    };

    this.auditLogs = [entry, ...this.auditLogs].slice(0, 120);
  }

  private buildUpdateSummary(previous: HouseRecord, updated: HouseRecord): string {
    const changedFields: string[] = [];

    if (previous.phase !== updated.phase) {
      changedFields.push(`phase (${previous.phase} to ${updated.phase})`);
    }

    if (previous.block !== updated.block || previous.lot !== updated.lot) {
      changedFields.push(`location (B${previous.block}L${previous.lot} to B${updated.block}L${updated.lot})`);
    }

    if (previous.status !== updated.status) {
      changedFields.push(`status (${this.getStatusLabel(previous.status)} to ${this.getStatusLabel(updated.status)})`);
    }

    if (previous.residentName !== updated.residentName) {
      changedFields.push('resident name');
    }

    if (previous.contactNumber !== updated.contactNumber) {
      changedFields.push('contact number');
    }

    if (previous.moveInDate !== updated.moveInDate) {
      changedFields.push('move-in date');
    }

    if (previous.remarks !== updated.remarks) {
      changedFields.push('remarks');
    }

    if (!changedFields.length) {
      return `Saved ${updated.residentName} without changing field values.`;
    }

    return `Updated ${updated.residentName}: ${changedFields.join(', ')}.`;
  }

  private getPercent(count: number): string {
    if (!this.totalHomes) {
      return '0%';
    }

    return `${Math.round((count / this.totalHomes) * 100)}%`;
  }

  private countByStatus(status: OccupancyStatus): number {
    return this.allHouses.filter((house) => house.status === status).length;
  }

  private getHouseSearchValue(house: HouseRecord): string {
    return [
      house.phase,
      `block ${house.block}`,
      `lot ${house.lot}`,
      `block ${house.block} lot ${house.lot}`,
      house.residentName,
      house.contactNumber,
      house.moveInDate,
      house.remarks,
      house.status,
    ]
      .join(' ')
      .toLowerCase();
  }

  private compareHouses(first: HouseRecord, second: HouseRecord): number {
    switch (this.sortField) {
      case 'resident':
        return first.residentName.localeCompare(second.residentName);
      case 'status':
        return this.getStatusOrder(first.status) - this.getStatusOrder(second.status);
      case 'move-in':
        return this.compareMoveInDates(first.moveInDate, second.moveInDate);
      case 'block-lot':
        if (first.block !== second.block) {
          return first.block - second.block;
        }
        return first.lot - second.lot;
    }
  }

  private compareMoveInDates(firstDate: string, secondDate: string): number {
    const first = this.parseMoveInDate(firstDate);
    const second = this.parseMoveInDate(secondDate);

    if (first === null && second === null) {
      return 0;
    }

    if (first === null) {
      return 1;
    }

    if (second === null) {
      return -1;
    }

    return first - second;
  }

  private parseMoveInDate(rawDate: string): number | null {
    const parsedDate = Date.parse(rawDate);
    return Number.isNaN(parsedDate) ? null : parsedDate;
  }

  private getStatusOrder(status: OccupancyStatus): number {
    switch (status) {
      case 'owner':
        return 1;
      case 'renter':
        return 2;
      case 'pending':
        return 3;
      case 'vacant':
        return 4;
    }
  }

  private createHouse(
    phase: HouseRecord['phase'],
    block: number,
    lot: number,
    status: OccupancyStatus,
    residentName: string,
    contactNumber: string,
    moveInDate: string,
    remarks: string,
  ): HouseRecord {
    return {
      id: `${phase.toLowerCase().replace(' ', '-')}-b${block}-l${lot}`,
      phase,
      block,
      lot,
      residentName,
      status,
      contactNumber,
      moveInDate,
      remarks,
    };
  }
}
