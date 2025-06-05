import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

constructor(private http: HttpClient) { }

createBanner(payload: any) {
  return this.http.post(`${environment.api_url}v1/banner`, payload)
}

getBanner() {
  return this.http.get(`${environment.api_url}v1/banner`)
}

updateBanner(id: string, payload: any) {
  return this.http.put(`${environment.api_url}v1/banner/${id}`, payload)
}

deleteBanner(id: string) {
  return this.http.delete(`${environment.api_url}v1/banner/${id}`)
}

getUpdates() {
  return this.http.get(`${environment.api_url}v1/news`)
}

createUpdates(payload: any) {
  return this.http.post(`${environment.api_url}v1/news`, payload)
}

updateUpdates(payload: any) {
  return this.http.put(`${environment.api_url}v1/news`, payload)
}

deleteUpdates(id: string) {
  return this.http.delete(`${environment.api_url}v1/news/${id}`)
}

}
