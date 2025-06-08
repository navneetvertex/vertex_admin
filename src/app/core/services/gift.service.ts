import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GiftService {

constructor(private http: HttpClient) { }

getGift(page: number = 0, limit: number = 10, searchTerm: string = '') {
  return this.http.get(`${environment.api_url}gifts?page=${page}&limit=${limit}&search=${searchTerm}`);
}

createGift(giftData: any) {
  return this.http.post(`${environment.api_url}gifts`, giftData);
}

editGift(giftData: any) {
  return this.http.put(`${environment.api_url}gifts`, giftData);
}

getGiftById(giftId: string) {
  return this.http.get(`${environment.api_url}gifts/${giftId}`);
}

deleteGift(giftId: string) {
  return this.http.delete(`${environment.api_url}gifts/${giftId}`);
}

}
