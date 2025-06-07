import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CareersService } from 'src/app/core/services/careers.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-careers',
  templateUrl: './careers.component.html',
  styleUrls: ['./careers.component.scss']
})
export class CareersComponent implements OnInit {

constructor(private careerService: CareersService,
    private toast: ToastrService,
    private modalService: NgbModal  
  ) { }

  careerList: any[] = []
  breadCrumbItems: Array<{}>;
  total: number = 0;
  page: number = 1;
  pageSize: number = 10;
  createFormGroup: FormGroup 
  search: string = ''
  editFormGroup: FormGroup

  ngOnInit(): void {
      this.breadCrumbItems = [{ label: 'Careers' }, { label: 'All', active: true }];
      this.getCareer()
      this.createFormGroup = new FormGroup({
        title: new FormControl('', { nonNullable: true }),
        description: new FormControl('', { nonNullable: true }),
        status: new FormControl('Active', { nonNullable: true })
      })
      this.editFormGroup = new FormGroup({
        _id: new FormControl('', { nonNullable: true }),
        title: new FormControl('', { nonNullable: true }),
        description: new FormControl('', { nonNullable: true }),
        status: new FormControl('Active', { nonNullable: true })
      })
  }

  getCareer() {
    this.careerService.getCareers(this.page, this.pageSize, this.search).subscribe((res: any) => {
      this.careerList = res.data.careers;
      this.total = res.data.total;
    });
  }

  createCareer() {
    if (this.createFormGroup.invalid) {
      this.toast.error('Please fill all required fields', 'Error');
      this.createFormGroup.markAllAsTouched();
      this.createFormGroup.markAsDirty();
      return;
    }

    this.careerService.createCareer(this.createFormGroup.value).subscribe((res: any) => {
      this.getCareer();
      this.modalService.dismissAll()
      this.createFormGroup.reset();
    });
  }

  editCareer() {
    if (this.editFormGroup.invalid) {
      this.toast.error('Please fill all required fields', 'Error');
      this.editFormGroup.markAllAsTouched();
      this.modalService.dismissAll()
      this.editFormGroup.markAsDirty();
      return;
    }

    this.careerService.updateCareer(this.editFormGroup.get('_id').value,   this.editFormGroup.value).subscribe((res: any) => {
      this.getCareer();
      this.modalService.dismissAll()
      this.editFormGroup.reset();
    });
  }

  deleteCareer(id: string) {
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
        this.careerService.deleteCareer(id).subscribe((res: any) => {
          this.toast.success('Career deleted successfully', 'Success');
          this.getCareer();
        });
      }
    });
  }

  openEditModal(content: any, award: any) {
    this.modalService.open(content, { backdrop: 'static' });
    this.editFormGroup.patchValue({
      _id: award._id,
      title: award.title,
      description: award.description,
      status: award.status
    });
  }

  openCreateModal() {
    this.createFormGroup.reset({
      title: '',
      description: '',
      status: 'Active'
    });
  }

  onPageChange(page: number) {
    this.page = page;
    this.getCareer();
  }

  onPageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.getCareer();
  }

  findPageShowing(): number {
    return Math.min(this.page * this.pageSize, this.total)
  }

  openModal(content: any) {
    this.modalService.open(content)
  }

  onSearch($event: any) {
    this.search = $event.target.value
    this.page = 1
    this.getCareer()
  }

  pageChange($event: number) {
    this.page = $event
  }
 

}
