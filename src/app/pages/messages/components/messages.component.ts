import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgModel, Validators } from '@angular/forms';
import { ImageCropperComponent } from '../../app-users/components/edit-profile/image-cropper/image-cropper.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  constructor(private modalService: NgbModal,
    private toast: ToastrService
  ) { }
  breadCrumbItems: Array<{}>;
  addMessageFormGroup: FormGroup;

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Messages' }, { label: 'Create', active: true }];
    this.addMessageFormGroup = new FormGroup({
      title: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required),
      attachment: new FormControl(''),
    });
  }

  onFileSelected(event: Event, from: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const modalRef = this.modalService.open(ImageCropperComponent, { centered: true, size: 'xl' });
          modalRef.componentInstance.data = { file : event, from: from };
          modalRef.result.then((result) => {
            console.log('Modal closed with:', result);
            if(result) {
              if (result.image) {
                this.addMessageFormGroup.patchValue({attachment: result.image});
              }
            }
          }).catch((reason) => {
            console.log('Modal dismissed:', reason);
          });
    }
  }

  onSubmit() {
    if(this.addMessageFormGroup.valid) {
      this.toast.success('Notification is successfully sent to all users.')
      this.addMessageFormGroup.reset()
    } else {
      this.addMessageFormGroup.markAllAsTouched()
      this.toast.error('Please fix the error.')
    }
  }

}
