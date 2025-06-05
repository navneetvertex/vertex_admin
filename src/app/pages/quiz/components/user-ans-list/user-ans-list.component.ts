import { Component, OnInit } from '@angular/core';
import { CricketDataService } from 'src/app/core/services/cricket-data.service';

@Component({
  selector: 'app-user-ans-list',
  templateUrl: './user-ans-list.component.html',
  styleUrls: ['./user-ans-list.component.scss']
})
export class UserAnsListComponent implements OnInit {

  constructor(private cricketDataService: CricketDataService ) { }
  breadCrumbItems: Array<{}>;
  matchList: any[] = []
  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Quiz' }, { label: 'User count', active: true }];
    this.getDeclaredMatchList()
  }

  getDeclaredMatchList() {
    this.cricketDataService.getUndeclaredResult().subscribe((data: any) => {
        this.matchList = data.data.answer
        console.log(this.matchList)
    })
  }

}
