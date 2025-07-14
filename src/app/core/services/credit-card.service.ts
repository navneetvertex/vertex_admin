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

approveUserFundRequest(id: string) {
  return this.http.get(`${environment.api_url}credit-cards/approveUserFundRequest/${id}`);
}

rejectUserFundRequest(id: string) {
  return this.http.get(`${environment.api_url}credit-cards/rejectUserFundRequest/${id}`);
}

getAdminCreditCardTransactions(page: number = 0, limit: number = 10, searchText: string = '') {
  return this.http.get(`${environment.api_url}credit-cards/getAdminCreditCardTransactions?page=${page}&limit=${limit}&search=${searchText}`);
}

getUserCreditCardTransactions(id: string, page: number = 0, limit: number = 10, searchText: string = '') {
  return this.http.get(`${environment.api_url}credit-cards/getUserCreditCardTransactions/${id}?page=${page}&limit=${limit}&search=${searchText}`);
}

getActiveCreditCardsOfUser(userId: string) {
  return this.http.get(`${environment.api_url}credit-cards/getActiveCreditCardsOfUser/${userId}`);
}

getAllFundRequestsOfCreditCard(cardId: string) {
  return this.http.get(`${environment.api_url}credit-cards/getAllFundRequestsOfCreditCard/${cardId}`);
}

getTotalPaybleAmount(id: string) {
  return this.http.get(`${environment.api_url}credit-cards/totalPaybleAmount/${id}`);
}

payCreditCardFees(payload: any) {
  return this.http.post(`${environment.api_url}credit-cards/payCreditCardFees`, payload);
}

generateCreditCardNumber(no_of_cardlist: number) {
  return this.http.get(`${environment.api_url}credit-cards/generateCreditCardNumber/${no_of_cardlist}`);
}

getCreditCardNumberList(page: number = 0, limit: number = 10, searchText: string = '') {
  return this.http.get(`${environment.api_url}credit-cards/getCreditCardNumberList?page=${page}&limit=${limit}`);
}

getLatest5CreditCardNumbers() {
  return this.http.get(`${environment.api_url}credit-cards/getLatest5CreditCardNumbers`);
}

increaseCreditCardLimit(id: string, payload: any) {
  return this.http.post(`${environment.api_url}credit-cards/increaseCreditCardLimit/${id}`, payload);
}

}
