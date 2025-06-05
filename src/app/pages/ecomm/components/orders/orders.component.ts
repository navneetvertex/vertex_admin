import { Component, OnInit } from '@angular/core';
import { EcommerceService } from 'src/app/core/services/ecommerce.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  constructor(private ecommerceService: EcommerceService) { }
  orderList: any = [];
  breadCrumbItems: Array<{}>;

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Ecommerce' }, { label: 'Product' },{ label: 'Orders', active: true }];
    this.getOrders();
  }

  getOrders() {
    this.ecommerceService.getOrders().subscribe((res: any) => {
      this.orderList = res.data.order;
    })
  }

}
