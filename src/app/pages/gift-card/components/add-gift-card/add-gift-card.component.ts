import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';
import { GiftService } from 'src/app/core/services/gift.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-gift-card',
  templateUrl: './add-gift-card.component.html',
  styleUrls: ['./add-gift-card.component.scss']
})
export class AddGiftCardComponent implements OnInit {

  constructor(private modalService: NgbModal,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private giftService: GiftService
  ) {
    this.id = this.route.snapshot.queryParamMap.get('id');
   }
  breadCrumbItems: Array<{}>;
  addGiftFormGroup: FormGroup;
  editGiftFormGroup: FormGroup;
  id: string | null;

  ngOnInit(): void {
    if(this.id) {
      this.breadCrumbItems = [{ label: 'Gift Card Management' }, { label: 'Edit', active: true }];
      this.getGiftById();
    } else {
      this.breadCrumbItems = [{ label: 'Gift Card Management' }, { label: 'Add', active: true }];
    }
    
    this.addGiftFormGroup = new FormGroup({
      gift_name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(500)]),
      quantity: new FormControl('', [Validators.required, Validators.min(1)]),
      gift_image : new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required])
    });

    this.editGiftFormGroup = new FormGroup({
      _id: new FormControl('', [Validators.required]),
      gift_name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(500)]),
      quantity: new FormControl('', [Validators.required, Validators.min(1)]),
      gift_image : new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required])
    });
  }


  getGiftById() {
    if (this.id) {
      this.giftService.getGiftById(this.id).subscribe({
        next: (response: any) => {
          if (response && response.data) {
            this.editGiftFormGroup.patchValue({
              _id: response.data.gift._id,
              gift_name: response.data.gift.gift_name,
              description: response.data.gift.description,
              quantity: response.data.gift.quantity,
              gift_image: response.data.gift.gift_image,
              status: response.data.gift.status
            });
          } else {
            console.error('No data found for the given ID');
            this.router.navigate(['/gift-card-management/list']);
          }
        },
        error: (error) => {
          console.error('Error fetching gift by ID:', error);
          this.router.navigate(['/gift-card-management/list']);
        }
      });
    } else {
      console.warn('No ID provided for fetching gift details');
      this.router.navigate(['/gift-card-management/list']);
    }
  }

  onEdit(): void {
    if (this.editGiftFormGroup.valid) {
      const formData = this.editGiftFormGroup.value;
      this.giftService.editGift(formData).subscribe({
        next: (response) => {
          this.toast.success('Gift updated successfully', 'Success');
          this.editGiftFormGroup.reset();
          this.router.navigate(['/gift-card-management/list']);
        },
        error: (error) => {
          console.error('Error updating gift:', error);
          this.toast.error('Error updating gift', 'Error');
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }

  onFileSelected(event: Event, from: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.openModalAsComponent({ file : event, from: from });
    }
  }

  openModalAsComponent(data: any) {
    const modalRef = this.modalService.open(ImageCropperComponent, { centered: true, size: 'xl' });
    modalRef.componentInstance.data = data;
    modalRef.result.then((result) => {
      if(result) {
        if (result.image) {
          this.addGiftFormGroup.patchValue({ gift_image: result.image });
          this.editGiftFormGroup.patchValue({ gift_image: result.image });
        }
      }
    }).catch((reason) => {
      console.log('Modal dismissed:', reason);
    });
  }

  onSubmit(): void {
    if (this.addGiftFormGroup.valid) {
      const formData = this.addGiftFormGroup.value;
      this.giftService.createGift(formData).subscribe({
        next: (response) => {
          this.toast.success('Gift created successfully', 'Success');
          this.addGiftFormGroup.reset();
        },
        error: (error) => {
          console.error('Error creating gift:', error);
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }

}
