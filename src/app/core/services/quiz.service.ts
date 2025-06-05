import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

constructor(private http: HttpClient) { }

create(payload: any) {
  return this.http.post(`${environment.api_url}v1/quiz/create`, payload)
}

create_contest_quiz(payload: any) {
  return this.http.post(`${environment.api_url}v1/quiz/create_contest`, payload)
}

edit_contest(payload: any) {
  return this.http.put(`${environment.api_url}v1/quiz/edit_contest`, payload)
}

get_contest_quiz(match_id: any) {
  return this.http.get(`${environment.api_url}v1/quiz/contest/${match_id}`)
}

get_contest_question_to_answer() {
  return this.http.get(`${environment.api_url}v1/quiz/contest/admin/getAllAnswer`)
}
get_user_transanctions() {
  return this.http.get(`${environment.api_url}v1/quiz/contest/admin/userAnswers`)
}

answerQuestion(payload: any) {  
  return this.http.post(`${environment.api_url}v1/quiz/contest/admin/answerQuestion`, payload)
}

get(match_id: string) {
  return this.http.get(`${environment.api_url}v1/quiz/manual_quiz/${match_id}`)
}

getQuizToDeclareResult(match_id: string) {
  return this.http.get(`${environment.api_url}v1/quiz/getQuizToDeclareResult/${match_id}`)
}



updateQuiz(payload: any ) {
  return this.http.put(`${environment.api_url}v1/quiz/updateQuiz`, payload)
}

deleteQuiz(payload: any , match_id: string) {
  return this.http.put(`${environment.api_url}v1/quiz/deleteQuiz/${match_id}`, payload)
}

make_active_quiz(payload: any) {
  return this.http.put(`${environment.api_url}v1/quiz/make_active_quiz`, payload)
}

declareQuizResult(payload: any) {
  return this.http.post(`${environment.api_url}v1/quiz/declareQuizResult`, payload)
}

finalizeQuiz(payload: any) {
  return this.http.post(`${environment.api_url}v1/quiz/finalizeQuiz`, payload)
}

common_quiz_create(payload: any) {
  return this.http.post(`${environment.api_url}v1/quiz/common_quiz`, payload)
}



common_quiz() {
  return this.http.get(`${environment.api_url}v1/quiz/common_quiz`)
}

common_quiz_edit(id: string, payload: any) {
  return this.http.put(`${environment.api_url}v1/quiz/common_quiz/${id}`, payload)
}

common_quiz_delete(id: string) {
  return this.http.delete(`${environment.api_url}v1/quiz/common_quiz/${id}`)
}

}
