import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EcommerceService {

constructor(private http: HttpClient) { }

getProducts() {
  return this.http.get(`${environment.api_url}v1/ecommerce`)
}

createProducts(payload: any) {
  return this.http.post(`${environment.api_url}v1/ecommerce`, payload)
}

deleteProduct(id: string) {
  return this.http.delete(`${environment.api_url}v1/ecommerce/${id}`)
}

getOrders() {
  return this.http.get(`${environment.api_url}v1/ecommerce/getallorder`)
}

}
