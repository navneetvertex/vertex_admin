import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserProfileService } from 'src/app/core/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/core/models/auth.models';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  constructor(private modalService: NgbModal,
    private usersService: UserProfileService,
    private toast: ToastrService,
    private utilService: UtilsService,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    this.user_id = this.route.snapshot.paramMap.get('user') || '';
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.getUserDetails(this.user_id);
  }

  breadCrumbItems: Array<{}>;
  relationshipOptions = ['Father', 'Mother', 'Brother', 'Sister', 'Son', 'Daughter', 'Husband', 'Wife', 'Friend'];
  kycFormGroup: FormGroup;
  profileFormGroup: FormGroup;
  addressFormGroup: FormGroup;
   private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  bankFormGroup: FormGroup;
  typeKYCsubmit = false;
  typeProfilesubmit = false;
  typeAddressSubmit = false;
  typeBanksubmit = false;
  user_id: string = '';
  userDetails: any = null;
  maxDOB: string = '';



  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Members' }, { label: 'Edit Profile', active: true }];
    const today = new Date();
    this.maxDOB = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    .toISOString()
    .split('T')[0];
    this.kycFormGroup = new FormGroup({
      aadhar : new FormControl('', [Validators.required, Validators.pattern('^[0-9]{12}$')]),
      pan : new FormControl('' , [Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$')]),
      pan_image : new FormControl('', Validators.required, ),
      aadhar_front : new FormControl('' , Validators.required),
      aadhar_back : new FormControl('', Validators.required),
    });
    this.profileFormGroup = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email_id: new FormControl('', [Validators.required, Validators.email]),
      account_number: new FormControl({value: '', disabled: true}, [Validators.required, Validators.pattern('^[0-9]{9,18}$')]),
      user_id: new FormControl({value: '', disabled: true}, [Validators.required]),
      mobile_number: new FormControl('', [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]),
      gender: new FormControl('', [Validators.required]),
      date_of_birth: new FormControl('', [Validators.required]),
      guardian_name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      guardian_relation: new FormControl('', [Validators.required]),
      nominee_name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      nominee_relation: new FormControl('', [Validators.required]),
      nominee_contact: new FormControl('', [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]),
      nominee_email: new FormControl('', [Validators.required,Validators.email]),
      profile_image: new FormControl(''),
      is_divyang: new FormControl(false)
    })
    this.addressFormGroup = new FormGroup({
      address_line: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      district: new FormControl('', [Validators.required]),
      pincode: new FormControl('', [Validators.required, Validators.pattern('^[1-9][0-9]{5}$')]),
      corr_address_line: new FormControl('', [Validators.required]),
      corr_city: new FormControl('', [Validators.required]),
      corr_state: new FormControl('', [Validators.required]),
      corr_district: new FormControl('', [Validators.required]),
      corr_pincode: new FormControl('', [Validators.required, Validators.pattern('^[1-9][0-9]{5}$')])
    });
    this.bankFormGroup = new FormGroup({
      bank_name: new FormControl('', [Validators.required]),
      account_holder: new FormControl('', [Validators.required, Validators.minLength(2)]),
      account_number: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{9,18}$')]),
      ifsc_code: new FormControl('', [Validators.required, Validators.pattern('^[A-Z]{4}[0-9]{7}$')]),
      branch_name: new FormControl('', [Validators.required]),
      account_type: new FormControl('', [Validators.required]),
      micr_code: new FormControl('', [Validators.pattern('^[0-9]{9}$')]),
    });
  }

  getUserDetails(user_id: string) {
    this.usersService.getUserById(user_id).subscribe((res: any) => {
      if (res && res.data) {
        const user = res.data.user;
        this.userDetails = user;
        this.currentUserSubject.next(user);
        this.profileFormGroup.patchValue(user)
        this.profileFormGroup.patchValue({date_of_birth: formatDate(new Date(user.date_of_birth),'yyyy-MM-dd','en')})
        this.kycFormGroup.patchValue(user.kyc || {});
        console.log('User Details:', user);
      }
    }, (err: any) => {
      this.router.navigate(['/members']);
      console.error('Error fetching user details:', err);
    });
  }

  openModal(content: any) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  validatePincode(pincode: string) {
    this.utilService.validate_pincode(pincode).subscribe((res: any) => {
      if (res.data.pin) {
        res.data.pin.statename = this.utilService.toTitleCase(res.data.pin.statename);
        res.data.pin.district = this.utilService.toTitleCase(res.data.pin.district);
        this.addressFormGroup.patchValue({ state: res.data.pin.statename, district: res.data.pin.district });
      } else {
        this.toast.error('Invalid Pincode', 'Error');
      }
    })
  }

  validateCorrPincode(pincode: string) {
    this.utilService.validate_pincode(pincode).subscribe((res: any) => {
      if (res.data.pin) {
        res.data.pin.statename = this.utilService.toTitleCase(res.data.pin.statename);
        res.data.pin.district = this.utilService.toTitleCase(res.data.pin.district);
        this.addressFormGroup.patchValue({ corr_state: res.data.pin.statename, corr_district: res.data.pin.district });
      } else {
        this.toast.error('Invalid Pincode', 'Error');
      }
    })
  }

  openModalAsComponent(data: any) {
    const modalRef = this.modalService.open(ImageCropperComponent, { centered: true, size: 'xl' });
    modalRef.componentInstance.data = data;
    modalRef.result.then((result) => {
      console.log('Modal closed with:', result);
      if(result) {
        if (result.image) {
          if (result.from === 'profile') {
            this.profileFormGroup.patchValue({ profile_image: result.image });
          } else if (result.from === 'pan') {
            this.kycFormGroup.patchValue({ pan_image: result.image });
          } else if (result.from === 'aadhar_front') {
            this.kycFormGroup.patchValue({ aadhar_front: result.image });
          } else if (result.from === 'aadhar_back') {
            this.kycFormGroup.patchValue({ aadhar_back: result.image });
          } 
        }
      }
    }).catch((reason) => {
      console.log('Modal dismissed:', reason);
    });
  }

  onFileSelected(event: Event, from: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.openModalAsComponent({ file : event, from: from });
    }
  }

  copyAddress($event: any) {
    if ($event.target.checked) {
      this.addressFormGroup.patchValue({
        corr_address_line: this.addressFormGroup.get('address_line')?.value,
        corr_city: this.addressFormGroup.get('city')?.value,
        corr_state: this.addressFormGroup.get('state')?.value,
        corr_district: this.addressFormGroup.get('district')?.value,
        corr_country: this.addressFormGroup.get('country')?.value,
        corr_pincode: this.addressFormGroup.get('pincode')?.value
      });
    }
  }

  submitAddress() {
    this.typeAddressSubmit = true;
    if (this.addressFormGroup.valid) {
      this.usersService.createAddress({...this.addressFormGroup.value, user: this.user_id}).subscribe((res: any) => {
        this.toast.success('Address details updated successfully', 'Success');
        this.modalService.dismissAll();
         this.getUserDetails(this.user_id);
        this.addressFormGroup.reset();
        this.typeAddressSubmit = false;
      }
      , (err: any) => {
        this.typeAddressSubmit = false;
        console.error('Error updating address:', err);
        this.toast.error('Error updating address', 'Error');
      });
    }
  }

  bankSubmit() {
    console.log(this.bankFormGroup.value);
    if (this.bankFormGroup.valid) {
      this.usersService.createBank({...this.bankFormGroup.value, user: this.user_id}).subscribe((res: any) => {
        this.toast.success('Bank details updated successfully', 'Success');
        this.modalService.dismissAll();
        this.bankFormGroup.reset();
        this.getUserDetails(this.user_id);
      }, (err: any) => {
        console.error('Error updating bank details:', err);
        this.toast.error('Error updating bank details', 'Error');
      });
    }
  }

  kycSubmit() {
    console.log(this.kycFormGroup.value);
    if (this.kycFormGroup.valid) {
      this.typeKYCsubmit = false;
      this.usersService.upsertKyc({...this.kycFormGroup.value, user: this.user_id}).subscribe((res: any) => {
        this.toast.success('KYC details updated successfully', 'Success');
      }, (err: any) => {
        console.error('Error updating KYC:', err);
      });
    } else {
      this.typeKYCsubmit = true;
    }
  }

  onProfileSubmit() {
    if (this.profileFormGroup.valid) {
      this.typeProfilesubmit = false;
      const payload  = this.profileFormGroup.value
      this.usersService.updateProfile({...this.profileFormGroup.value, _id: this.user_id}).subscribe((res: any) => {
        if(this.profileFormGroup.get('profile_image')?.value) {
          this.currentUserSubject.next(payload);
        }
        this.toast.success('Profile updated successfully', 'Success');
      }, (err: any) => {
        console.error('Error updating profile:', err);
        this.toast.error('Error updating profile', 'Error');
      });
    } else {
      this.typeProfilesubmit = true;
    }
  }


  deleteAddress(addressId: string) {
    this.usersService.deleteAddress(addressId).subscribe((res: any) => {
      this.toast.success('Address deleted successfully', 'Success');
      this.getUserDetails(this.user_id);
    }, (err: any) => {
      console.error('Error deleting address:', err);
      this.toast.error('Error deleting address', 'Error');
    });
  }

  deleteBank(bankId: string) {
    this.usersService.deleteBank(bankId).subscribe((res: any) => {
      this.toast.success('Bank details deleted successfully', 'Success');
      this.getUserDetails(this.user_id);
    }, (err: any) => {
      console.error('Error deleting bank details:', err);
      this.toast.error('Error deleting bank details', 'Error');
    });
  }

  editBank(bankId: string, bankData: any) {
    this.usersService.editBank(bankId, bankData).subscribe((res: any) => {
      this.toast.success('Bank details updated successfully', 'Success');
      this.getUserDetails(this.user_id);
    }, (err: any) => {
      console.error('Error updating bank details:', err);
      this.toast.error('Error updating bank details', 'Error');
    });
  }

  editAddress(addressId: string, addressData: any) {
    this.usersService.editAddress(addressId, addressData).subscribe((res: any) => {
      this.toast.success('Address updated successfully', 'Success');
      this.getUserDetails(this.user_id);
    }, (err: any) => {
      console.error('Error updating address:', err);
      this.toast.error('Error updating address', 'Error');
    });
  }

}
