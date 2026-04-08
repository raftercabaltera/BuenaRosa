import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { mockConcerns } from '../../shared/concerns';

type OccupancyStatus = 'owner' | 'renter' | 'vacant' | 'pending';

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

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  readonly residentConcerns = mockConcerns;
  concernsExpanded = false;

  readonly phase1Houses: HouseRecord[] = [
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
  ];

  readonly phase2Houses: HouseRecord[] = [
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

  selectedHouse: HouseRecord = this.phase1Houses[0];

  get allHouses(): HouseRecord[] {
    return [...this.phase1Houses, ...this.phase2Houses];
  }

  get totalHomes(): number {
    return this.allHouses.length;
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
    return `${Math.round((this.occupiedCount / this.totalHomes) * 100)}%`;
  }

  get occupancyRateValue(): number {
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
    return [this.phase1Houses, this.phase2Houses].map((houses) => ({
      phase: houses[0].phase,
      totalHomes: houses.length,
      occupiedHomes: houses.filter((house) => house.status === 'owner' || house.status === 'renter').length,
      tenantHomes: houses.filter((house) => house.status === 'renter').length,
      vacantHomes: houses.filter((house) => house.status === 'vacant').length,
      pendingHomes: houses.filter((house) => house.status === 'pending').length,
    }));
  }

  get ownerShare(): string {
    return this.getPercent(this.ownerCount);
  }

  get tenantShare(): string {
    return this.getPercent(this.renterCount);
  }

  get vacantShare(): string {
    return this.getPercent(this.vacantCount);
  }

  get pendingShare(): string {
    return this.getPercent(this.pendingCount);
  }

  get occupiedSummaryLabel(): string {
    return `${this.ownerCount} owner-occupied and ${this.renterCount} tenant-occupied`;
  }

  get tenantSummaryLabel(): string {
    return `${this.renterCount} homes are currently rented`;
  }

  get tenantHighlights(): Array<{ label: string; value: string; note: string }> {
    return [
      {
        label: 'Tenant Share',
        value: this.tenantShare,
        note: 'Of the full subdivision inventory',
      },
      {
        label: 'Rented Across Phases',
        value: `${this.phaseSummaries.filter((summary) => summary.tenantHomes > 0).length}/2`,
        note: 'Both phases currently have tenant-occupied homes',
      },
      {
        label: 'Occupied Homes by Tenants',
        value: `${Math.round((this.renterCount / this.occupiedCount) * 100)}%`,
        note: 'Share of occupied homes under rental use',
      },
    ];
  }

  get openConcernCount(): number {
    return this.residentConcerns.length;
  }

  get visibleConcerns() {
    return this.concernsExpanded ? this.residentConcerns : this.residentConcerns.slice(0, 3);
  }

  toggleConcerns(): void {
    this.concernsExpanded = !this.concernsExpanded;
  }

  selectHouse(house: HouseRecord): void {
    this.selectedHouse = house;
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
    return `${Math.round((summary.occupiedHomes / summary.totalHomes) * 100)}%`;
  }

  private getPercent(count: number): string {
    return `${Math.round((count / this.totalHomes) * 100)}%`;
  }

  private countByStatus(status: OccupancyStatus): number {
    return this.allHouses.filter((house) => house.status === status).length;
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
