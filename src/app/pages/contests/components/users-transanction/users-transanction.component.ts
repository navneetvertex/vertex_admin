import { Component, OnInit } from '@angular/core';
import { QuizService } from 'src/app/core/services/quiz.service';

@Component({
  selector: 'app-users-transanction',
  templateUrl: './users-transanction.component.html',
  styleUrls: ['./users-transanction.component.scss']
})
export class UsersTransanctionComponent implements OnInit {

  constructor(private cricketDataService: QuizService,) { }
  breadCrumbItems: Array<{}>;
  transanctionList: any = [];

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Contest' }, { label: 'User Transanction', active: true }];
    this.get_user_transanctions();
  }

  get_user_transanctions() {
    this.cricketDataService.get_user_transanctions().subscribe((res: any) => {
      this.transanctionList = res.data.result;
      console.log(this.transanctionList)
    })
  }

}
