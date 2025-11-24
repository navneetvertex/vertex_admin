import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GiftService } from 'src/app/core/services/gift.service';

@Component({
  selector: 'app-receive-gift-cards',
  templateUrl: './receive-gift-cards.component.html',
  styleUrls: ['./receive-gift-cards.component.scss']
})
export class ReceiveGiftCardsComponent implements OnInit {

  constructor(
    private giftService: GiftService,
    private toast: ToastrService
  ) { }

  breadCrumbItems: Array<{}>;
  giftList: any[] = [];
  total: number = 0;
  page: number = 1;
  pageSize: number = 10;
  searchFormGroup: FormGroup;
  isLoading: boolean = false;

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Gift Card Management' }, { label: 'Receive', active: true }];

    this.searchFormGroup = new FormGroup({
      name: new FormControl(''),
      distributor: new FormControl(''),
      transaction_date: new FormControl('')
    });

    this.getAllGifts();
  }

  pageChange(event: any) {
    this.page = event;
    this.getAllGifts();
  }

  refresh() {
    this.page = 1;
    this.searchFormGroup.reset();
    this.getAllGifts();
  }

  getAllGifts() {
    this.isLoading = true;
    const filters = {
      name: this.searchFormGroup.get('name')?.value || '',
      distributor: this.searchFormGroup.get('distributor')?.value || '',
      transaction_date: this.searchFormGroup.get('transaction_date')?.value || ''
    };

    this.giftService.getGiftReceives(this.page, this.pageSize, filters).subscribe(
      (res: any) => {
        if (res && res.status === 'success') {
          this.giftList = res.data.giftReceives || [];
          this.total = res.data.total || 0;
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading gift receives:', error);
        this.toast.error('Failed to load gift receives', 'Error');
        this.isLoading = false;
      }
    );
  }

  findPageShowing(): number {
    return Math.min(this.page * this.pageSize, this.total);
  }

}
