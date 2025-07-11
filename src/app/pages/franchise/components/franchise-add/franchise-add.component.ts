import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
      private router: Router,
      private masterService: MastersService,
      private franchiseService: FranchiseService,
    ) { }
  breadCrumbItems: Array<{}>;
  addFranchiseFormGroup: FormGroup;
  userDetails: any = null;
  allDistricts: any[] = [];
  allAreas: any[] = [];
  allStates: any[] = [];
  allAreasWithFranchiseUser: any[] = [];
  areaAlreadyExistsmessage: string = '';

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Franchise' }, { label: 'Manage', active: true }];
    this.getStates();
    this.getAllAreasWithFranchise();
    this.addFranchiseFormGroup = new FormGroup({
      user_id: new FormControl('', Validators.required),
      state: new FormControl({value: '', disabled: true}, Validators.required),
      district: new FormControl({value: '', disabled: true}, Validators.required),
      area: new FormControl([], Validators.required),
    });
  }

  getUserDetails() {
    if(!this.addFranchiseFormGroup.value.user_id) return;

    this.franchiseService.getAdvisorStatus(this.addFranchiseFormGroup.value.user_id).subscribe({
      next: (res: any) => {
        if(res && res.status === 'success') {
          if(res.data.isAdvisor) {
            this.addFranchiseFormGroup.get('user_id')?.setErrors(null);
            this.addFranchiseFormGroup.get('user_id')?.markAsPristine();
            this.addFranchiseFormGroup.get('user_id')?.markAsUntouched();
            this.userDetails = res.data.user;
            this.getFranchiseByUserId(this.userDetails._id);
            this.getDistricts({_id :this.userDetails.state});
            this.getAreas({_id: this.userDetails.district});
            this.addFranchiseFormGroup.patchValue({
              state: this.userDetails.state,
              district: this.userDetails.district,
              area: this.userDetails.area
            });
            this.addFranchiseFormGroup.get('state')?.disable();
          } else {
            if(res.data.user) {
              this.userDetails = res.data.user;
               this.addFranchiseFormGroup.get('user_id')?.setErrors({ 'notAdvisor': true });
            } else {
              this.userDetails = null;
               this.addFranchiseFormGroup.get('user_id')?.setErrors({ 'userNotFound': true });
            }
           
          }
        }
      }, error: (err) => {
        console.error('Error checking advisor status:', err);
        this.toast.error('An error occurred while checking advisor status');
      }
    });

    // this.userService.getBasicUserProfile(this.addFranchiseFormGroup.value.user_id).subscribe({
    //   next: (res: any) => {
    //     if (res.status) {
    //       this.userDetails = res?.data?.user;
    //       if(!this.userDetails) {
    //         this.addFranchiseFormGroup.get('user_id')?.setErrors({ 'userNotFound': true });
    //       } else {
    //         this.getFranchiseByUserId(this.userDetails._id);
    //         this.getDistricts({_id :this.userDetails.state});
    //         this.getAreas({_id: this.userDetails.district});
    //         this.addFranchiseFormGroup.patchValue({
    //           state: this.userDetails.state,
    //           district: this.userDetails.district,
    //           area: this.userDetails.area
    //         });
    //         this.addFranchiseFormGroup.get('state')?.disable();
    //       }
    //     } 
    //   }, error: (err) => {
    //     console.error('Error fetching user details:', err);
    //   }
    // });
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
      district: this.userDetails?.district || this.addFranchiseFormGroup.value.district,
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
          }).then(() => {
            this.router.navigate(['/franchises/list']);
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

  areaSelected(event: any) {
    const last_selectedArea = event[event.length - 1];
    if (last_selectedArea && last_selectedArea._id) {
        const isAreaAlreadySelected : any = this.allAreasWithFranchiseUser.find((area: any) => area._id === last_selectedArea._id);
        if (isAreaAlreadySelected) {
          this.toast.error(`This area is already associated with a franchise ${isAreaAlreadySelected?.user[0]?.name} (${isAreaAlreadySelected?.user[0]?.user_id})`);
          this.addFranchiseFormGroup.get('area')?.setErrors({ 'areaAlreadyExists': true });
          setTimeout(() => {
            this.addFranchiseFormGroup.get('area')?.setErrors(null);
            this.areaAlreadyExistsmessage = '';
          }, 5000);
          this.areaAlreadyExistsmessage = `${isAreaAlreadySelected.name} area is already associated with a franchise ${isAreaAlreadySelected?.user[0]?.name} (${isAreaAlreadySelected?.user[0]?.user_id})`;
          this.addFranchiseFormGroup.markAllAsTouched();
          this.addFranchiseFormGroup.patchValue({
            area: event
              .filter((area: any) => area._id !== last_selectedArea._id)
              .map((area: any) => area._id)
          });
        }
    }
  }

  getAllAreasWithFranchise() {
    this.franchiseService.getAllAreasWithFranchise().subscribe({
      next: (response: any) => {
        this.allAreasWithFranchiseUser = response?.data?.areas || [];
        console.log('Areas with franchise:', this.allAreasWithFranchiseUser);
        // if (response && response.data) {
        //   this.allAreas = response.data || [];
        // }
      },
      error: (error) => {
        console.error('Error loading areas with franchise:', error);
        this.toast.error('An error occurred while loading areas with franchise');
      }
    });
  }

}
