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

getAllRecurringDeposits(page: number = 0, limit: number = 10, queryParams: string = '') {
  return this.http.get(`${environment.api_url}deposit/all_recurring_deposits?page=${page}&limit=${limit}&${queryParams}`);
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

getCompulsoryDeposits(userId: string, queryParams: string = '', page: number = 0, limit: number = 10) {
  return this.http.get(`${environment.api_url}deposit/c_deposit/${userId}?page=${page}&limit=${limit}&${queryParams}`);
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

getRDeposits(setting: string,  page: number = 0, limit: number = 10, queryParams: string = '') {
  return this.http.get(`${environment.api_url}deposit/r_deposit/${setting}?page=${page}&limit=${limit}&${queryParams}`);
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

findOutstandingDepositsOfCompulsory(user_id: string) {
  return this.http.get(`${environment.api_url}deposit/findOutstandingDepositsOfCompulsory?user_id=${user_id}`);
}

findOutstandingDepositsOfRecurring(user_id: string) {
  return this.http.get(`${environment.api_url}deposit/findOutstandingDepositsOfRecurring?user_id=${user_id}`);
}

getAllFixedDeposits(page: number = 0, limit: number = 10, queryParams: string = '') {
  return this.http.get(`${environment.api_url}deposit/all_fixed_deposits?page=${page}&limit=${limit}&${queryParams}`);
}



}
