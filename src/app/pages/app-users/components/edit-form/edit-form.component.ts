import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { MastersService } from 'src/app/core/services/masters.service';
import { UserProfileService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';

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
      private route: Router,
      private modalService: NgbModal,
      private authService: AuthenticationService,
    ) { 
      this.user = this.router.snapshot.params['user'];
    }
    breadCrumbItems: Array<{}>;
    maritalStatus: string = '';
    viewImageURL: string = '';
    user_details: any = null;
    user: any = null;
    selected_photo: string = null;
    selected_signature: string = null;
    userAge: number = 0;
    allStates: any[] = []
    allDistricts: any[] = [];
    allAreas: any[] = [];
    selected_cheque: string = null;

    kycFormGroup: FormGroup;
    profileFormGroup: FormGroup;

    nominee_relation: any[] = ['Father', 'Mother', 'Brother', 'Sister', 'Wife', 'Husband', 'Son', 'Daughter']

    ngOnInit(): void {
       this.breadCrumbItems = [{ label: 'Members' }, { label: 'Edit Profile', active: true }];

      this.getStates();

      this.profileFormGroup = new FormGroup({
        _id: new FormControl('', [Validators.required]),
        name: new FormControl({value: '', disabled: true}, [Validators.minLength(2)]),
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
        nominee_mobile: new FormControl('', [Validators.pattern('^[6-9][0-9]{9}$')]),
        profile_image: new FormControl(''),
        is_divyang: new FormControl(false),
        occupation: new FormControl(null, [Validators.minLength(2)]),
        aadhar : new FormControl('', [Validators.pattern('^[0-9]{12}$')]),
        pan : new FormControl('' , [Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$')]),
        pan_image : new FormControl(''),
        aadhar_front : new FormControl(''),
        aadhar_back : new FormControl(''),
        signature: new FormControl(''),
        signed_at: new FormControl(''),
        created_date:new FormControl({value: '', disabled: true}),
        present_area: new FormControl('', ),
        permanent_area: new FormControl('', ),
        passbook_cheque: new FormControl(''),
        disability_image: new FormControl(''),
        state: new FormControl(''),
        district: new FormControl(''),
        area: new FormControl(''),
        present_addresses: new FormArray([
          new FormGroup({
            _id: new FormControl(null),
            address: new FormControl(''),
            state: new FormControl(''),
            district: new FormControl(''),
            pincode: new FormControl('', [ Validators.pattern('^[0-9]{6}$')]),
          })
        ]),
        permanent_addresses: new FormArray([
          new FormGroup({
            _id: new FormControl(null),
            address: new FormControl(''),
            state: new FormControl(''),
            district: new FormControl(''),
            pincode: new FormControl('', [ Validators.pattern('^[0-9]{6}$')]),
          })
        ]),
        office_addresses: new FormArray([
          new FormGroup({
            _id: new FormControl(null),
            address: new FormControl(''),
            state: new FormControl(''),
            district: new FormControl(''),
            pincode: new FormControl('', [ Validators.pattern('^[0-9]{6}$')]),
          })
        ]),
        banks: new FormArray([
          new FormGroup({
            _id: new FormControl(null),
            bank_name: new FormControl(''),
            account_number: new FormControl('', [ Validators.pattern('^[0-9]{9,18}$')]),
            ifsc_code: new FormControl('', [ Validators.pattern('^[A-Z]{4}[0-9]{7}$')]),
            branch_name: new FormControl(''),
          })
        ]),
      })
      this.getProfile();
    }

    addPresentAddress() {
      const addressArray = this.profileFormGroup.get('present_addresses') as FormArray;
      addressArray.push(
        new FormGroup({
            _id: new FormControl(null),
            address: new FormControl(''),
            state: new FormControl(''),
            district: new FormControl(''),
            pincode: new FormControl('', [ Validators.pattern('^[0-9]{6}$')]),
          })
      );
    }

    removePresentAddress(index: number) {
      const addressArray = this.profileFormGroup.get('present_addresses') as FormArray;
      if (addressArray.length > 1) {
        addressArray.removeAt(index);
      } else {
        this.toast.error('At least one address is required.');
      }
    }

    addPermanentAddress() {
      const addressArray = this.profileFormGroup.get('permanent_addresses') as FormArray;
      addressArray.push(
        new FormGroup({
            _id: new FormControl(null),
            address: new FormControl(''),
            state: new FormControl(''),
            district: new FormControl(''),
            pincode: new FormControl('', [ Validators.pattern('^[0-9]{6}$')]),
          })
      );
    }

    removePermanentAddress(index: number) {
      const addressArray = this.profileFormGroup.get('permanent_addresses') as FormArray;
      if (addressArray.length > 1) {
        addressArray.removeAt(index);
      } else {
        this.toast.error('At least one address is required.');
      }
    }

    addOfficeAddress() {
      const addressArray = this.profileFormGroup.get('office_addresses') as FormArray;
      addressArray.push(
        new FormGroup({
            _id: new FormControl(null),
            address: new FormControl(''),
            state: new FormControl(''),
            district: new FormControl(''),
            pincode: new FormControl('', [ Validators.pattern('^[0-9]{6}$')]),
          })
      );
    }

    removeOfficeAddress(index: number) {
      const addressArray = this.profileFormGroup.get('office_addresses') as FormArray;
      if (addressArray.length > 1) {
        addressArray.removeAt(index);
      } else {
        this.toast.error('At least one office address is required.');
      }
    }

    approveKYC() {
      Swal.fire({
        title: 'Approve KYC',
        text: 'Are you sure you want to approve this KYC?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, approve it!',
        cancelButtonText: 'No, cancel!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.userService.upsertKyc({user: this.user_details._id, status: 'Approved'}).subscribe({
            next: (response: any) => {
              if (response.status === 'success') {
                Swal.fire('Approved!', 'KYC has been approved.', 'success').then(() => {
                  this.route.navigate(['/members/all']);
                });
              } else {
                this.toast.error('Failed to approve KYC. Please try again.');
              }
            },
            error: (error: any) => {
              console.error('Error approving KYC:', error);
            }
          });
        }
      });
    }

    addBank() {
      const bankArray = this.profileFormGroup.get('banks') as FormArray;
      bankArray.push(
        new FormGroup({
          _id: new FormControl(null),
          bank_name: new FormControl('', [Validators.required]),
          account_number: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{9,18}$')]),
          ifsc_code: new FormControl('', [Validators.required, Validators.pattern('^[A-Z]{4}[0-9]{7}$')]),
          branch_name: new FormControl('', [Validators.required]),
        })
      );
    }

    removeBank(index: number) {
      const bankArray = this.profileFormGroup.get('banks') as FormArray;
      if (bankArray.length > 1) {
        bankArray.removeAt(index);
      } else {
        this.toast.error('At least one bank account is required.');
      }
    }


    uploadFile(event: any, fieldName: string) {
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
            this.profileFormGroup.patchValue({ [fieldName]: compressedBase64 });

            console.log(`Selected ${fieldName}:`, compressedBase64);
          };
          img.src = base64;
        };
        reader.readAsDataURL(file);
      }
    }

    formSubmit() {
      if (this.profileFormGroup.valid) {
        const profileData = this.profileFormGroup.value;
        this.user_details = profileData;
        this.userService.updateProfile(profileData).subscribe({
          next: (response: any) => {
            if (response.status === 'success') {
              Swal.fire({
                title: 'Profile Updated Successfully',
                text: 'Your profile has been updated successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
              }).then(() => {
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              });

            } else {
              this.toast.error('Failed to update profile. Please try again.');
            }
          },
          error: (error: any) => {
            console.error('Error updating profile:', error);
          }
        });

        profileData.user = this.user;

      }
    }

    getProfile() {
      console.log('Fetching user profile for user:', this.user);
      this.userService.getUserById(this.user).subscribe({
        next: (response: any) => {
          console.log('User Profile Response:', response);
          if (response.status === 'success') {
            const profile = response?.data?.user;
            this.user_details = profile;
            this.profileFormGroup.patchValue(response.data.user);
            delete response?.data.user?.kyc._id
            this.selected_photo = profile?.profile_image || null;
            this.selected_cheque = profile?.passbook_cheque || null;
            this.profileFormGroup.patchValue(response?.data.user?.kyc);

            if(profile.state) {
              this.getDistricts({_id: profile.state });
              this.getAreas({_id: profile.district });
              this.profileFormGroup.patchValue({ state: profile.state });
              this.profileFormGroup.patchValue({ district: profile.district });
            }

            const present_addresses = profile.addresses.filter((address: any) => address.type === 'Present');
            const permanent_addresses = profile.addresses.filter((address: any) => address.type === 'Permanent');
            const office_addresses = profile.addresses.filter((address: any) => address.type === 'Office');
            if(present_addresses && present_addresses.length > 0) {
              const addressArray = this.profileFormGroup.get('present_addresses') as FormArray;
              addressArray.clear();
              present_addresses.forEach((address: any, index: number) => {
                addressArray.push(
                  new FormGroup({
                    _id: new FormControl(address._id),
                    state: new FormControl(address.state, [Validators.required]),
                    district: new FormControl(address.district, [Validators.required]),
                    address: new FormControl(address.address, [Validators.required]),
                    pincode: new FormControl(address.pincode, [Validators.required, Validators.pattern('^[0-9]{6}$')]),
                  })
                );
              });
            }

            if(permanent_addresses && permanent_addresses.length > 0) {
              const addressArray = this.profileFormGroup.get('permanent_addresses') as FormArray;
              addressArray.clear();
              permanent_addresses.forEach((address: any, index: number) => {
                addressArray.push(
                  new FormGroup({
                    _id: new FormControl(address._id),
                    state: new FormControl(address.state, [Validators.required]),
                    district: new FormControl(address.district, [Validators.required]),
                    address: new FormControl(address.address, [Validators.required]),
                    pincode: new FormControl(address.pincode, [Validators.required, Validators.pattern('^[0-9]{6}$')]),
                  })
                );
              });
            }

            if(office_addresses && office_addresses.length > 0) {
              const addressArray = this.profileFormGroup.get('office_addresses') as FormArray;
              addressArray.clear();
              office_addresses.forEach((address: any, index: number) => {
                addressArray.push(
                  new FormGroup({
                    _id: new FormControl(address._id),
                    state: new FormControl(address.state, [Validators.required]),
                    district: new FormControl(address.district, [Validators.required]),
                    address: new FormControl(address.address, [Validators.required]),
                    pincode: new FormControl(address.pincode, [Validators.required, Validators.pattern('^[0-9]{6}$')]),
                  })
                );
              });
            }

            if (profile.bank && profile.bank.length > 0) {
              const bankArray = this.profileFormGroup.get('banks') as FormArray;
              bankArray.clear();
              profile.bank.forEach((bank: any) => {
                bankArray.push(
                  new FormGroup({
                    _id: new FormControl(bank._id),
                    bank_name: new FormControl(bank.bank_name, [Validators.required]),
                    account_number: new FormControl(bank.account_number, [Validators.required, Validators.pattern('^[0-9]{9,18}$')]),
                    ifsc_code: new FormControl(bank.ifsc_code, [Validators.required, Validators.pattern('^[A-Z]{4}[0-9]{7}$')]),
                    branch_name: new FormControl(bank.branch_name, [Validators.required]),
                  })
                );
              });
            } else {
              const bankArray = this.profileFormGroup.get('banks') as FormArray;
              bankArray.clear();
              bankArray.push(
                new FormGroup({
                  _id: new FormControl(null),
                  bank_name: new FormControl('', [Validators.required]),
                  account_number: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{9,18}$')]),
                  ifsc_code: new FormControl('', [Validators.required, Validators.pattern('^[A-Z]{4}[0-9]{7}$')]),
                  branch_name: new FormControl('', [Validators.required]),
                })
              );
            }

            // const addressArray = this.profileFormGroup.get('addresses') as FormArray;
            // if (addressArray.length > profile.addresses.length) {
            //   for (let i = addressArray.length - 1; i >= profile.addresses.length; i--) {
            //     addressArray.removeAt(i);
            //   }
            // }

            const bankArray = this.profileFormGroup.get('banks') as FormArray;
            if (bankArray.length > profile.bank.length) {
              for (let i = bankArray.length - 1; i >= profile.bank.length; i--) {
                bankArray.removeAt(i);
              }
            }


            this.calculateAge(profile.date_of_birth);

            console.log('Profile Data:', profile.nominee_dob);

            this.profileFormGroup.patchValue({date_of_birth: formatDate(new Date(profile.date_of_birth),'dd-MM-yyyy','en')})
            this.profileFormGroup.patchValue({created_date: formatDate(new Date(profile.created_date),'dd-MM-yyyy','en')})
            // this.profileFormGroup.patchValue({nominee_dob: formatDate(new Date(profile.nominee_dob),'dd-MM-yyyy','en')})
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

  calculateAge(dob: string) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    console.log('Calculated age:', age);
    this.userAge = age;
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

  onSelfPassbookSelected(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width * 0.7;
          canvas.height = img.height * 0.7;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.5);
          this.selected_cheque = compressedBase64;
          this.profileFormGroup.patchValue({ passbook_cheque: compressedBase64 });
        };
        img.src = base64;
      };
      reader.readAsDataURL(file);
    }
  }

  viewImage(imageUrl: string, content: any) {
    console.log('Viewing image:', imageUrl);
    if (imageUrl) {
      this.viewImageURL = imageUrl;
      this.modalService.open(content, { size: 'sm', centered: true });
    } else {
      this.toast.error('No image available to view.');
    }
  }

}
