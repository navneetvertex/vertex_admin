import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MastersService {

constructor(private http: HttpClient) { }

getStates(page: number = 0, limit: number = 10) {
  return this.http.get<any>(`${environment.api_url}masters/states?page=${page}&limit=${limit}`);
}

createState(stateData: any) {
  return this.http.post<any>(`${environment.api_url}masters/states`, stateData);
}

updateState(id: string, stateData: any) {
  return this.http.put<any>(`${environment.api_url}masters/states/${id}`, stateData);
}

getDistricts(page: number = 0, limit: number = 10) {
  return this.http.get<any>(`${environment.api_url}masters/districts?page=${page}&limit=${limit}`);
}

createDistrict(districtData: any) {
  return this.http.post<any>(`${environment.api_url}masters/districts`, districtData);
}

updateDistrict(id: string, districtData: any) {
  return this.http.put<any>(`${environment.api_url}masters/districts/${id}`, districtData);
}

getAreas(page: number = 0, limit: number = 10) {
  return this.http.get<any>(`${environment.api_url}masters/areas?page=${page}&limit=${limit}`);
}

createArea(areaData: any) {
  return this.http.post<any>(`${environment.api_url}masters/areas`, areaData);
}

updateArea(id: string, areaData: any) {
  return this.http.put<any>(`${environment.api_url}masters/areas/${id}`, areaData);
}

getAllStates() {
  return this.http.get<any>(`${environment.api_url}masters/all-states`);
}

getAllDistricts(districtId: string) {
  return this.http.get<any>(`${environment.api_url}masters/all-districts/${districtId}`);
}

}
