import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-distributor',
  templateUrl: './distributor.component.html',
  styleUrls: ['./distributor.component.scss']
})
export class DistributorComponent implements OnInit {

  constructor(private modalService: NgbModal) { }
  breadCrumbItems: Array<{}>;
  addDistrubutorForm: FormGroup;
  distributorList: any[] = [];

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Gift Card Management' }, { label: 'Distributor', active: true }];
    this.addDistrubutorForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
    });
  }

  openModal(content: any) {
    this.modalService.open(content, {backdrop: 'static', keyboard: false, size: 'lg'});
  }

  createDistrubutor() {
    // Logic to create a distributor
  }

}
