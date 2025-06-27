import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { MastersService } from 'src/app/core/services/masters.service';
import { UserProfileService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss']
})
export class EditFormComponent implements OnInit {

  constructor(private userService: UserProfileService,
      private toast: ToastrService,
      private masterService: MastersService,
      private router: ActivatedRoute,
      private authService: AuthenticationService,
    ) { 
      this.user = this.router.snapshot.params['user'];
    }
    breadCrumbItems: Array<{}>;
    maritalStatus: string = '';
    user_details: any = null;
    user: any = null;
    selected_photo: string = null;
    selected_signature: string = null;
  
    allStates: any[] = []
    allDistricts: any[] = [];
    allAreas: any[] = [];
  
    kycFormGroup: FormGroup;
    profileFormGroup: FormGroup;
  
    nominee_relation: any[] = ['Father', 'Mother', 'Brother', 'Sister', 'Wife', 'Husband', 'Son', 'Daughter']
    
    ngOnInit(): void {
       this.breadCrumbItems = [{ label: 'Members' }, { label: 'Edit Profile', active: true }];
  
      this.getStates();
  
      this.profileFormGroup = new FormGroup({
        _id: new FormControl('', [Validators.required]),
        name: new FormControl('', [Validators.minLength(2)]),
        father_or_husband_name : new FormControl('', [Validators.minLength(2)]),
        mother_name : new FormControl('', [Validators.minLength(2)]),
        maritial_status: new FormControl(null),
        spouse_name: new FormControl('', [Validators.minLength(2)]),
        email_id: new FormControl('', [Validators.email]),
        nominee_dob: new FormControl(''),
        mobile_number_2: new FormControl('', [Validators.pattern('^[6-9][0-9]{9}$')]),
        whatsapp_no: new FormControl(null, [Validators.pattern('^[6-9][0-9]{9}$')]),
        account_number: new FormControl({value: '', disabled: true}, [Validators.pattern('^[0-9]{9,18}$')]),
        user_id: new FormControl({value: '', disabled: true}),
        mobile_number: new FormControl('', [Validators.pattern('^[6-9][0-9]{9}$')]),
        gender: new FormControl(''),
        date_of_birth: new FormControl({value: '', disabled: true}),
        guardian_name: new FormControl('', [Validators.minLength(2)]),
        guardian_relation: new FormControl(''),
        nominee_name: new FormControl('', [Validators.minLength(2)]),
        nominee_relation: new FormControl(''),
        nominee_email: new FormControl('', [Validators.email]),
        profile_image: new FormControl(''),
        is_divyang: new FormControl(false),
        occupation: new FormControl(null, [Validators.minLength(2)]),
        aadhar : new FormControl('', [Validators.pattern('^[0-9]{12}$')]),
        pan : new FormControl('' , [Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$')]),
        pan_image : new FormControl(''),
        aadhar_front : new FormControl(''),
        aadhar_back : new FormControl(''),
        area: new FormControl(''),
        state: new FormControl(''),
        district: new FormControl(''),
        bank_name: new FormControl(''),
        bank_account_number: new FormControl('', [Validators.pattern('^[0-9]{9,18}$')]),
        ifsc_code: new FormControl('', [Validators.pattern('^[A-Z]{4}[0-9]{7}$')]),
        branch_name: new FormControl(''),
        account_type: new FormControl(''),
        signature: new FormControl(''),
        signed_at: new FormControl(''),
        created_date:new FormControl({value: '', disabled: true}),
      })
      this.getProfile();
    }
  
    formSubmit() {
      if (this.profileFormGroup.valid) {
        const profileData = this.profileFormGroup.value;
        this.user_details = profileData;
        this.userService.updateProfile(profileData).subscribe({
          next: (response: any) => {
            if (response.status === 'success') {
              this.toast.show('Profile updated successfully!');
            } else {
              this.toast.error('Failed to update profile. Please try again.');
            }
          },
          error: (error: any) => {
            console.error('Error updating profile:', error);
          }
        });
  
        profileData.user = this.user;
        this.userService.upsertKyc(profileData).subscribe({
          next: (response: any) => {
            console.log('KYC Update Response:', response);
          },
          error: (error: any) => {
            console.error('Error updating KYC:', error);
          }
        });
  
      }
    }
  
    getProfile() {
      this.userService.getUserById(this.user).subscribe({
        next: (response: any) => {
          console.log('User Profile Response:', response);
          if (response.status === 'success') {
            const profile = response?.data?.user;
            this.user_details = profile;
            this.profileFormGroup.patchValue(response.data.user);
            delete response?.data.user?.kyc._id
            this.selected_photo = profile?.profile_image || null;
            delete response?.data.user?.bank[0]?._id

            this.profileFormGroup.patchValue(response?.data.user?.kyc);
            this.profileFormGroup.patchValue(response?.data.user?.bank[0]);
  
            this.getDistricts({_id: profile.state[0]?._id });
            this.profileFormGroup.patchValue({ state: profile.state[0]?._id });
            this.profileFormGroup.patchValue({ district: profile.district[0]?._id });
  
            this.getAreas({_id: profile.district[0]?._id });
            this.profileFormGroup.patchValue({ area: profile.area[0]?._id });
  
            this.profileFormGroup.patchValue({date_of_birth: formatDate(new Date(profile.date_of_birth),'dd-MM-yyyy','en')})
            this.profileFormGroup.patchValue({created_date: formatDate(new Date(profile.created_date),'dd-MM-yyyy','en')})
            this.maritalStatus = response.data.marital_status;
  
            this.selected_signature = profile?.signature || null;
  
          }
        },
        error: (error: any) => {
          console.error('Error fetching user profile:', error);
        }
      })
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
  
    onSelfPhotoSelected(event: any) {
      const file = event.target.files && event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          // Reduce image size by 50%
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width * 0.7; // 0.7 for better quality, adjust as needed
            canvas.height = img.height * 0.7;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            // 0.5 quality for 50% compression
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.5);
            this.selected_photo = compressedBase64;
            console.log('Selected Self Photo:', compressedBase64);
            this.profileFormGroup.patchValue({ profile_image: compressedBase64 });
          };
          img.src = base64;
          return;
          this.selected_photo = base64;
          console.log('Selected Self Photo:', base64);
          this.profileFormGroup.patchValue({ profile_image: base64 });
        };
        reader.readAsDataURL(file);
      }
    }
  
     onSelfSignatureSelected(event: any) {
      const file = event.target.files && event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          // Reduce image size by 50%
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width * 0.7; // 0.7 for better quality, adjust as needed
            canvas.height = img.height * 0.7;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            // 0.5 quality for 50% compression
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.5);
            this.selected_signature = compressedBase64;
            console.log('Signature:', compressedBase64);
            this.profileFormGroup.patchValue({ signature: compressedBase64 });
          };
          img.src = base64;
        };
        reader.readAsDataURL(file);
      }
    }

}
