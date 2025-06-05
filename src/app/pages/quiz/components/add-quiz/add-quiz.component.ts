import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CricketDataService } from 'src/app/core/services/cricket-data.service';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { QuizService } from 'src/app/core/services/quiz.service';

@Component({
  selector: 'app-add-quiz',
  templateUrl: './add-quiz.component.html',
  styleUrls: ['./add-quiz.component.scss']
})
export class AddQuizComponent implements OnInit {

  constructor(private cricketDataService: CricketDataService,
    private fileUploadService: FileUploadService,
    private quizService: QuizService,
    private toast: ToastrService) { }
  breadCrumbItems: Array<{}>;
  fileList: any
  uploadButtonClicked : boolean = false
  addQuizFormGroup: FormGroup;
  addBullQuizFormGroup: FormGroup
  upcomingMatches: any[] = []

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Quiz' }, { label: 'Add Quiz', active: true }];
    this.getUpcomingMatches()
    this.addQuizFormGroup = new FormGroup({
      match_id: new FormControl('', Validators.required),
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
    this.addBullQuizFormGroup = new FormGroup({
      match_id: new FormControl('', Validators.required),
      file: new FormControl('', Validators.required)
    })
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
    if(item.value.question == '' || item.value.type == '' || item.value.runAfter == '' ) {
      this.toast.warning('All Fields are required.')
    } else {
      this.quiz.push(this.newQuiz);
    }
  }

  getUpcomingMatches() {
    this.cricketDataService.getUpcomingMatches().subscribe((data: any) => {
      this.upcomingMatches = data.data.matches
      this.upcomingMatches.forEach((el: any, index) => {
        this.upcomingMatches[index].label = `${el.team_a_short} vs ${el.team_b_short}  ${el.match_id}  (${el.match_type}) - ${el.date_wise} ${el.match_time}`
      })
    })
  }

  uploadFile(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    this.addBullQuizFormGroup.patchValue({file: element.files[0]})
    this.fileList = element.files;
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
      this.quizService.create(payload).subscribe(_ => {
        this.toast.success('Quiz is successfully added. Please approve the uploaded questionaire.')
        this.addQuizFormGroup.reset()
      })
    }
  }

  onSaveBulk() {
    if(this.addBullQuizFormGroup.valid) {
      this.uploadButtonClicked = true
      this.fileUploadService.uploadQuiz(this.fileList[0], this.addBullQuizFormGroup.get('match_id')?.value).subscribe((data : any) => {
        this.uploadButtonClicked = false
        this.addBullQuizFormGroup.reset()
        // this.fileBulkExport.value = null
        this.toast.success('Quiz is successfully added. Please approve the uploaded questionaire.')
      })
    }
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

}
