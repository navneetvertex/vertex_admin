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

approveUserFundRequest(id: string, amount: number) {
  return this.http.post(`${environment.api_url}credit-cards/approveUserFundRequest/${id}`, { amount });
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

getPenaltyRemovalRequests(page: number = 0, limit: number = 10, searchText: string = '') {
  return this.http.get(`${environment.api_url}credit-cards/penalty-removal-requests?page=${page}&limit=${limit}&search=${searchText}`);
}

approvePenaltyRemovalRequest(requestId: string, penaltyRemoved: number) {
  return this.http.post(`${environment.api_url}credit-cards/penalty-removal-request/${requestId}/approve`, { penalty_removed: penaltyRemoved });
}

rejectPenaltyRemovalRequest(requestId: string, adminResponse: string) {
  return this.http.post(`${environment.api_url}credit-cards/penalty-removal-request/${requestId}/reject`, { admin_response: adminResponse });
}

getCreditLimitHistory(cardId?: string, page: number = 1, limit: number = 10, searchText: string = '') {
  const url = cardId 
    ? `${environment.api_url}credit-cards/creditLimitHistory/${cardId}?page=${page}&limit=${limit}&search=${searchText}`
    : `${environment.api_url}credit-cards/creditLimitHistory?page=${page}&limit=${limit}&search=${searchText}`;
  return this.http.get(url);
}

// Comprehensive Reports
getAllUsersCreditCardReport(filters: any = {}) {
  const queryParams = new URLSearchParams();
  
  Object.keys(filters).forEach(key => {
    if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
      queryParams.append(key, filters[key]);
    }
  });

  return this.http.get(`${environment.api_url}credit-cards/all-users-report?${queryParams.toString()}`);
}

getUserComprehensiveReport(userId: string, cardId?: string) {
  const url = cardId 
    ? `${environment.api_url}credit-cards/comprehensive-report/${userId}/${cardId}`
    : `${environment.api_url}credit-cards/comprehensive-report/${userId}`;
  return this.http.get(url);
}

}
