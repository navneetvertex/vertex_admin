import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-member-fees',
  templateUrl: './member-fees.component.html',
  styleUrls: ['./member-fees.component.scss']
})
export class MemberFeesComponent implements OnInit {

  constructor() { }
  breadCrumbItems: Array<{}>;
  memberFeesFormGroup: FormGroup

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Settings' }, { label: 'General', active: true }];

    this.memberFeesFormGroup = new FormGroup({
      shared_money: new FormControl('0', [Validators.required, Validators.min(0)]),
      compulsory_deposit: new FormControl('0', [Validators.required, Validators.min(0)]),
      admission_fees: new FormControl('0', [Validators.required, Validators.min(0)]),
      building_fund: new FormControl('0', [Validators.required, Validators.min(0)]),
      welfare_fund: new FormControl('0', [Validators.required, Validators.min(0)]),
      other_deposit: new FormControl('0', [Validators.required, Validators.min(0)])
    });
  }

  number(num: string): number {
    return Number(num)

  }

}
