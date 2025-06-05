import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AwardsService {

constructor(private http: HttpClient) { }

getAwards(page: number = 0, limit: number = 10, searchText: string = '') {
  return this.http.get(`${environment.api_url}awards?page=${page}&limit=${limit}&searchText=${searchText}`);
}

createAward(awardData: any) {
  return this.http.post(`${environment.api_url}awards`, awardData);
}

updateAward(id: string, awardData: any) {
  return this.http.patch(`${environment.api_url}awards/${id}`, awardData);
}

deleteAward(id: string) {
  return this.http.delete(`${environment.api_url}awards/${id}`);
}

}
