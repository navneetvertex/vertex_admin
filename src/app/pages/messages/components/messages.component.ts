import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  constructor() { }
  breadCrumbItems: Array<{}>;
  addMessageFormGroup: FormGroup;

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Messages' }, { label: 'Create', active: true }];
    this.addMessageFormGroup = new FormGroup({
      title: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required),
    });
  }

}
