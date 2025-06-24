import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MastersService } from "src/app/core/services/masters.service";
import { ToastService } from "src/app/shared/ui/toast/toast-service";

@Component({
  selector: "app-areas",
  templateUrl: "./areas.component.html",
  styleUrls: ["./areas.component.scss"],
})
export class AreasComponent implements OnInit {
  constructor(
    private masterService: MastersService,
    private toasterService: ToastService
  ) {}
  breadCrumbItems: Array<{}>;
  title = "Area";

  addFormGroup: FormGroup;
  editFormGroup: FormGroup;

  listAll: any[] = [];
  stateList: any[] = [];
  districtList: any[] = [];
  total: number = 0;
  page: number = 1;
  pageSize: number = 10;

  addForm: boolean = true;
  editForm: boolean = false;

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Master" },
      { label: this.title, active: true },
    ];

    this.addFormGroup = new FormGroup({
      name: new FormControl("", Validators.required),
      state: new FormControl("", Validators.required),
      district: new FormControl("", Validators.required),
      active: new FormControl(true, Validators.required),
    });

    this.editFormGroup = new FormGroup({
      _id: new FormControl("", Validators.required),
      name: new FormControl("", Validators.required),
      state: new FormControl("", Validators.required),
      district: new FormControl("", Validators.required),
      active: new FormControl(true, Validators.required),
    });

    this.getAllStates();
    this.getList();
  }

  onSubmit() {
    if (this.addFormGroup.valid) {
      this.masterService.createArea(this.addFormGroup.value).subscribe({
        next: (response: any) => {
          this.toasterService.show("State added successfully", {
            classname: "bg-success text-light",
            delay: 5000,
          });
          this.getList();
        },
        error: (error: any) => {
          console.error("Error adding state:", error);
          this.toasterService.show("Failed to add state", {
            classname: "bg-danger text-light",
            delay: 5000,
          });
        },
      });
      this.addFormGroup.reset();
    } else {
      console.error("Form is invalid");
    }
  }

  onEdit() {
    if (this.editFormGroup.valid) {
      console.log("Editing State:", this.editFormGroup.value);
      this.masterService
        .updateArea(this.editFormGroup.value._id, this.editFormGroup.value)
        .subscribe({
          next: (response: any) => {
            this.toasterService.show("State updated successfully", {
              classname: "bg-success text-light",
              delay: 5000,
            });
            this.getList();
            this.editFormGroup.reset();
            this.addForm = true;
            this.editForm = false;
          },
          error: (error: any) => {
            console.error("Error updating state:", error);
            this.toasterService.show("Failed to update state", {
              classname: "bg-danger text-light",
              delay: 5000,
            });
          },
        });
    } else {
      console.error("Edit form is invalid");
    }
  }

  onEditState(state: any) {
    this.addForm = false;
    this.editForm = true;
    this.editFormGroup.patchValue({
      _id: state._id,
      name: state.name,
      state: state.state._id,
      status: state.status,
    });
  }

  getList() {
    this.masterService.getAreas(this.page, this.pageSize).subscribe({
      next: (response: any) => {
        console.log("Fetched States:", response);
        this.listAll = response.results;
        this.total = response.total;
      },
      error: (error: any) => {
        console.error("Error fetching states:", error);
        this.toasterService.show("Failed to load states", {
          classname: "bg-danger text-light",
          delay: 5000,
        });
      },
    });
  }

  getAllStates() {
    this.masterService.getAllStates().subscribe({
      next: (response: any) => {
        this.stateList = response.data;
      },
      error: (error: any) => {
        console.error("Error fetching all states:", error);
        this.toasterService.show("Failed to load all states", {
          classname: "bg-danger text-light",
          delay: 5000,
        });
      },
    });
  }

  getAllDistricts(stateId: string) {
    this.masterService.getAllDistricts(stateId).subscribe({
      next: (response: any) => {
        console.log("Fetched Districts:", response);
        this.districtList = response.data;
      },
      error: (error: any) => {
        console.error("Error fetching all states:", error);
        this.toasterService.show("Failed to load all states", {
          classname: "bg-danger text-light",
          delay: 5000,
        });
      },
    });
  }

  pageChange(event: any) {
    this.page = event;
    this.getList();
  }

  findPageShowing(): number {
    return Math.min(this.page * this.pageSize, this.total);
  }
}
