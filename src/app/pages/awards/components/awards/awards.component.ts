import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AwardsService } from 'src/app/core/services/awards.service';

@Component({
  selector: 'app-awards',
  templateUrl: './awards.component.html',
  styleUrls: ['./awards.component.scss']
})
export class AwardsComponent implements OnInit {

  constructor(private awardsService: AwardsService,
    private toast: ToastrService,
    private modalService: NgbModal  
  ) { }

  awardsList: any[] = []
  breadCrumbItems: Array<{}>;
  total: number = 0;
  page: number = 1;
  pageSize: number = 10;
  createFormGroup: FormGroup 
  editFormGroup: FormGroup
  search: string = ''

  ngOnInit(): void {
     this.breadCrumbItems = [{ label: 'Awards' }, { label: 'All', active: true }];
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

  getAwards() {
    this.awardsService.getAwards(this.page, this.pageSize).subscribe((res: any) => {
      this.awardsList = res.data.awards;
      this.total = res.data.total;
    });
  }
  createAward() {

    if (this.createFormGroup.invalid) {
      this.toast.error('Please fill all required fields', 'Error');
      this.createFormGroup.markAllAsTouched();
      this.createFormGroup.markAsDirty();
      return;
    }

    this.awardsService.createAward(this.createFormGroup.value).subscribe((res: any) => {
      this.getAwards();
      this.createFormGroup.reset();
    });
  }
  editAward() {

    if (this.editFormGroup.invalid) {
      this.toast.error('Please fill all required fields', 'Error');
      this.editFormGroup.markAllAsTouched();
      this.editFormGroup.markAsDirty();
      return;
    }

    this.awardsService.updateAward(this.editFormGroup.get('_id').value,   this.editFormGroup.value).subscribe((res: any) => {
      this.getAwards();
      this.editFormGroup.reset();
    });
  }
  deleteAward(id: string) {
    this.awardsService.deleteAward(id).subscribe((res: any) => {
      this.getAwards();
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
    this.getAwards();
  }
  onPageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.getAwards();
  }

  onSearch($event: any) {
    this.search = $event.target.value
    this.page = 1
    this.getAwards()
  }

  openModal(content: any) {
    this.modalService.open(content)
  }

  findPageShowing(): number {
    return Math.min(this.page * this.pageSize, this.total)
  }

  pageChange($event: number) {
    this.page = $event
  }

}
