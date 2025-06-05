import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CricketDataService } from 'src/app/core/services/cricket-data.service';
import { QuizService } from 'src/app/core/services/quiz.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-match-quiz',
  templateUrl: './all-match-quiz.component.html',
  styleUrls: ['./all-match-quiz.component.scss']
})
export class AllMatchQuizComponent implements OnInit {

  constructor(private cricketDataService: CricketDataService,
    private toast: ToastrService,
    private modalService: NgbModal,
    private quizService: QuizService
  ) { }
  breadCrumbItems: Array<{}>;
  upcomingMatches : any[] =[]
  questionList: any[] =[]
  addQuizFormGroup: FormGroup
  editQuizFormGroup: FormGroup

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Quiz' }, { label: 'Add Common Quiz', active: true }];
    this.getCommonQuiz()
    this.addQuizFormGroup = new FormGroup({
      quiz: new FormArray([
        new FormGroup({
          question : new FormControl('', Validators.required),
          type: new FormControl('4options', Validators.required),
          runAfter: new FormControl('', Validators.required),
          A: new FormControl(''),
          B: new FormControl(''),
          C: new FormControl(''),
          D: new FormControl(''),
        })
      ])
    })

    this.editQuizFormGroup = new FormGroup({
      question : new FormControl('', Validators.required),
      runAfter: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      _id: new FormControl('', Validators.required),
      A: new FormControl(''),
      B: new FormControl(''),
      C: new FormControl(''),
      D: new FormControl(''),
    })
  }



  questionTypeChange(val: any, pk: any) {
    if(val.value === 'boolean') {
      pk.value.A = 'Yes'
      pk.value.B = 'No'
    } else if(val.value === 'team') {
      pk.value.A = '#TEAM1'
      pk.value.B = '#TEAM2'
    }
  }

  changeeditquestion(val: any) {
    if(val.value === 'boolean') {
      this.editQuizFormGroup.patchValue({A: 'Yes', B: 'No'})
    } else if(val.value === 'team') {
      this.editQuizFormGroup.patchValue({A: '#TEAM1', B: '#TEAM2'})
    }
  }

  editQuizModal(quiz: any, content: any) {
    if(quiz.type === 'boolean') {
      this.editQuizFormGroup.patchValue({A: 'Yes', B: 'No'})
    } else if(quiz.type === 'team') {
      this.editQuizFormGroup.patchValue({A: '#TEAM1', B: '#TEAM2'})
    }
    this.editQuizFormGroup.patchValue(quiz)
    this.modalService.open(content)
  }

  editQuiz() {
    if(this.editQuizFormGroup.valid) {
      const payload = this.editQuizFormGroup.value
      if(payload.type === 'boolean' || payload.type == 'team') {
        payload.C = ''
        payload.D = ''
      }
      this.quizService.common_quiz_edit(payload._id, payload).subscribe(_ => {
        this.toast.success('Quiz is successfully edited.')
        this.modalService.dismissAll()
        this.getCommonQuiz()
      })
    }
  }

  activeQuiz(id: string, bool: boolean) {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to change the status!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.quizService.common_quiz_edit(id,{active: bool}).subscribe(_ => {
          this.toast.success('Quiz is successfully edited.')
          this.getCommonQuiz()
        })
      }
    });
  }

  get quiz() : FormArray {
    return this.addQuizFormGroup.get("quiz") as FormArray
  }

  get newQuiz(): FormGroup{
    return new FormGroup({
        question : new FormControl('', Validators.required),
        type: new FormControl('4options', Validators.required),
        runAfter: new FormControl('', Validators.required),
        A: new FormControl(''),
        B: new FormControl(''),
        C: new FormControl(''),
        D: new FormControl(''),
    })
  }

  removeQuiz(index: number) {
    this.quiz.removeAt(index)
  }

  addQuiz() {
    const index = this.quiz.length - 1
    var arrayControl = this.addQuizFormGroup.get('quiz') as FormArray;
    var item = arrayControl.at(index);
    if(item.value.question == '' || item.value.type == '') {
      this.toast.warning('All Fields are required.')
    } else {
      this.quiz.push(this.newQuiz);
    }
  }

  getCommonQuiz() {
    this.quizService.common_quiz().subscribe((data: any) => {
      this.questionList = data.data.quiz
    })
  }

  onSave() {
    const payload = this.addQuizFormGroup.value
    payload.quiz.forEach((element, index) => {
      if(element.type === 'boolean') {
        payload.quiz[index].A = 'Yes'
        payload.quiz[index].B = 'No'
      } else if(element.type === 'team') {
        payload.quiz[index].A = '#TEAM1'
        payload.quiz[index].B = '#TEAM2'
      }
    });
    if(this.addQuizFormGroup.valid) {
      this.quizService.common_quiz_create(payload.quiz).subscribe(_ => {
        this.toast.success('Quiz is successfully added. Please approve the uploaded questionaire.')
        const quizArray = this.addQuizFormGroup.get('quiz') as FormArray;
        quizArray.reset()
        this.getCommonQuiz()
        this.addQuizFormGroup.reset()
      })
    }
  }

  deleteQuiz(_id: string) {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete it. You wont be able to revert it",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.quizService.common_quiz_delete(_id).subscribe(_ => {
          this.toast.success('Quiz is successfully deleted.')
          this.getCommonQuiz()
        })
      }
    });
  }

}
