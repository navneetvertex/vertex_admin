import { Injectable } from '@angular/core';
import { AuthenticationService } from './auth.service';
import { MenuItem } from 'src/app/layouts/sidebar/menu.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private authService: AuthenticationService) { }

  /**
   * Check if user has permission to access a menu item
   */
  hasPermission(menuItem: MenuItem): boolean {
    const user = this.authService.currentUserValue;

    // Admin has access to everything
    if (!user || user.user_type === 'admin') {
      return true;
    }

    // If not sub-admin, deny access
    if (user.user_type !== 'subadmin') {
      return false;
    }

    // If no permissions set, deny access
    if (!user.permissions) {
      return false;
    }

    const permissions = user.permissions;

    // Map menu items to permissions
    switch (menuItem.id) {
      case 1: // Dashboard
        return permissions.dashboard === true;

      case 2: // Members
        return permissions.members?.view || permissions.members?.kyc || permissions.members?.accountClosure;

      case 13: // Advisors
        return permissions.advisors?.view || permissions.advisors?.manage;

      // case 15: // Sub-Admin - only admins can access
      //   return user.user_type === 'admin';

      case 14: // Franchises
        return permissions.franchises?.view || permissions.franchises?.manage;

      case 18: // Deposit Management
        return permissions.deposits?.compulsory || permissions.deposits?.recurring || permissions.deposits?.fixed;

      case 3: // Pin Management
        return permissions.pinManagement?.add || permissions.pinManagement?.assigned || permissions.pinManagement?.fund;

      case 4: // Messages
        return permissions.messages === true;

      case 5: // Sahyog Card
        return permissions.sahyogCard?.cardList || permissions.sahyogCard?.requestNew ||
               permissions.sahyogCard?.assignedCards || permissions.sahyogCard?.requestAmounts ||
               permissions.sahyogCard?.payableAmount || permissions.sahyogCard?.transactions ||
               permissions.sahyogCard?.reports;

      case 6: // Gift Card Management
        return permissions.giftCard?.add || permissions.giftCard?.list ||
               permissions.giftCard?.distributor || permissions.giftCard?.receive;

      case 7: // Loan Management
        return permissions.loanManagement?.personalLoans || permissions.loanManagement?.guaranteedLoans ||
               permissions.loanManagement?.fdAgainstLoans || permissions.loanManagement?.payLoan ||
               permissions.loanManagement?.userTransactions || permissions.loanManagement?.adminTransactions ||
               permissions.loanManagement?.reports;

      case 8: // SHG or Careers
        if (menuItem.label === 'SHG') {
          return permissions.shg === true;
        } else if (menuItem.label === 'Careers') {
          return permissions.careers === true;
        }
        return false;

      case 9: // Awards
        return permissions.awards === true;

      case 10: // Settings
        return permissions.settings?.general || permissions.settings?.fees;

      case 11: // State Management
        return permissions.stateManagement?.states || permissions.stateManagement?.districts ||
               permissions.stateManagement?.areas;

      case 12: // Payment Management
        return permissions.paymentManagement === true;

      default:
        return false;
    }
  }

  /**
   * Check if user has permission to access a sub-menu item
   */
  hasSubMenuPermission(subItem: MenuItem): boolean {
    const user = this.authService.currentUserValue;

    // Admin has access to everything
    if (!user || user.user_type === 'admin') {
      return true;
    }

    // If not sub-admin, deny access
    if (user.user_type !== 'subadmin') {
      return false;
    }

    // If no permissions set, deny access
    if (!user.permissions) {
      return false;
    }

    const permissions = user.permissions;

    // Map sub-menu items to specific permissions based on parent and link
    if (subItem.link) {
      // Members sub-items
      if (subItem.link.includes('/members/kyc')) {
        return permissions.members?.kyc === true;
      }
      if (subItem.link.includes('/members/all')) {
        return permissions.members?.view === true;
      }
      if (subItem.link.includes('/members/account-closure-requests')) {
        return permissions.members?.accountClosure === true;
      }

      // Franchise sub-items
      if (subItem.link.includes('/franchises/add')) {
        return permissions.franchises?.manage === true;
      }
      if (subItem.link.includes('/franchises/list')) {
        return permissions.franchises?.view === true;
      }

      // Deposit Management sub-items
      if (subItem.link.includes('/deposits/compulsory-deposit')) {
        return permissions.deposits?.compulsory === true;
      }
      if (subItem.link.includes('/deposits/recurring-deposit')) {
        return permissions.deposits?.recurring === true;
      }
      if (subItem.link.includes('/deposits/fixed-deposit')) {
        return permissions.deposits?.fixed === true;
      }

      // Pin Management sub-items
      if (subItem.link.includes('/pin-management/add')) {
        return permissions.pinManagement?.add === true;
      }
      if (subItem.link.includes('/pin-management/list')) {
        return permissions.pinManagement?.assigned === true;
      }
      if (subItem.link.includes('/pin-management/fund-pins')) {
        return permissions.pinManagement?.fund === true;
      }

      // Sahyog Card sub-items
      if (subItem.link.includes('/credit-management/list')) {
        return permissions.sahyogCard?.cardList === true;
      }
      if (subItem.link.includes('/credit-management/request')) {
        return permissions.sahyogCard?.requestNew === true;
      }
      if (subItem.link.includes('/credit-management/assigned-card-list')) {
        return permissions.sahyogCard?.assignedCards === true;
      }
      if (subItem.link.includes('/credit-management/request-amount')) {
        return permissions.sahyogCard?.requestAmounts === true;
      }
      if (subItem.link.includes('/credit-management/payable-amount')) {
        return permissions.sahyogCard?.payableAmount === true;
      }
      if (subItem.link.includes('/credit-management/all-transanction')) {
        return permissions.sahyogCard?.transactions === true;
      }
      if (subItem.link.includes('/credit-management/reports')) {
        return permissions.sahyogCard?.reports === true;
      }

      // Gift Card sub-items
      if (subItem.link.includes('/gift-card-management/add')) {
        return permissions.giftCard?.add === true;
      }
      if (subItem.link.includes('/gift-card-management/list')) {
        return permissions.giftCard?.list === true;
      }
      if (subItem.link.includes('/gift-card-management/distributor')) {
        return permissions.giftCard?.distributor === true;
      }
      if (subItem.link.includes('/gift-card-management/receive')) {
        return permissions.giftCard?.receive === true;
      }

      // Loan Management sub-items
      if (subItem.link.includes('/loan-management/loans/Personal')) {
        return permissions.loanManagement?.personalLoans === true;
      }
      if (subItem.link.includes('/loan-management/loans/Garanteed')) {
        return permissions.loanManagement?.guaranteedLoans === true;
      }
      if (subItem.link.includes('/loan-management/loans/fd-against-loans')) {
        return permissions.loanManagement?.fdAgainstLoans === true;
      }
      if (subItem.link.includes('/loan-management/pay-loan')) {
        return permissions.loanManagement?.payLoan === true;
      }
      if (subItem.link.includes('/loan-management/user-transanction')) {
        return permissions.loanManagement?.userTransactions === true;
      }
      if (subItem.link.includes('/loan-management/admin-transanction')) {
        return permissions.loanManagement?.adminTransactions === true;
      }
      if (subItem.link.includes('/loan-management/reports')) {
        return permissions.loanManagement?.reports === true;
      }

      // Settings sub-items
      if (subItem.link.includes('/vertex-settings/general')) {
        return permissions.settings?.general === true;
      }
      if (subItem.link.includes('/vertex-settings/fees')) {
        return permissions.settings?.fees === true;
      }

      // State Management sub-items
      if (subItem.link.includes('/master-data/states')) {
        return permissions.stateManagement?.states === true;
      }
      if (subItem.link.includes('/master-data/districts')) {
        return permissions.stateManagement?.districts === true;
      }
      if (subItem.link.includes('/master-data/areas')) {
        return permissions.stateManagement?.areas === true;
      }

      // Sub-Admin menu items - only admins can access
      // if (subItem.link.includes('/subadmin/')) {
      //   return user.user_type === 'admin';
      // }
    }

    return false;
  }

  /**
   * Filter menu items based on permissions
   */
  filterMenuItems(menuItems: MenuItem[]): MenuItem[] {
    const user = this.authService.currentUserValue;

    // Admin sees all menus
    if (!user || user.user_type === 'admin') {
      return menuItems;
    }

    // Filter menu items for sub-admin
    return menuItems.filter(menuItem => {
      const hasAccess = this.hasPermission(menuItem);

      if (!hasAccess) {
        return false;
      }

      // Filter sub-items if they exist
      if (menuItem.subItems && menuItem.subItems.length > 0) {
        menuItem.subItems = menuItem.subItems.filter(subItem =>
          this.hasSubMenuPermission(subItem)
        );

        // If no sub-items remain after filtering, hide the parent menu
        return menuItem.subItems.length > 0;
      }

      return true;
    });
  }
}
