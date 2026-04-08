import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { concernCategories } from '../../shared/concerns';

@Component({
  selector: 'app-submit-concern',
  imports: [RouterLink],
  templateUrl: './submit-concern.html',
  styleUrl: './submit-concern.scss',
})
export class SubmitConcern {
  private readonly route = inject(ActivatedRoute);

  readonly categories = concernCategories;
  readonly selectedRole = this.getSelectedRole();
  readonly returnRoute = this.selectedRole === 'Renter' ? '/renter-dashboard' : '/owner-dashboard';
  readonly returnLabel = this.selectedRole === 'Renter' ? 'Back to Renter Dashboard' : 'Back to Owner Dashboard';

  private getSelectedRole(): 'Owner' | 'Renter' {
    const role = this.route.snapshot.queryParamMap.get('role');
    return role === 'renter' ? 'Renter' : 'Owner';
  }
}
