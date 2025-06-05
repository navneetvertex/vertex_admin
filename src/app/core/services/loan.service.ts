import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

constructor(private http: HttpClient) { }

getLoanList(page: number = 0, limit: number = 10, queryParams: any) {
  return this.http.get<any>(`${environment.api_url}loans?${queryParams}&page=${page}&limit=${limit}`);
}

updateLoanStatus(loan_id: string, loanData: any) {
  return this.http.put<any>(`${environment.api_url}loans/${loan_id}`, loanData);
}

getUserTransaction(queryParams: any) {
  return this.http.get<any>(`${environment.api_url}loans/user-transanction?${queryParams}`);
}

getAdminTransaction() {
  return this.http.get<any>(`${environment.api_url}loans/admin-transanction`);
}

}
