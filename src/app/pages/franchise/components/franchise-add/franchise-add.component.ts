import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';
import { FranchiseService } from 'src/app/core/services/franchise.service';
import { MastersService } from 'src/app/core/services/masters.service';
import { UserProfileService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-franchise-add',
  templateUrl: './franchise-add.component.html',
  styleUrls: ['./franchise-add.component.scss']
})
export class FranchiseAddComponent implements OnInit {

  constructor(private userService: UserProfileService,
      private toast: ToastrService,
      private masterService: MastersService,
      private franchiseService: FranchiseService,
    ) { }
  breadCrumbItems: Array<{}>;
  addFranchiseFormGroup: FormGroup;
  userDetails: any = null;
  allDistricts: any[] = [];
  allAreas: any[] = [];
  allStates: any[] = [];

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Franchise' }, { label: 'Manage', active: true }];
    this.getStates();
    this.addFranchiseFormGroup = new FormGroup({
      user_id: new FormControl('', Validators.required),
      state: new FormControl({value: '', disabled: true}, Validators.required),
      district: new FormControl('', Validators.required),
      area: new FormControl([], Validators.required),
    });
  }

  getUserDetails() {
    if(!this.addFranchiseFormGroup.value.user_id) return;
    this.userService.getBasicUserProfile(this.addFranchiseFormGroup.value.user_id).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.userDetails = res?.data?.user;
          if(!this.userDetails) {
            this.addFranchiseFormGroup.get('user_id')?.setErrors({ 'userNotFound': true });
          } else {
            this.getFranchiseByUserId(this.userDetails._id);
            this.getDistricts({_id :this.userDetails.state});
            this.getAreas({_id: this.userDetails.district});
            this.addFranchiseFormGroup.patchValue({
              state: this.userDetails.state,
              district: this.userDetails.district,
              area: this.userDetails.area
            });
            this.addFranchiseFormGroup.get('state')?.disable();
          }
        } 
      }, error: (err) => {
        console.error('Error fetching user details:', err);
      }
    });
  }

  getFranchiseByUserId(_id: string) {
    this.franchiseService.getFranchiseByUserId(_id).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          const isUserAlreadyFranchise = response.data.franchise;
          this.addFranchiseFormGroup.patchValue({area : isUserAlreadyFranchise?.area || []});
          console.log('Franchise Details:', isUserAlreadyFranchise);
        }
      },
      error: (error) => {
        console.error('Error fetching franchise by user ID:', error);
        this.toast.error('An error occurred while fetching franchise details');
      }
    });
  }

  getStates() {
    this.masterService.states().subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.allStates = response.data || [];
        }
      },
      error: (error) => {
        console.error('Error loading states:', error);
      }
    });
  }

  getDistricts(state: any) {
    if (!state) {
      this.allDistricts = [];
      return;
    }

    if(!state?._id) {
      this.allDistricts = [];
      return;
    } 

    this.masterService.districts(state._id).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.allDistricts = response.data || [];
        }
      },
      error: (error) => {
        console.error('Error loading districts:', error);
      }
    });
  }

  getAreas(district: any) {
    if (!district) {
      this.allAreas = [];
      return;
    }

    if(!district?._id) {
      this.allAreas = [];
      return;
    }

    this.masterService.areas(district._id).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.allAreas = response.data || [];
        }
      },
      error: (error) => {
        console.error('Error loading areas:', error);
      }
    });
  }

  onSubmit() {
    if (this.addFranchiseFormGroup.invalid) {
      this.addFranchiseFormGroup.markAllAsTouched();
      this.toast.error('Please fix the errors in the form.');
      return;
    }
   
    const formData = {
      user_id: this.userDetails._id,
      state: this.userDetails?.state || this.addFranchiseFormGroup.value.state,
      district: this.addFranchiseFormGroup.value.district,
      area: this.addFranchiseFormGroup.value.area
    };
    console.log('Form Data:', formData);
    this.franchiseService.addFranchise(formData).subscribe({
      next: (response: any) => {
        if (response.status) {
          Swal.fire({
            title: 'Success',
            text: 'Franchise added successfully',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.toast.success('Franchise added successfully');
          this.addFranchiseFormGroup.reset();
          this.userDetails = null;
          this.allDistricts = [];
          this.allAreas = [];
        } else {
          this.toast.error(response.message || 'Failed to add franchise');
        }
      }
      , error: (error) => {
        console.error('Error adding franchise:', error);
        this.toast.error('An error occurred while adding the franchise');
        Swal.fire({
          title: 'Error',
          text: 'An error occurred while adding the franchise',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }

}
