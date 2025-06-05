import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CareersService {

constructor(private http: HttpClient) { }

getCareers(page: number = 0, limit: number = 10, searchText: string = '') {
  return this.http.get(`${environment.api_url}career?page=${page}&limit=${limit}&searchText=${searchText}`);
}

createCareer(careerData: any) {
  return this.http.post(`${environment.api_url}career`, careerData);
}

updateCareer(id: string, careerData: any) {
  return this.http.patch(`${environment.api_url}career/${id}`, careerData);
}

deleteCareer(id: string) {
  return this.http.delete(`${environment.api_url}career/${id}`);
}

}
