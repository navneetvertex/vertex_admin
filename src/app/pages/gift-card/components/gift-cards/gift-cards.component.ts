import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GiftService } from 'src/app/core/services/gift.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gift-cards',
  templateUrl: './gift-cards.component.html',
  styleUrls: ['./gift-cards.component.scss']
})
export class GiftCardsComponent implements OnInit {

  constructor(private toast: ToastrService,
    private modalService: NgbModal,
    private router : Router,
    private giftService: GiftService
  ) { }
  breadCrumbItems: Array<{}>;
  giftList: any[] = []
  total: number = 0;
  page: number = 1;
  pageSize: number = 10;

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Gift Card Management' }, { label: 'Gift Cards', active: true }];
    this.getAllGifts();
  }

  getAllGifts() {
    this.giftService.getGift(this.page, this.pageSize).subscribe({
      next: (response: any) => {
        this.giftList = response.data.gifts;
        this.total = response.data.total;
      },
      error: (error) => {
        this.toast.error('Failed to load gift cards', 'Error');
      }
    });
  }

  pageChange(event: any) {
    this.page = event;
    this.getAllGifts();
  }

  findPageShowing(): number {
    return Math.min(this.page * this.pageSize, this.total)
  }

  deleteGiftCard(giftCardId: string): void {
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
        this.giftService.deleteGift(giftCardId).subscribe({
          next: (response: any) => {
            this.toast.success('Gift Card deleted successfully', 'Success');
            this.getAllGifts();
          },
          error: (error) => {
            this.toast.error('Failed to delete gift card', 'Error');
          }
        });
      }
    });
  }

  editGiftCard(giftCardId: string): void {
    this.router.navigate(['/gift-card-management/edit'], { queryParams: { id: giftCardId } });
  }

}
