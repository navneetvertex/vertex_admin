import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DropzoneComponent, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { ToastrService } from 'ngx-toastr';
import { EcommerceService } from 'src/app/core/services/ecommerce.service';
import { FileUploadService } from 'src/app/core/services/file-upload.service';

@Component({
  selector: 'app-create-products',
  templateUrl: './create-products.component.html',
  styleUrls: ['./create-products.component.scss']
})
export class CreateProductsComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  productForm: FormGroup
  @ViewChild('productDropzone', { static: false }) productDropzone: DropzoneComponent;
  image = '';
  file = '';
  config: DropzoneConfigInterface = {
      maxFilesize: 10,
      acceptedFiles: 'image/*',
      method: 'POST',
      uploadMultiple: false,
      accept: (file) => {
        this.onAccept(file);
      }
    };

  constructor(private ecommerceService: EcommerceService,
    private toast: ToastrService,
    private fileUploadService: FileUploadService
  ) { }
  categoryList = [
    { id: 'Electronics', name: 'Electronics' },
    { id: 'Clothing', name: 'Clothing' },
    { id: 'Books', name: 'Books' },
    { id: 'Home Appliances', name: 'Home Appliances' },
    { id: 'Travel', name: 'Travel' },
    { id: 'Coupouns', name: 'Coupouns' },
    { id: 'Others', name: 'Others' }
];

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Ecommerce' }, { label: 'Product' },{ label: 'Create Product', active: true }];
    this.productForm = new FormGroup({
      name: new FormControl('', Validators.required),
      image: new FormControl('https://cdn.pixabay.com/photo/2024/04/29/04/21/tshirt-8726716_1280.jpg', Validators.required),
      quantity: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    })
  }

  createProduct() {
    if(this.productForm.valid) {
      this.ecommerceService.createProducts(this.productForm.value).subscribe((res: any) => {
        this.toast.success('Product created successfully')
        this.productForm.reset();
        this.resetDropzone();
      }, (error) => {
        this.toast.error('Something went wrong')
      })
    } else {
      this.toast.warning('Please fill all the fields')
    }
   }

  onAccept(file: any) {
    this.image = file.name;
    this.file = file;
    this.fileUploadService.uploadFile(file).subscribe((data: any) => {
      this.productForm.patchValue({ image: data.file })
    })
  }

  resetDropzone() {
    if (this.productDropzone && this.productDropzone.directiveRef) {
      this.productDropzone.directiveRef.dropzone().removeAllFiles(true);
    }
  }

}
