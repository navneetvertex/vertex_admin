import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PinsService {

constructor(private http: HttpClient) { }

getPins(request: string, page: number = 0, limit: number = 10, searchTerm: string = '') {
  return this.http.get(`${environment.api_url}pins?request=${request}&page=${page}&limit=${limit}&search=${searchTerm}`);
}

createPin(payload: any) {
  return this.http.post(`${environment.api_url}pins`, payload);
}
assignPins(payload: any) {
  return this.http.put(`${environment.api_url}pins/assignPins`, payload);
}

inactivePin(pin: string, payload: any) {
  return this.http.put(`${environment.api_url}pins/inactivePin/${pin}`, payload);
}

// ===== FUND PIN METHODS =====
createFundPin(payload: any) {
  return this.http.post(`${environment.api_url}pins/fund`, payload);
}

getFundPins(page: number = 1, limit: number = 10, searchTerm: string = '', status?: string, currency?: string) {
  let params = `page=${page}&limit=${limit}&search=${searchTerm}`;
  if (status) params += `&status=${status}`;
  if (currency) params += `&currency=${currency}`;
  return this.http.get(`${environment.api_url}pins/fund?${params}`);
}

deleteFundPin(id: string) {
  return this.http.delete(`${environment.api_url}pins/fund/${id}`);
}

// ===== ASSIGN FUND PINS =====
assignFundPins(payload: any) {
  return this.http.put(`${environment.api_url}pins/assign-fund-pins`, payload);
}
}

