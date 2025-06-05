import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepositService {

constructor(private http: HttpClient) { }

compulsorySettings(payload: any) {
    return this.http.post(`${environment.api_url}deposit/c_setting`, payload);
}

createCDeposit(payload: any) {
  return this.http.post(`${environment.api_url}deposit/c_deposit`, payload);
}

editCDeposit(payload: any) {
  return this.http.put(`${environment.api_url}deposit/c_deposit`, payload);
}

editCDepositSettings(payload: any) {
  return this.http.put(`${environment.api_url}deposit/c_deposit_settings`, payload);
}

getCompulsoryDeposits(userId: string) {
  return this.http.get(`${environment.api_url}deposit/c_deposit/${userId}`);
}



createRDepositSettings(payload: any) {
  return this.http.post(`${environment.api_url}deposit/r_deposit_settings`, payload);
}

editRDepositSettings(payload: any) {
  return this.http.put(`${environment.api_url}deposit/r_deposit_settings`, payload);
}

getRDepositSettings(userId: string) {
  return this.http.get(`${environment.api_url}deposit/r_deposit_settings/${userId}`);
}

createRDeposit(payload: any) {
  return this.http.post(`${environment.api_url}deposit/r_deposit`, payload);
}

editRDeposit(payload: any) {
  return this.http.put(`${environment.api_url}deposit/r_deposit`, payload);
}

getRDeposits(setting: string) {
  return this.http.get(`${environment.api_url}deposit/r_deposit/${setting}`);
}

createFDepositSettings(payload: any) {
  return this.http.post(`${environment.api_url}deposit/fd_deposit_settings`, payload);
}

editFDepositSettings(payload: any) {
  return this.http.put(`${environment.api_url}deposit/fd_deposit_settings`, payload);
}

getFDepositSettings(userId: string) {
  return this.http.get(`${environment.api_url}deposit/fd_deposit_settings/${userId}`);
}

createFDeposit(payload: any) {
  return this.http.post(`${environment.api_url}deposit/fd_deposit`, payload);
}

editFDeposit(payload: any) {
  return this.http.put(`${environment.api_url}deposit/fd_deposit`, payload);
}

getFDeposits(setting: string) {
  return this.http.get(`${environment.api_url}deposit/fd_deposit/${setting}`);
}

}
