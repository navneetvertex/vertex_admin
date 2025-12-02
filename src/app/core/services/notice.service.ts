import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NoticeService {

  constructor(private http: HttpClient) { }

  getAllNotices() {
    return this.http.get<any>(`${environment.api_url}notices`);
  }

  getActiveNotices() {
    return this.http.get<any>(`${environment.api_url}notices/active`);
  }

  createNotice(data: { title: string, status?: boolean }) {
    return this.http.post<any>(`${environment.api_url}notices`, data);
  }

  updateNotice(id: string, data: { title: string, status?: boolean }) {
    return this.http.put<any>(`${environment.api_url}notices/${id}`, data);
  }

  deleteNotice(id: string) {
    return this.http.delete<any>(`${environment.api_url}notices/${id}`);
  }

  toggleNoticeStatus(id: string) {
    return this.http.patch<any>(`${environment.api_url}notices/${id}/toggle`, {});
  }
}
