import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PinsService } from 'src/app/core/services/pins.service';
import { UserProfileService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-pins',
  templateUrl: './add-pins.component.html',
  styleUrls: ['./add-pins.component.scss']
})
export class AddPinsComponent implements OnInit {

  constructor(private modalService: NgbModal,
    private toast: ToastrService,
    private userService: UserProfileService ,
    private pinService: PinsService
  ) { }
  breadCrumbItems: Array<{}>;
  addPinFormGroup : FormGroup
  assignFormGroup: FormGroup;

  pinList: any[] = []
  total: number = 0;
  page: number = 1;
  pageSize: number = 10;

  userList: any[] = [];

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Pin Management' }, { label: 'Add Pins', active: true }];
    this.addPinFormGroup = new FormGroup({
      assign_to: new FormControl(''),
      no_of_pins: new FormControl('', Validators.required),
    });

    this.getAllUsers();
    this.assignFormGroup = new FormGroup({
      assign_to: new FormControl('' , Validators.required),
    });
    this.getPins('unassigned');
  }

  getAllUsers() {
    this.userService.getAllUserIds().subscribe((res: any) => {
      if (res && res.data) {
        this.userList = res.data.users
      }
    })
  }

  openModal(content: any) {
    this.modalService.open(content);
  }

  getPins(request: string) {
    this.pinService.getPins(request, this.page, this.pageSize).subscribe((res: any) => {
      if (res && res.data) {
        this.pinList = res?.data?.pins || [];
        this.total = res?.data?.total || 0;
      } else {
        this.pinList = [];
      }
    }, (err: any) => {
      console.error('Error fetching pin list:', err);
      this.pinList = [];
    });
  }


  pinSelected : any[] = []
  pinChecked(event: any) {
    if(event.target.checked) {
      this.pinSelected.push(event.target.value);
    }
    else {
      this.pinSelected = this.pinSelected.filter((pin: any) => pin !== event.target.value);
    }
    console.log('Selected Pins:', this.pinSelected);
  }
  

  findPageShowing(): number {
    return Math.min(this.page * this.pageSize, this.total)
  }

  pageChange(page: number) {
    this.page = page;
    this.getPins('unassigned');
  }

  createPins() {
    if (this.addPinFormGroup.invalid) {
      this.toast.error('Please fill all required fields');
      return;
    }
    this.pinService.createPin(this.addPinFormGroup.value).subscribe({
      next: (res: any) => {
        this.toast.success('Pins created successfully');
        this.addPinFormGroup.reset();
        this.modalService.dismissAll();
      }
      , error: (err: any) => {  
        this.toast.error('Failed to create pins');
      }
    });
  }

  assignPins() {
    if (this.assignFormGroup.invalid || this.pinSelected.length === 0) {
      this.toast.error('Please select pins and assign to a user');
      return;
    }
    const payload = {
      assign_to: this.assignFormGroup.value.assign_to,
      pins: this.pinSelected
    };
    this.pinService.assignPins(payload).subscribe({
      next: (res: any) => {
        this.toast.success('Pins assigned successfully');
        this.assignFormGroup.reset();
        this.pinSelected = [];
        this.modalService.dismissAll();
        this.getPins('unassigned');
      },
      error: (err: any) => {
        this.toast.error('Failed to assign pins');
      }
    });
  }

  disablePin() {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to disable this pin?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, disable it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.toast.success('Pin disabled successfully');
      }
    });
  }

}
