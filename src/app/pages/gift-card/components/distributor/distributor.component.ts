import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-distributor',
  templateUrl: './distributor.component.html',
  styleUrls: ['./distributor.component.scss']
})
export class DistributorComponent implements OnInit {

  constructor() { }
  breadCrumbItems: Array<{}>;

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Gift Card Management' }, { label: 'Distributor', active: true }];
  }

}
