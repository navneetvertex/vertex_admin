import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BannerService } from 'src/app/core/services/banner.service';
import { CricketDataService } from 'src/app/core/services/cricket-data.service';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-updated',
  templateUrl: './updated.component.html',
  styleUrls: ['./updated.component.scss']
})
export class UpdatedComponent implements OnInit {

  constructor(private toast: ToastrService,
      private bannerService: BannerService,
      private fileUploadService: FileUploadService,
      private cricketDataService: CricketDataService) { }
    breadCrumbItems: Array<{}>;
    seriesList: any[] = [];
    upcomingMatches: any[] = []
    banner_type: string = ''
    allBanner : Array<{}>;
    showBanner : boolean = false
    showEditBanner : boolean = false
    saveBannerFormGroup: FormGroup
    editBannerFormGroup: FormGroup
    fileList: any = []
    fakeImgURL: string = ''
  
  
    ngOnInit(): void {
      this.breadCrumbItems = [{ label: 'Updates' }, { label: 'List Updates', active: true }];
      this.saveBannerFormGroup = new FormGroup({
        type: new FormControl('', Validators.required),
        imgSrc: new FormControl(null),
        href: new FormControl(''),
        title: new FormControl(null),
        body: new FormControl(null),
        source: new FormControl('Cricket Live Desk'),
        date: new FormControl(new Date().toDateString()),
      })

      this.getUpdates()
  
      this.editBannerFormGroup = new FormGroup({
        type: new FormControl('', Validators.required),
        imgSrc: new FormControl('', Validators.required),
        _id: new FormControl('', Validators.required),
        href: new FormControl(null),
        title: new FormControl(null),
        body: new FormControl(null),
        source: new FormControl(null),
        date: new FormControl(null),
      })
    }
  
    changeBannerType(val : any) {
      this.banner_type = val.value
    }
  
    uploadFile(event: Event) {
      const element = event.currentTarget as HTMLInputElement;
      this.fileList = element.files;
    }
  
    editBanner(banner) {
      this.showBanner = false
      this.showEditBanner = true
      this.banner_type = banner.type
      this.fakeImgURL = banner.imgSrc
      this.editBannerFormGroup.patchValue(banner)
    }
  
    onEdit() {
      const payload = this.editBannerFormGroup.value
      console.log(payload)
      if(this.editBannerFormGroup.valid) {
        if(this.fileList.length == 1) {
          this.fileUploadService.uploadFile(this.fileList[0]).subscribe((data: any) => {
            payload.imgSrc = data.file
            this.bannerService.updateUpdates( payload).subscribe(_ => {
              this.editBannerFormGroup.reset()
              this.showBanner = false
              this.banner_type = ''
              this.showEditBanner = false
              this.getUpdates()
              this.toast.success('Banner is successully edited.')
            })
          })
        } else {
          this.bannerService.updateBanner(payload._id, payload).subscribe(_ => {
            this.editBannerFormGroup.reset()
            this.showBanner = false
            this.showEditBanner = false
            this.getUpdates()
            this.toast.success('Banner is successully edited.')
          })
        }
      } else {
        this.toast.warning('Please solve the error to continue.')
      }
    }
  
    onSave() {
      const payload = this.saveBannerFormGroup.value
      if(this.saveBannerFormGroup.valid) {
        if(this.fileList.length == 1) {
          
          this.fileUploadService.uploadFile(this.fileList[0]).subscribe((data: any) => {
            payload.imgSrc = data.file
            this.bannerService.createUpdates(payload).subscribe(_ => {
              this.saveBannerFormGroup.reset()
              this.showBanner = false
              this.showEditBanner = false
              this.saveBannerFormGroup.patchValue({type: ''})
              this.banner_type = ''
              this.getUpdates()
              this.toast.success('Updates is successully created.')
            })
          })
        } else {
          this.toast.show('Please select the file to continue.')
        }
      } else {
        this.toast.warning('Please solve the error to continue.')
      }
    }
    
    getUpdates() {
      this.bannerService.getUpdates().subscribe((data: any) => {
        this.allBanner = data.data
      })
    }
  
    deleteBanner(id: string) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.bannerService.deleteUpdates(id).subscribe(_ => {
            this.toast.success('Banner is successfully deleted.')
            this.getUpdates()
          })
        }
      });
    }
  
}
