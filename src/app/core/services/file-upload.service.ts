import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

constructor(private http: HttpClient) { }

uploadFile(file: File) {
  let formData = new FormData();
  formData.append('file', file);
  return this.http.post(`${environment.api_url}v1/upload`, formData)
}

uploadQuiz(file: File, match_id: string) {
  let formData = new FormData();
  formData.append('file', file);
  formData.append('match_id', match_id);
  return this.http.post(`${environment.api_url}v1/upload/quiz`, formData)
}

}
