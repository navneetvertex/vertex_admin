import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

constructor(private http: HttpClient) { }

create(payload: any) {
  return this.http.post(`${environment.api_url}v1/admin/series`, payload)
}

get() {
  return this.http.get(`${environment.api_url}v1/admin/series`);
}

edit(id: string, payload: any) {
  return this.http.put(`${environment.api_url}v1/admin/series/${id}`, payload);
}

delete(id: string) {
  return this.http.delete(`${environment.api_url}v1/admin/series/${id}`);
}

}
