import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PinsService {

constructor(private http: HttpClient) { }

getPins(request: string, page: number = 0, limit: number = 10) {
  return this.http.get(`${environment.api_url}pins?request=${request}&page=${page}&limit=${limit}`);
}

createPin(payload: any) {
  return this.http.post(`${environment.api_url}pins`, payload);
}
assignPins(payload: any) {
  return this.http.put(`${environment.api_url}pins/assignPins`, payload);
}

}

