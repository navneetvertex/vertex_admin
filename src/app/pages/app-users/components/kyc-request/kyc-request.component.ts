import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-kyc-request',
  templateUrl: './kyc-request.component.html',
  styleUrls: ['./kyc-request.component.scss']
})
export class KycRequestComponent implements OnInit {

  constructor() { }
  breadCrumbItems: Array<{}>;

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Members' }, { label: 'KYC Requested', active: true }];
  }

}
