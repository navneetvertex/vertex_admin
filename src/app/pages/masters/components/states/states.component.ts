import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MastersService } from 'src/app/core/services/masters.service';
import { ToastService } from 'src/app/shared/ui/toast/toast-service';

@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.scss']
})
export class StatesComponent implements OnInit {

  constructor(private masterService: MastersService,
    private toasterService: ToastService,
  ) { }
  breadCrumbItems: Array<{}>;
  title = 'States';

  addFormGroup : FormGroup;
  editFormGroup : FormGroup;

  listAll: any[] = []
  total: number = 0;
  page: number = 1;
  pageSize: number = 10;

  addForm: boolean = true;
  editForm: boolean = false;

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Master' }, { label: 'States', active: true }];

    this.addFormGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      active: new FormControl(true, Validators.required)
    });

    this.editFormGroup = new FormGroup({
      _id: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      active: new FormControl(true, Validators.required)
    });

    this.getList();
  }

  onSubmit() {
    if (this.addFormGroup.valid) {
      console.log('Adding State:', this.addFormGroup.value);
      this.masterService.createState(this.addFormGroup.value).subscribe({
        next: (response: any) => {
          this.toasterService.show('State added successfully', {
            classname: 'bg-success text-light',
            delay: 5000
          });
          this.getList();
        },
        error: (error: any) => {
          console.error('Error adding state:', error);
          this.toasterService.show('Failed to add state', {
            classname: 'bg-danger text-light',
            delay: 5000
          });
        }
      });
      this.addFormGroup.reset();
    } else {
      console.error('Form is invalid');
    }
  }

  onEdit() {
    if (this.editFormGroup.valid) {
      console.log('Editing State:', this.editFormGroup.value);
      this.masterService.updateState(this.editFormGroup.value._id, this.editFormGroup.value).subscribe({
        next: (response: any) => {
          this.toasterService.show('State updated successfully', {
            classname: 'bg-success text-light',
            delay: 5000
          });
          this.getList();
          this.editFormGroup.reset();
          this.addForm = true;
          this.editForm = false;  
        },
        error: (error: any) => {
          console.error('Error updating state:', error);
          this.toasterService.show('Failed to update state', {
            classname: 'bg-danger text-light',
            delay: 5000
          });
        }
      });
      
    } else {
      console.error('Edit form is invalid');
    }
  }

  onEditState(state: any) {
    this.addForm = false;
    this.editForm = true;
    this.editFormGroup.patchValue({
      _id: state._id,
      name: state.name,
      status: state.status
    });
  }

  getList() {
    this.masterService.getStates(this.page, this.pageSize).subscribe({
      next: (response: any) => {
        this.listAll = response.results;
        this.total = response.total;
      },
      error: (error: any) => {
        console.error('Error fetching states:', error);
        this.toasterService.show('Failed to load states', {
          classname: 'bg-danger text-light',
          delay: 5000
        });
      }
    });
  }

  pageChange(event: any) {
    this.page = event;
    this.getList();
  }

  findPageShowing(): number {
    return Math.min(this.page * this.pageSize, this.total)
  }

}
