import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FranchiseService {

constructor(private http: HttpClient) { }

addFranchise(data: any) {
  return this.http.post(`${environment.api_url}franchise`, data);
}

getFranchises(page: number = 1, pageSize: number = 10, queryParams: string = '') {
  return this.http.get(`${environment.api_url}franchise?page=${page}&pageSize=${pageSize}&${queryParams}`);
}

getFranchiseByUserId(id: string) {
  return this.http.get(`${environment.api_url}franchise/${id}`);
}

getAllAreasWithFranchise() {
  return this.http.get(`${environment.api_url}franchise/getAllAreasWithFranchise`);
}

changeFranchiseStatus(id: string, statusData: any) {
  return this.http.patch(`${environment.api_url}franchise/changeFranchiseStatus/${id}`, statusData);
}

getFranchiseMembers(id: string, page: number = 1, pageSize: number = 10, queryParams: string = '') {
  return this.http.get(`${environment.api_url}franchise/getFranchiseMembers/${id}?page=${page}&pageSize=${pageSize}&${queryParams}`);
}

getAdvisorStatus(user_id: string) {
  return this.http.get(`${environment.api_url}franchise/getAdvisorStatus/${user_id}`);
}



}
