import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FranchiseService } from 'src/app/core/services/franchise.service';

@Component({
  selector: 'app-list-members',
  templateUrl: './list-members.component.html',
  styleUrls: ['./list-members.component.scss']
})
export class ListMembersComponent implements OnInit {

  constructor(private franchiseService: FranchiseService,
    private route: ActivatedRoute
  ) {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
   }
  page: number = 1;
  pageSize: number = 10;
  total: number = 0;
  searchFormGroup: FormGroup ;
  queryParams: string = '';
  userId: string = '';
  userList: any[] = [];
  breadCrumbItems: Array<{}>;
  statusList: any[] = ['Pending', 'Active', 'Inactive', 'Blocked'];

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Franchise' }, { label: 'List Members', active: true }];
    

    this.searchFormGroup = new FormGroup({
      name: new FormControl(''),
      user_id: new FormControl(''),
      account_number: new FormControl(''),
      status: new FormControl(''),
    });

    this.getFranchiseMembers(this.userId);
  }

  reset() {
    this.page = 1
    this.searchFormGroup.reset()
    this.getFranchiseMembers()
  }

  getAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  findPageShowing(): number {
    return Math.min(this.page * this.pageSize, this.total)
  }

  pageChange(event: any) {
    this.page = event;
    this.getFranchiseMembers(this.userId);
  }

  getFranchiseMembers(id: string = this.userId) {

    const searchParams = this.searchFormGroup.value;
    const queryParamArray = [];

    Object.keys(searchParams).forEach(key => {
      if (searchParams[key] !== null && searchParams[key] !== '') {
      queryParamArray.push(`${key}=${encodeURIComponent(searchParams[key])}`);
      }
    });

    const queryParams = queryParamArray.join('&');
    
    this.franchiseService.getFranchiseMembers(id, this.page, this.pageSize, queryParams).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          console.log(response.data.users);
          this.userList = response.data?.users?.data || [];
          this.total = response.data.users?.metadata[0]?.total || 0;
          console.log(this.userList);
        }
      },
      error: (error) => {
        console.error('Error fetching franchise members:', error);
      }
    });
  }

  sea

}
