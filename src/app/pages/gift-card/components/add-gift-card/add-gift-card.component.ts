import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-gift-card',
  templateUrl: './add-gift-card.component.html',
  styleUrls: ['./add-gift-card.component.scss']
})
export class AddGiftCardComponent implements OnInit {

  constructor() { }
  breadCrumbItems: Array<{}>;
  addGiftFormGroup: FormGroup;

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Gift Card Management' }, { label: 'Add', active: true }];
    this.addGiftFormGroup = new FormGroup({
      gift_name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(500)]),
      quantity: new FormControl('', [Validators.required, Validators.min(1)]),
      status: new FormControl('', [Validators.required])
    });
  }

}
