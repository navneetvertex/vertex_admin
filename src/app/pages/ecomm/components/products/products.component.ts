import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EcommerceService } from 'src/app/core/services/ecommerce.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  constructor(private ecommerceService: EcommerceService,
    private toast: ToastrService
  ) { }
  products: any[] = [];
  breadCrumbItems: Array<{}>;

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Ecommerce' },{ label: 'Product', active: true }];
    this.getProducts()
  }

  getProducts() {
    this.ecommerceService.getProducts().subscribe((res: any) => {
      this.products = res.data.ecommerce
      console.log(this.products)
    })
  }

  deleteProduct(id: string) {
    Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        }).then((result) => {
          if (result.isConfirmed) {
            //question, answer, match_id, total
            this.ecommerceService.deleteProduct(id).subscribe((res: any) => {
              this.toast.success('Product deleted successfully')
              this.getProducts()
            })
          }
        });
    
  }



  searchFilter(event: any) {}

}
