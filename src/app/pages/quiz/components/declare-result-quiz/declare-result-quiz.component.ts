import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CricketDataService } from 'src/app/core/services/cricket-data.service';
import { QuizService } from 'src/app/core/services/quiz.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-declare-result-quiz',
  templateUrl: './declare-result-quiz.component.html',
  styleUrls: ['./declare-result-quiz.component.scss']
})
export class DeclareResultQuizComponent implements OnInit {

  getQuizFormGroup: FormGroup
  editQuizFormGroup: FormGroup
  breadCrumbItems: Array<{}>;
  match_id: string = ''
  match_id_id: string = ''
  totalMarks : number = 0
  questionList: any[] = []
  upcomingMatches : any[] = []
  scoreMarks : any[] = []
  finalize: boolean = true
  finalizeBtn: boolean = true

  constructor(private cricketDataService: CricketDataService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private quizService: QuizService) {
      this.route.queryParams.subscribe(params => {
        this.match_id = params['match_id'];
        if(this.match_id) this.getQuiz(this.match_id)
    });
     }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Quiz' }, { label: 'Declare Result', active: true }];
    this.getUpcomingMatches()
    this.getQuizFormGroup = new FormGroup({
      match_id: new FormControl('', Validators.required)
    })
    this.finalizeBtn = this.questionList.some(es => { return es.result || es.marks === 0 })
    
    if(this.match_id) this.getQuizFormGroup.patchValue({match_id: this.match_id})
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
    this.cricketDataService.getRecentMatches().subscribe((data: any) => {
      this.upcomingMatches = data.data.matches
      this.upcomingMatches.forEach((el: any, index) => {
        this.upcomingMatches[index].label = `${el.team_a_short} vs ${el.team_b_short}  ${el.match_id} (${el.match_type}) - ${el.date_wise} ${el.match_time}`
      })
    })
  }

  setMarks(_id: string, val: any) {
    this.quizService.declareQuizResult({_id: _id, marks: val.value, match_id: this.match_id}).subscribe(_ => {
      this.totalMarks += Number(val.value)
      this.toast.success('Result is declared.')
      this.finalizeBtn = this.questionList.some(es => { return es.result || es.marks === 0 })
    })
  }

  onSave() {
    if(this.getQuizFormGroup.valid) {
      this.match_id = this.getQuizFormGroup.get('match_id')?.value
      this.getQuiz(this.match_id)
    }
  }

  getQuiz (match_id: string) {
    this.questionList = []
    this.quizService.getQuizToDeclareResult(match_id).subscribe((data: any) => {
      if(data.data.quiz) {
        this.questionList = data.data.quiz.quiz
        this.match_id_id = data.data.quiz._id
        this.finalize = data.data.quiz.finalize
        this.totalMarks = this.questionList.reduce((acc, b) => acc + b.marks, 0);
        console.log(this.questionList)
        this.scoreMarks = this.createSCore(100, this.questionList.length)
      } else {
        this.toast.warning('No Quiz found.')
      }
    })
  }

  createSCore(total, numElements) {
    const quotient = Math.floor(total / numElements);
    const remainder = total % numElements;
    const result = Array(numElements).fill(quotient);
    for (let i = 0; i < remainder; i++) {
      result[i] += 1;
    }

    return [...new Set(result)];;
  }

  saveResult(val: any, _id: string) {
    this.quizService.declareQuizResult({_id: _id, result: val, match_id: this.match_id}).subscribe(_ => {
      this.toast.success('Result is declared.')
      this.getQuiz(this.match_id)
      this.finalizeBtn = this.questionList.some(es => { return es.result || es.marks === 0 })
    })
  }

  finalizeResult() {
    
    let timerInterval;
    Swal.fire({
      title: "Are you sure?",
      html: "Please type <i>CONFIRM ME</i> to process it? <b></b> seconds left.",
      icon: "warning",
      input: "text",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      timer: 10000,
      timerProgressBar: true,
      confirmButtonText: "Yes, confirm it!",
      didOpen: () => {
        const timer = Swal.getPopup().querySelector("b");
        timerInterval = setInterval(() => {
          timer.textContent = `${Math.floor(Swal.getTimerLeft()/1000)}`;
        }, 1000);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      if (result.isConfirmed) {
        if(result.value === 'CONFIRM ME') {
          this.quizService.finalizeQuiz({_id: this.match_id_id}).subscribe(_ => {
            this.toast.success('Quiz is successfully finalized.')
          })
        } else {
          this.toast.error('Incorrect text entered.')
        }
      }
    });
  }


}
