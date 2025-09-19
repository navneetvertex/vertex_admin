import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DepositService } from 'src/app/core/services/deposit.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-compulsory-deposits',
  templateUrl: './compulsory-deposits.component.html',
  styleUrls: ['./compulsory-deposits.component.scss']
})
export class CompulsoryDepositsComponent implements OnInit {

  constructor(private depositService: DepositService,
      private modalService: NgbModal,
      private settingsService: SettingsService,
      private toastr: ToastrService
    ) { }
    breadCrumbItems: Array<{}>;
  
    userList: any[] = []
    total: number = 0;
    page: number = 1;
    pageSize: number = 10;
    searchFormGroup: FormGroup ;
    rd_rate: number = 0;
    editDepositSettings: FormGroup;
    statusList: any[] = ['Requested', 'Confirmed', 'Closed']
    monthYearList: any[] = [];
    
    // Checkbox selection properties
    selectAll: boolean = false;
    selectedUsers: any[] = [];
    selectedUserIds: string[] = [];
    globalSelections: Map<string, boolean> = new Map(); // Track selections across all pages
    totalSelectedCount: number = 0;
    previousFilterState: string = ''; // Track filter changes
    
    // Notification modal properties
    notificationForm: FormGroup;
    isSendingNotification: boolean = false;
  
    ngOnInit(): void {
      this.breadCrumbItems = [{ label: 'Deposit' }, { label: 'Compulsory Deposit List', active: true }];
      
      // Generate combined month-year list from current month back to 2 years ago
      this.generateMonthYearList();
      
      this.searchFormGroup = new FormGroup({
        name:new FormControl(''),
        user_id: new FormControl(''),
        status: new FormControl('All'),
        monthYear: new FormControl('')
      });
      this.editDepositSettings = new FormGroup({
          _id: new FormControl('', [Validators.required]),
          annual_rate: new FormControl('' , [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
          interval: new FormControl('', [Validators.required]),
          duration: new FormControl('', [Validators.required]),
          amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
          penality_rate: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      });
      
      // Initialize notification form
      this.notificationForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.minLength(3)]),
        body: new FormControl('', [Validators.required, Validators.minLength(10)]),
        sendSMS: new FormControl(false)
      });
      
      this.settingsService.getGeneralSettings$().subscribe(settings => {
        if (settings) {
          this.rd_rate = settings.recurring_deposit_rate || 0;
          this.editDepositSettings.patchValue({annual_rate: this.rd_rate});
        }
      });
      this.getRecrruingDeposits();
    }
  
    generateMonthYearList() {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December'];
      
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth(); // 0-based
      
      // Generate from current month back to 2 years ago
      for (let yearOffset = 0; yearOffset <= 2; yearOffset++) {
        const year = currentYear - yearOffset;
        
        // For current year, start from current month
        // For previous years, start from December
        const startMonth = (yearOffset === 0) ? currentMonth : 11;
        const endMonth = (yearOffset === 2) ? 0 : 0; // For 2 years ago, start from January
        
        for (let month = startMonth; month >= endMonth; month--) {
          const monthName = months[month];
          const monthValue = (month + 1).toString().padStart(2, '0'); // 01-12 format
          const displayText = `${monthName} ${year}`;
          const value = `${year}-${monthValue}`; // YYYY-MM format
          
          this.monthYearList.push({
            display: displayText,
            value: value
          });
        }
      }
    }
  
    getRecrruingDeposits() {
  
      const searchParams = this.searchFormGroup.value;
      const queryParamArray = [];
  
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key] !== null && searchParams[key] !== '' && searchParams[key] !== undefined) {
          if (key === 'monthYear') {
            // Split the combined value into separate month and year parameters
            const [year, month] = searchParams[key].split('-');
            queryParamArray.push(`month=${encodeURIComponent(month)}`);
            queryParamArray.push(`year=${encodeURIComponent(year)}`);
          } else {
            queryParamArray.push(`${key}=${encodeURIComponent(searchParams[key])}`);
          }
        }
      });
  
      const queryParams = queryParamArray.join('&');
      const currentFilterState = queryParams;
  
      this.depositService.getAllCompulsoryDeposits(this.page, this.pageSize,queryParams).subscribe((res: any) => {
        if (res.status) {
          this.userList = res.data.deposits;
          this.total = res.data.total;
          
          // Check if filters have changed
          if (this.previousFilterState !== currentFilterState && this.previousFilterState !== '') {
            this.clearSelection();
          }
          this.previousFilterState = currentFilterState;
          
          // Restore selections for users on this page
          this.userList.forEach(user => {
            const userIdStr = String(user._id);
            user.selected = this.globalSelections.get(userIdStr) || false;
          });
          
          console.log(this.userList);
          // Update select all state based on current page
          this.updateSelectAllState();
          this.updateSelectedUsers();
        }
      }, err => {
        console.error(err);
      });
    }
    
    reset() {
      this.searchFormGroup.reset();
      this.page = 1;
      this.previousFilterState = '';
      this.clearSelection();
      this.getRecrruingDeposits();
    }
  
    findPageShowing(): number {
      return Math.min(this.page * this.pageSize, this.total)
    }
  
    pageChange(page: number) {
      this.page = page;
      // Don't clear selections when changing pages
      this.getRecrruingDeposits();
    }
  
    openRDSettingFn(settingModal: any, user: any) {
      this.editDepositSettings.patchValue(user)
      this.modalService.open(settingModal, { size: 'lg', centered: true });
    }
  
    editSettings() {
      if (this.editDepositSettings.valid) {
        const payload = this.editDepositSettings.value;
        payload.status = 'Confirmed';
        this.depositService.editRDepositSettings(payload).subscribe((res: any) => {
          if (res && res.status === 'success') {
            this.editDepositSettings.reset();
            this.editDepositSettings.patchValue({annual_rate: this.rd_rate});
            this.modalService.dismissAll();
            this.getRecrruingDeposits();
          }
        }, error => {
          console.error('Error updating deposit settings:', error);
        });
      } else {
        this.editDepositSettings.markAllAsTouched();
      }
    }

    // Checkbox selection methods
    toggleSelectAll() {
      // If selectAll is true, select all users on current page
      // If selectAll is false, deselect all users on current page
      this.userList.forEach(user => {
        user.selected = this.selectAll;
        const userIdStr = String(user.user._id);
        this.globalSelections.set(userIdStr, this.selectAll);
      });
      
      this.updateSelectedUsers();
    }

    updateSelection() {
      // Update global selections when individual checkboxes change
      this.userList.forEach(user => {
        const userIdStr = String(user._id);
        this.globalSelections.set(userIdStr, user.selected);
      });
      
      // Update select all state for current page
      this.updateSelectAllState();
      this.updateSelectedUsers();
    }

    onUserSelectionChange(user: any, event: any) {
      user.selected = event.target.checked;
      const userIdStr = String(user.user._id);
      this.globalSelections.set(userIdStr, user.selected);
      
      // Update select all state for current page
      this.updateSelectAllState();
      this.updateSelectedUsers();
    }

    onSelectAllChange(event: any) {
      this.selectAll = event.target.checked;
      this.toggleSelectAll();
    }

    updateSelectAllState() {
      // Check if all users on current page are selected
      this.selectAll = this.userList.length > 0 && this.userList.every(user => user.selected);
    }

    updateSelectedUsers() {
      // Get all selected users from global selections
      this.selectedUsers = [];
      this.selectedUserIds = [];
      
      this.globalSelections.forEach((selected, userId) => {
        if (selected) {
          // Find the user object from current page or we need to store user objects globally
          const user = this.userList.find(u => String(u._id) === userId);
          if (user) {
            this.selectedUsers.push(user);
            this.selectedUserIds.push(userId);
          } else {
            // For users not on current page, we need to store their info
            this.selectedUserIds.push(userId);
          }
        }
      });
      
      this.totalSelectedCount = this.selectedUserIds.length;
    }

    getSelectedUsersCount(): number {
      return this.totalSelectedCount;
    }

    clearSelection() {
      this.selectAll = false;
      this.globalSelections.clear();
      this.userList.forEach(user => {
        user.selected = false;
      });
      
      this.updateSelectedUsers();
    }

    // Select all users matching current filter
    selectAllMatchingFilter() {
      const searchParams = this.searchFormGroup.value;
      const queryParamArray = [];

      Object.keys(searchParams).forEach(key => {
        if (searchParams[key] !== null && searchParams[key] !== '' && searchParams[key] !== undefined) {
          if (key === 'monthYear') {
            // Split the combined value into separate month and year parameters
            const [year, month] = searchParams[key].split('-');
            queryParamArray.push(`month=${encodeURIComponent(month)}`);
            queryParamArray.push(`year=${encodeURIComponent(year)}`);
          } else {
            queryParamArray.push(`${key}=${encodeURIComponent(searchParams[key])}`);
          }
        }
      });

      const queryParams = queryParamArray.join('&');

      this.depositService.getCompulsoryDepositUserIds(queryParams).subscribe((res: any) => {
        console.log('User IDs matching filter:', res);
        if (res.status && res.data && res.data.userIds) {
          // Clear current selections first
          this.clearSelection();
          
          // Select all users matching the filter
          res.data.userIds.forEach((userId: string) => {
            this.globalSelections.set(userId, true);
          });
          
          // Update selections for current page with proper type handling
          this.userList.forEach(user => {
            // Ensure we're comparing strings
            const userIdStr = String(user.user._id);
            const isSelected = this.globalSelections.has(userIdStr);
            user.selected = isSelected;
          });
          
          this.updateSelectAllState();
          this.updateSelectedUsers();
          
          this.toastr.success(`Selected ${res.data.userIds.length} users matching current filter`, 'Bulk Selection Complete');
        } else {
          this.toastr.error('Failed to retrieve user IDs for bulk selection', 'Error');
        }
      }, err => {
        console.error('Error selecting all matching filter:', err);
        this.toastr.error('Failed to select all users matching filter', 'Error');
      });
    }

    // Example method to demonstrate usage of selected users
    sendNotificationToSelectedUsers() {
      if (this.totalSelectedCount === 0) {
        this.toastr.warning('Please select users first', 'No Selection');
        return;
      }
      
      console.log('Selected User IDs:', this.selectedUserIds);
      console.log('Selected Users on current page:', this.selectedUsers);
      console.log('Total selected across all pages:', this.totalSelectedCount);
      
      // Here you can implement the actual notification logic
      this.toastr.info(`Sending notification to ${this.totalSelectedCount} selected users across all pages`, 'Processing...');
    }

    // Notification modal methods
    openNotificationModal(content: any) {
      if (this.totalSelectedCount === 0) {
        this.toastr.warning('Please select users first', 'No Selection');
        return;
      }
      
      // Reset form when opening modal
      this.notificationForm.reset({
        title: '',
        body: '',
        sendSMS: false
      });
      
      this.modalService.open(content, { 
        size: 'lg', 
        centered: true,
        backdrop: 'static',
        keyboard: false 
      });
    }

    sendNotification() {
      if (this.notificationForm.invalid) {
        this.notificationForm.markAllAsTouched();
        this.toastr.error('Please fill in all required fields correctly', 'Validation Error');
        return;
      }

      if (this.totalSelectedCount === 0) {
        this.toastr.warning('No users selected', 'Selection Required');
        return;
      }

      this.isSendingNotification = true;
      const notificationData = this.notificationForm.value;

      console.log('Sending notification:', {
        title: notificationData.title,
        body: notificationData.body,
        sendSMS: notificationData.sendSMS,
        selectedUserIds: this.selectedUserIds,
        totalRecipients: this.totalSelectedCount
      });

      // Call the notification API
      const payload = {
        title: notificationData.title,
        body: notificationData.body,
        sendSMS: notificationData.sendSMS,
        userIds: this.selectedUserIds
      };

      this.depositService.sendBulkNotification(payload).subscribe((res: any) => {
        this.isSendingNotification = false;
        if (res.status) {
          this.modalService.dismissAll();
          this.toastr.success(
            `Notification sent successfully to ${this.totalSelectedCount} users!`,
            'Notification Sent',
            { timeOut: 5000 }
          );

          // Clear selections after successful send (optional)
          // this.clearSelection();

          // Reset form
          this.notificationForm.reset({
            title: '',
            body: '',
            sendSMS: false
          });
        } else {
          this.toastr.error('Failed to send notification', 'Error');
        }
      }, err => {
        this.isSendingNotification = false;
        console.error('Error sending notification:', err);
        this.toastr.error('Failed to send notification', 'Error');
      });
    }

}
