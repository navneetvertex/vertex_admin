import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CricketDataService } from 'src/app/core/services/cricket-data.service';
import { QuizService } from 'src/app/core/services/quiz.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-quiz',
  templateUrl: './list-quiz.component.html',
  styleUrls: ['./list-quiz.component.scss']
})
export class ListQuizComponent implements OnInit {

  constructor(private cricketDataService: CricketDataService,
    private modalService: NgbModal,
    private toast: ToastrService,
    private quizService: QuizService) { }
  getQuizFormGroup: FormGroup
  editQuizFormGroup: FormGroup
  breadCrumbItems: Array<{}>;
  match_id: string = ''
  match_id_id: string = ''
  questionList: any[] = []
  upcomingMatches : any[] = []

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Quiz' }, { label: 'List Quiz', active: true }];
    this.getUpcomingMatches()
    this.getQuizFormGroup = new FormGroup({
      match_id: new FormControl('', Validators.required)
    })
    this.editQuizFormGroup = new FormGroup({
      question: new FormControl('', Validators.required),
      A: new FormControl('', Validators.required),
      B: new FormControl('', Validators.required),
      C: new FormControl('', Validators.required),
      D: new FormControl('', Validators.required),
      _id: new FormControl('', Validators.required),
    })
  }

  getUpcomingMatches() {
    this.cricketDataService.getUpcomingMatches().subscribe((data: any) => {
      this.upcomingMatches = data.data.matches
      this.upcomingMatches.forEach((el: any, index) => {
        this.upcomingMatches[index].label = `${el.team_a_short} vs ${el.team_b_short} - ${el.match_id} (${el.match_type}) - ${el.date_wise} ${el.match_time}`
      })
    })
  }

  onSave() {
    if(this.getQuizFormGroup.valid) {
      this.match_id = this.getQuizFormGroup.get('match_id')?.value
      this.getQuiz()
    }
  }

  getQuiz () {
    this.questionList = []
    this.quizService.get(this.match_id).subscribe((data: any) => {
      if(data.data.quiz) {
        this.questionList = data.data.quiz.quiz
        this.match_id_id = data.data.quiz._id
      } else {
        this.toast.warning('No Quiz found.')
      }
    })
  }

  editQuizModal(payload: any, content: any) {
    this.editQuizFormGroup.patchValue(payload)
    this.modalService.open(content)
  }

  editQuiz() {
    if(this.editQuizFormGroup.valid) {
      const payload = this.editQuizFormGroup.value
      this.quizService.updateQuiz(payload).subscribe(_ => {
        this.toast.success('Quiz is successfully updated.')
        this.modalService.dismissAll()
        this.getQuiz()
      })
    }
  }

  deleteQuiz(_id: string) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.quizService.deleteQuiz({id: _id},this.match_id_id).subscribe(_ => {
          this.toast.success('Quiz is successfully deleted.')
          this.getQuiz()
        })
      }
    });
  }

  isAllCheckBoxChecked() {
		return this.questionList.every(p => p.checked);
	}

  isAnyCheckBoxSelected() {
    return !this.questionList.some((x: any) => x.checked == true)
  }

  checkAllCheckBox(ev: any) {
		this.questionList.forEach((x: any) => x.checked = ev.target.checked)
	}

  enableQuestion() {
    const questions_selected = this.questionList.map(es => { if(es.checked) return es._id  }).filter(es => es !== undefined)
    this.quizService.make_active_quiz(questions_selected).subscribe(_ => {
      this.toast.success('Quiz is successfully marked active and enable to all users.')
      this.getQuiz()
    })
  }

}
