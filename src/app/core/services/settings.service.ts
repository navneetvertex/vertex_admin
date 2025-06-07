import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

constructor(private http: HttpClient) { }

memberFees(payload: any) {
  return this.http.post(`${environment.api_url}settings/member-fees`, payload);
}

getMemberFees() {
  return this.http.get(`${environment.api_url}settings/member-fees`);
}

}
