import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/core/services/settings.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {

  constructor(private settingService: SettingsService) { }
  breadCrumbItems: Array<{}>;
  generalSettingsForm: FormGroup;

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Settings' }, { label: 'General', active: true }];

    this.generalSettingsForm = new FormGroup({
      credit_card_fees: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/), Validators.min(0)]),
      compulsory_deposit_rate: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/), Validators.min(0), Validators.max(100)]),
      compulsory_deposit_update_for: new FormControl('all', Validators.required),
      recurring_deposit_rate: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/), Validators.min(0), Validators.max(100)]),
      recurring_deposit_update_for: new FormControl('all', Validators.required),
      fixed_deposit_rate: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/), Validators.min(0), Validators.max(100)]),
      fixed_deposit_update_for: new FormControl('all', Validators.required),
      loan_rate: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/), Validators.min(0), Validators.max(100)]),
      loan_update_for: new FormControl('all', Validators.required),
      sahyog_card_rate: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/), Validators.min(0), Validators.max(100)]),
      sahyog_card_update_for: new FormControl('all', Validators.required),
    });
    this.getGeneralSettings();
  }

  onSubmit() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You are about to update the general settings. Type UPDATE to confirm.",
      icon: 'warning',
      input: 'text',
      inputPlaceholder: 'Type UPDATE to confirm',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel!',
      preConfirm: (inputValue) => {
        if (inputValue !== 'UPDATE') {
          Swal.showValidationMessage('You must type UPDATE to confirm.');
          return false;
        }
        return true;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.generalSettingsForm.invalid) {
          this.generalSettingsForm.markAllAsTouched();
          this.generalSettingsForm.markAsDirty();
          return;
        }
        this.settingService.upsertGeneralSettings(this.generalSettingsForm.value).subscribe((res: any) => {
          Swal.fire({
            title: 'Success',
            text: 'General settings updated successfully',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        }, (err: any) => {
          Swal.fire({
            title: 'Error',
            text: err.error.message || 'Failed to update general settings',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });
      }
    });
  }

  getGeneralSettings() {
    this.settingService.getGeneralSettings().subscribe((res: any) => {
      this.generalSettingsForm.patchValue(res.data.generalSettings);
    }, (err: any) => {
      Swal.fire({
        title: 'Error',
        text: err.error.message || 'Failed to fetch general settings',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
  }



}
