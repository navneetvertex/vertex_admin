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

// ==================== DISTRIBUTOR METHODS ====================

createDistributor(distributorData: any) {
  return this.http.post(`${environment.api_url}gifts/distributors`, distributorData);
}

getDistributors(page: number = 0, limit: number = 10, searchTerm: string = '') {
  return this.http.get(`${environment.api_url}gifts/distributors/all?page=${page}&limit=${limit}&searchText=${searchTerm}`);
}

getDistributorById(distributorId: string) {
  return this.http.get(`${environment.api_url}gifts/distributors/${distributorId}`);
}

updateDistributor(distributorData: any) {
  return this.http.put(`${environment.api_url}gifts/distributors`, distributorData);
}

deleteDistributor(distributorId: string) {
  return this.http.delete(`${environment.api_url}gifts/distributors/${distributorId}`);
}

// ==================== GIFT RECEIVE METHODS ====================

createGiftReceive(receiveData: any) {
  return this.http.post(`${environment.api_url}gifts/receive`, receiveData);
}

getGiftReceives(page: number = 1, limit: number = 10, filters: any = {}) {
  let params = `page=${page}&limit=${limit}`;
  if (filters.name) params += `&name=${filters.name}`;
  if (filters.distributor) params += `&distributor=${filters.distributor}`;
  if (filters.transaction_date) params += `&transaction_date=${filters.transaction_date}`;
  return this.http.get(`${environment.api_url}gifts/receive?${params}`);
}

getGiftReceiveById(receiveId: string) {
  return this.http.get(`${environment.api_url}gifts/receive/${receiveId}`);
}

deleteGiftReceive(receiveId: string) {
  return this.http.delete(`${environment.api_url}gifts/receive/${receiveId}`);
}

}
