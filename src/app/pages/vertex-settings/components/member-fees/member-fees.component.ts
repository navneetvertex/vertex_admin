import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SettingsService } from 'src/app/core/services/settings.service';

@Component({
  selector: 'app-member-fees',
  templateUrl: './member-fees.component.html',
  styleUrls: ['./member-fees.component.scss']
})
export class MemberFeesComponent implements OnInit {

  constructor(private settings: SettingsService,
    private toast: ToastrService
  ) { }
  breadCrumbItems: Array<{}>;
  memberFeesFormGroup: FormGroup

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Settings' }, { label: 'General', active: true }];
    this.getMemberFees();
    this.memberFeesFormGroup = new FormGroup({
      shared_money: new FormControl('0', [Validators.required, Validators.min(0)]),
      compulsory_deposit: new FormControl('0', [Validators.required, Validators.min(0)]),
      admission_fees: new FormControl('0', [Validators.required, Validators.min(0)]),
      building_fund: new FormControl('0', [Validators.required, Validators.min(0)]),
      welfare_fund: new FormControl('0', [Validators.required, Validators.min(0)]),
      other_deposit: new FormControl('0', [Validators.required, Validators.min(0)])
    });
  }

  onSubmit() {
    if (this.memberFeesFormGroup.invalid) {
      this.memberFeesFormGroup.markAllAsTouched();
      this.memberFeesFormGroup.markAsDirty();
      return;
    }
    this.settings.memberFees(this.memberFeesFormGroup.value).subscribe((res: any) => {
      this.toast.success('Member fees updated successfully', 'Success');
    }, (err: any) => {
        this.toast.error(err.error.message || 'Failed to update member fees', 'Error');
      }
    );
  }

  getMemberFees() {
    this.settings.getMemberFees().subscribe((res: any) => {
      this.memberFeesFormGroup.patchValue(res.data.memberFees);
    })
  }

  number(num: string): number {
    return Number(num)

  }

}
