import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CareersService } from 'src/app/core/services/careers.service';

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
  
    awardsList: any[] = []
    breadCrumbItems: Array<{}>;
    total: number = 0;
    page: number = 1;
    pageSize: number = 10;
    createFormGroup: FormGroup 
    editFormGroup: FormGroup
  
    ngOnInit(): void {
       this.breadCrumbItems = [{ label: 'Careers' }, { label: 'All', active: true }];
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
      this.careerService.getCareers(this.page, this.pageSize).subscribe((res: any) => {
        this.awardsList = res.data;
        this.total = res.total;
      });
    }
    createAward() {
  
      if (this.createFormGroup.invalid) {
        this.toast.error('Please fill all required fields', 'Error');
        this.createFormGroup.markAllAsTouched();
        this.createFormGroup.markAsDirty();
        return;
      }
  
      this.careerService.createCareer(this.createFormGroup.value).subscribe((res: any) => {
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
  
      this.careerService.updateCareer(this.editFormGroup.get('_id').value,   this.editFormGroup.value).subscribe((res: any) => {
        this.getAwards();
        this.editFormGroup.reset();
      });
    }
    deleteAward(id: string) {
      this.careerService.deleteCareer(id).subscribe((res: any) => {
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

}
