import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../ui/notification/toast-service';
import { ToastrService } from 'ngx-toastr';
import { CricketDataService } from 'src/app/core/services/cricket-data.service';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { BannerService } from 'src/app/core/services/banner.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

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
    this.breadCrumbItems = [{ label: 'Banner' }, { label: 'List Banners', active: true }];
    this.saveBannerFormGroup = new FormGroup({
      type: new FormControl('', Validators.required),
      image: new FormControl(null),
      series: new FormControl(''),
      series_txt: new FormControl(null),
      match_id: new FormControl(null),
      url: new FormControl(null),
    })

    this.getSeriesList()
    this.getBanner()
    this.getUpcomingMatches()

    this.editBannerFormGroup = new FormGroup({
      type: new FormControl('', Validators.required),
      image: new FormControl('', Validators.required),
      _id: new FormControl('', Validators.required),
      series: new FormControl(null),
      series_txt: new FormControl(null),
      match_id: new FormControl(null),
      url: new FormControl(null),
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
    this.fakeImgURL = banner.image
    this.editBannerFormGroup.patchValue(banner)
  }

  getSeriesList() {
    this.cricketDataService.getSeriesList().subscribe((data: any) => {
      this.seriesList = data.data.series_list
    })
  }

  getUpcomingMatches() {
    this.cricketDataService.getUpcomingMatches().subscribe((data: any) => {
      this.upcomingMatches = data.data.matches
      this.upcomingMatches.forEach((el: any, index) => {
        this.upcomingMatches[index].label = `${el.team_a_short} vs ${el.team_b_short} (${el.match_type}) - ${el.date_wise} ${el.match_time}`
      })
    })
  }

  onEdit() {
    const payload = this.editBannerFormGroup.value
    console.log(payload)
    if(this.editBannerFormGroup.valid) {
      if(this.fileList.length == 1) {
        if(payload.type === 'live') {
          payload.match_date = this.upcomingMatches.filter(es => es.match_id === payload.match_id)[0].match_date
          payload.match_time = this.upcomingMatches.filter(es => es.match_id === payload.match_id)[0].match_time
        }
        this.fileUploadService.uploadFile(this.fileList[0]).subscribe((data: any) => {
          payload.image = data.file
          if(payload.series) {
            payload.series_txt = this.seriesList.filter((es: any) => es.series_id === payload.series)[0].series
          }
          this.bannerService.updateBanner(payload._id, payload).subscribe(_ => {
            this.editBannerFormGroup.reset()
            this.showBanner = false
            this.banner_type = ''
            this.showEditBanner = false
            this.getBanner()
            this.toast.success('Banner is successully edited.')
          })
        })
      } else {
        this.bannerService.updateBanner(payload._id, payload).subscribe(_ => {
          this.editBannerFormGroup.reset()
          this.showBanner = false
          this.showEditBanner = false
          this.getBanner()
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
        if(payload.type === 'live') {
          payload.match_date = this.upcomingMatches.filter(es => es.match_id === payload.match_id)[0].match_date
          payload.match_time = this.upcomingMatches.filter(es => es.match_id === payload.match_id)[0].match_time
        }
        this.fileUploadService.uploadFile(this.fileList[0]).subscribe((data: any) => {
          payload.image = data.file
          if(payload.series) {
            payload.series_txt = this.seriesList.filter((es: any) => es.series_id === payload.series)[0].series
          }
          this.bannerService.createBanner(payload).subscribe(_ => {
            this.saveBannerFormGroup.reset()
            this.showBanner = false
            this.showEditBanner = false
            this.saveBannerFormGroup.patchValue({type: ''})
            this.banner_type = ''
            this.getBanner()
            this.toast.success('Banner is successully created.')
          })
        })
      } else {
        this.toast.show('Please select the file to continue.')
      }
    } else {
      this.toast.warning('Please solve the error to continue.')
    }
  }

  getBanner() {
    this.bannerService.getBanner().subscribe((data: any) => {
      this.allBanner = data.data.banner
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
        this.bannerService.deleteBanner(id).subscribe(_ => {
          this.toast.success('Banner is successfully deleted.')
          this.getBanner()
        })
      }
    });
  }

}
