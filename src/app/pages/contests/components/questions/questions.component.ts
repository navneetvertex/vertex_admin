import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CricketDataService } from 'src/app/core/services/cricket-data.service';
import { QuizService } from 'src/app/core/services/quiz.service';
import { totalMarksValidator } from './totalMarksValidator';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {

  constructor(private cricketDataService: CricketDataService,
      private quizService: QuizService,
      private toast: ToastrService) { }
    breadCrumbItems: Array<{}>;
    fileList: any
    uploadButtonClicked : boolean = false
    addQuizFormGroup: FormGroup;
    selectedOption: any
    editQuizFormGroup: FormGroup;
    upcomingMatches: any[] = []
    listedQuiz: any[] = []
    editableTable: any;
        
    ngOnInit(): void {
      this.breadCrumbItems = [{ label: 'Contest' }, { label: 'Add Quiz', active: true }];
      this.getUpcomingMatches()
      this.addQuizFormGroup = new FormGroup({
        match_id: new FormControl('', Validators.required),
        category: new FormControl('', Validators.required),
        quiz: new FormArray([
          new FormGroup({
            question : new FormControl('', Validators.required),
            total_marks: new FormControl('10', Validators.required),
            isLiveQuestion: new FormControl(true),
            yes: new FormControl('', Validators.required),
            no: new FormControl('', Validators.required),
          }, { validators: totalMarksValidator() })
        ])
      })
      this.editQuizFormGroup = new FormGroup({
        quiz: new FormArray([
          new FormGroup({
            question : new FormControl('', Validators.required),
            total_marks: new FormControl('10', Validators.required),
            isLiveQuestion: new FormControl(true),
            _id: new FormControl('', Validators.required),
            yes: new FormControl('', Validators.required),
            no: new FormControl('', Validators.required),
            status: new FormControl(false, Validators.required),
          }, { validators: totalMarksValidator() })
        ])
      })
    }
  
    get quiz() : FormArray {
      return this.addQuizFormGroup.get("quiz") as FormArray
    }
  
    get newQuiz(): FormGroup{
      return new FormGroup({
        question : new FormControl('', Validators.required),
        total_marks: new FormControl('10', Validators.required),
        isLiveQuestion: new FormControl(true),
        yes: new FormControl('', Validators.required),
        status: new FormControl(false),
        no: new FormControl('', Validators.required),
      }, { validators: totalMarksValidator() })
    }

    get editquiz() : FormArray {
      return this.editQuizFormGroup.get("quiz") as FormArray
    }

    get neweditQuiz(): FormGroup{
      return new FormGroup({
        question : new FormControl('', Validators.required),
        total_marks: new FormControl('10', Validators.required),
        yes: new FormControl('', Validators.required),
        no: new FormControl('', Validators.required),
        _id: new FormControl('', Validators.required),
        status: new FormControl(false, Validators.required),
        isLiveQuestion: new FormControl(true),
      }, { validators: totalMarksValidator() })
    }
  
    removeQuiz(index: number) {
      this.quiz.removeAt(index)
    }

    removeEditQuiz(index: number) {
      this.editquiz.removeAt(index)
    }
  
    addQuiz() {
      const index = this.quiz.length - 1
      var arrayControl = this.addQuizFormGroup.get('quiz') as FormArray;
      var item = arrayControl.at(index);
      if(item.value.question == '' || item.value.total_marks == '' || item.value.yes == ''|| item.value.no == '' ) {
        this.toast.warning('All Fields are required.')
      } else if(Number(item.value.total_marks) == item.value.yes + item.value.no) {
        this.quiz.push(this.newQuiz);
      } else {
        this.toast.warning('Total marks should be equal to Yes and No')
      }
    }

    addEditQuiz() {
      const index = this.quiz.length - 1
      var arrayControl = this.editQuizFormGroup.get('quiz') as FormArray;
      var item = arrayControl.at(index);
      if(item.value.question == '' || item.value.total_marks == '' || item.value.yes == ''|| item.value.no == '' ) {
        this.toast.warning('All Fields are required.')
      } else if(Number(item.value.total_marks) == item.value.yes + item.value.no) {
        this.editquiz.push(this.newQuiz);
      } else {
        this.toast.warning('Total marks should be equal to Yes and No')
      }
    }

    matchData(evt: any){
      this.addQuizFormGroup.patchValue({ category: `${evt.team_a_short} vs ${evt.team_b_short}` })
      this.selectedOption = evt
      this.getmatchQuiz(evt)
    }
  
    getUpcomingMatches() {
      this.cricketDataService.getUpcomingMatches().subscribe((data: any) => {
        this.upcomingMatches = data.data.matches
        this.upcomingMatches.forEach((el: any, index) => {
          this.upcomingMatches[index].label = `${el.team_a_short} vs ${el.team_b_short}  ${el.match_id}  (${el.match_type}) - ${el.date_wise} ${el.match_time}`
        })
      })
    }
  
  
    onSave() {
      const payload = this.addQuizFormGroup.value
      if(this.addQuizFormGroup.valid) {
        this.quizService.create_contest_quiz(payload).subscribe(_ => {
          this.toast.success('Quiz is successfully added.')
            this.addQuizFormGroup.reset();
            this.quiz.clear();
            this.quiz.push(this.newQuiz);
        })
      }
    }

    onEdit() {
      const payload = this.editQuizFormGroup.value
      this.quizService.edit_contest(payload).subscribe(_ => {
        this.toast.success('Quiz is successfully updated.')
        this.editQuizFormGroup.reset();
        this.editquiz.clear();
        this.editquiz.push(this.neweditQuiz);
        this.listedQuiz = []
        this.addQuizFormGroup.reset();
        this.quiz.clear();
        this.quiz.push(this.newQuiz);
      })
    }

    getmatchQuiz(evt: any) {
      this.quizService.get_contest_quiz(evt.match_id).subscribe((data: any) => {
        this.editquiz.clear();
        this.listedQuiz = data.data.quiz
        data.data.quiz.forEach((quizItem: any) => {
          const quizFormGroup = new FormGroup({
            question: new FormControl(quizItem.question, Validators.required),
            _id: new FormControl(quizItem._id, Validators.required),
            total_marks: new FormControl(quizItem.total_marks, Validators.required),
            yes: new FormControl(quizItem.options.Yes, Validators.required),
            no: new FormControl(quizItem.options.No, Validators.required),
            status: new FormControl(quizItem.status, Validators.required),
            isLiveQuestion: new FormControl(quizItem.isLiveQuestion)
          }, { validators: totalMarksValidator() });
    
          this.editquiz.push(quizFormGroup);
        });

      })
    }
  
  
    questionTypeChange(val: any, pk: any) {
      // if(val.value === 'boolean') {
      //   pk.value.A = 'Yes'
      //   pk.value.B = 'No'
      // } else if(val.value === 'team') {
      //   pk.value.A = '#TEAM1'
      //   pk.value.B = '#TEAM2'
      // }
    }

}
