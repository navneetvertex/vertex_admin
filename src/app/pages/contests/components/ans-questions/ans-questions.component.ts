import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CricketDataService } from 'src/app/core/services/cricket-data.service';
import { QuizService } from 'src/app/core/services/quiz.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ans-questions',
  templateUrl: './ans-questions.component.html',
  styleUrls: ['./ans-questions.component.scss']
})
export class AnsQuestionsComponent implements OnInit {

  constructor(private cricketDataService: QuizService,
    private toast: ToastrService
  ) { }
  breadCrumbItems: Array<{}>;
  quizList: any = [];

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Contest' }, { label: 'Answer Contest', active: true }];
    this.getQuizToDeclareResult();
  }

  getQuizToDeclareResult() {
    this.cricketDataService.get_contest_question_to_answer().subscribe((res: any) => {
      this.quizList = res.data.result;
    })
  }

  yesAnswer(quiz: any, answer: any) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, allow it!"
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(quiz);
        //question, answer, match_id, total
        this.runApi({question: quiz._id, answer: answer, match_id: quiz.match_id, total: quiz.total_marks});
      }
    });
  }

  noAnswer(quiz: any, answer: any) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, allow it!"
    }).then((result) => {
      if (result.isConfirmed) {
        //question, answer, match_id, total
        this.runApi({question: quiz._id, answer: answer, match_id: quiz.match_id, total: quiz.total_marks});
      }
    });
  }

  runApi(payload: any) {
    this.cricketDataService.answerQuestion(payload).subscribe((res: any) => {
      this.getQuizToDeclareResult();
      this.toast.success('Quiz is successfully answered.')
    })
  }

}
