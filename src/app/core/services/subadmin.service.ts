import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubadminService {
  private apiUrl = environment.api_url + 'subadmin';

  constructor(private http: HttpClient) { }

  getSubAdmins(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key]) {
          httpParams = httpParams.append(key, params[key]);
        }
      });
    }
    return this.http.get(`${this.apiUrl}`, { params: httpParams });
  }

  getSubAdmin(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createSubAdmin(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  updateSubAdmin(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  updateSubAdminPassword(id: string, password: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/password`, { password });
  }

  changeSubAdminStatus(id: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status });
  }

  deleteSubAdmin(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getSubAdminPermissions(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/permissions`);
  }

  updateSubAdminPermissions(id: string, permissions: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/permissions`, { permissions });
  }
}
