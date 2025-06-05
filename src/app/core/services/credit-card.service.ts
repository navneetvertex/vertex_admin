import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreditCardService {

constructor(private http: HttpClient) { }

getRequestedCreditCard(page: number = 0, limit: number = 10, searchText: string = '') {
  return this.http.get(`${environment.api_url}credit-cards/requested?page=${page}&limit=${limit}&search=${searchText}`);
}

getAssignedCreditCard(page: number = 0, limit: number = 10, searchText: string = '') {
  return this.http.get(`${environment.api_url}credit-cards/assigned?page=${page}&limit=${limit}&search=${searchText}`);
}

approveCreditCard(id: string, payload: any) {
  return this.http.post(`${environment.api_url}credit-cards/approve/${id}`, payload);
}

rejectCreditCard(id: string, payload: any = {}) {
  return this.http.post(`${environment.api_url}credit-cards/reject/${id}`, payload);
}

getUserFundRequests(page: number = 0, limit: number = 10, queryParams: any) {
  return this.http.get(`${environment.api_url}credit-cards/getUserFundRequests?page=${page}&limit=${limit}&${queryParams}`);
}

}
