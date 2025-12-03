import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SubadminService } from 'src/app/core/services/subadmin.service';
import { MastersService } from 'src/app/core/services/masters.service';

@Component({
  selector: 'app-subadmin-add',
  templateUrl: './subadmin-add.component.html',
  styleUrls: ['./subadmin-add.component.scss']
})
export class SubadminAddComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  subAdminForm: FormGroup;
  isEditMode = false;
  subAdminId: string | null = null;
  states: any[] = [];
  districts: any[] = [];
  areas: any[] = [];

  constructor(
    private fb: FormBuilder,
    private subadminService: SubadminService,
    private mastersService: MastersService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.subAdminId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.subAdminId;

    this.breadCrumbItems = [
      { label: 'Sub-Admin Management' },
      { label: this.isEditMode ? 'Edit Sub-Admin' : 'Add Sub-Admin', active: true }
    ];

    this.initForm();
    this.loadStates();

    if (this.isEditMode && this.subAdminId) {
      this.loadSubAdminData();
    }
  }

  initForm() {
    this.subAdminForm = this.fb.group({
      name: ['', Validators.required],
      email_id: ['', [Validators.email]],
      mobile_number: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      whatsapp_no: [null, [Validators.pattern(/^[0-9]{10}$/)]],
      date_of_birth: [''],
      gender: ['Male', Validators.required],
      guardian_name: [null],
      guardian_relation: [null],
      state: [null],
      district: [null],
      area: [null],
      payment_method: ['cash', Validators.required],
      password: [this.isEditMode ? '' : '', this.isEditMode ? [] : [Validators.required, Validators.minLength(8)]],
      confirmPassword: [this.isEditMode ? '' : '', this.isEditMode ? [] : [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    // Watch for state changes
    this.subAdminForm.get('state')?.valueChanges.subscribe(stateId => {
      if (stateId) {
        this.loadDistricts(stateId);
      } else {
        this.districts = [];
        this.areas = [];
      }
      this.subAdminForm.patchValue({ district: null, area: null });
    });

    // Watch for district changes
    this.subAdminForm.get('district')?.valueChanges.subscribe(districtId => {
      if (districtId) {
        this.loadAreas(districtId);
      } else {
        this.areas = [];
      }
      this.subAdminForm.patchValue({ area: null });
    });
  }

  loadStates() {
    this.mastersService.getStates().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.states = res.data;
        }
      },
      error: (err) => {
        console.error('Error loading states:', err);
      }
    });
  }

  loadDistricts(stateId: string) {
    this.mastersService.districts(stateId).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.districts = res.data;
        }
      },
      error: (err) => {
        console.error('Error loading districts:', err);
      }
    });
  }

  loadAreas(districtId: string) {
    this.mastersService.areas(districtId).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.areas = res.data;
        }
      },
      error: (err) => {
        console.error('Error loading areas:', err);
      }
    });
  }

  loadSubAdminData() {
    this.subadminService.getSubAdmin(this.subAdminId!).subscribe({
      next: (res: any) => {
        if (res.success) {
          const subAdmin = res.data;

          // Load districts and areas if state and district are set
          if (subAdmin.state) {
            this.loadDistricts(subAdmin.state._id || subAdmin.state);
          }
          if (subAdmin.district) {
            setTimeout(() => {
              this.loadAreas(subAdmin.district._id || subAdmin.district);
            }, 500);
          }

          this.subAdminForm.patchValue({
            name: subAdmin.name,
            email_id: subAdmin.email_id,
            mobile_number: subAdmin.mobile_number,
            whatsapp_no: subAdmin.whatsapp_no,
            date_of_birth: subAdmin.date_of_birth ? new Date(subAdmin.date_of_birth).toISOString().split('T')[0] : '',
            gender: subAdmin.gender,
            guardian_name: subAdmin.guardian_name,
            guardian_relation: subAdmin.guardian_relation,
            state: subAdmin.state?._id || subAdmin.state,
            district: subAdmin.district?._id || subAdmin.district,
            area: subAdmin.area?._id || subAdmin.area,
            payment_method: subAdmin.payment_method
          });
        }
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to load sub-admin data', 'Error');
        this.router.navigate(['/subadmin/list']);
      }
    });
  }

  onSubmit() {
    if (this.subAdminForm.invalid) {
      Object.keys(this.subAdminForm.controls).forEach(key => {
        this.subAdminForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formData = { ...this.subAdminForm.value };

    // Remove confirmPassword from form data
    delete formData.confirmPassword;

    // Remove password if empty in edit mode
    if (this.isEditMode && !formData.password) {
      delete formData.password;
    }

    const request = this.isEditMode
      ? this.subadminService.updateSubAdmin(this.subAdminId!, formData)
      : this.subadminService.createSubAdmin(formData);

    request.subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toast.success(
            this.isEditMode ? 'Sub-admin updated successfully' : 'Sub-admin created successfully',
            'Success'
          );
          this.router.navigate(['/subadmin/list']);
        }
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Operation failed', 'Error');
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  cancel() {
    this.router.navigate(['/subadmin/list']);
  }
}
