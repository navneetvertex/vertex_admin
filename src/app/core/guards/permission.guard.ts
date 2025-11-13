import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;

        if (!currentUser) {
            this.router.navigate(['/account/login']);
            return false;
        }

        // Admin has access to all routes
        if (currentUser.user_type === 'admin') {
            return true;
        }

        // Check if sub-admin has permissions
        if (currentUser.user_type === 'subadmin') {
            const permissions = currentUser.permissions;

            if (!permissions) {
                this.router.navigate(['/dashboard']);
                return false;
            }

            const url = state.url;

            // Map routes to permissions
            // Dashboard and root path
            if (url === '/' || url === '' || url.includes('/dashboard')) {
                if (permissions.dashboard === true) {
                    return true;
                }
                // If no dashboard permission, find first allowed route
                this.router.navigate(['/account/login']);
                return false;
            }

            // Members
            if (url.includes('/members/kyc')) {
                return permissions.members?.kyc === true;
            }
            if (url.includes('/members/all')) {
                return permissions.members?.view === true;
            }
            if (url.includes('/members/account-closure-requests')) {
                return permissions.members?.accountClosure === true;
            }

            // Advisors
            if (url.includes('/agents')) {
                return permissions.advisors?.view || permissions.advisors?.manage;
            }

            // Sub-Admin - only admin can access
            if (url.includes('/subadmin')) {
                this.router.navigate(['/dashboard']);
                return false;
            }

            // Franchises
            if (url.includes('/franchises')) {
                return permissions.franchises?.view || permissions.franchises?.manage;
            }

            // Deposits
            if (url.includes('/deposits/compulsory-deposit')) {
                return permissions.deposits?.compulsory === true;
            }
            if (url.includes('/deposits/recurring-deposit')) {
                return permissions.deposits?.recurring === true;
            }
            if (url.includes('/deposits/fixed-deposit')) {
                return permissions.deposits?.fixed === true;
            }

            // Pin Management
            if (url.includes('/pin-management/add')) {
                return permissions.pinManagement?.add === true;
            }
            if (url.includes('/pin-management/list')) {
                return permissions.pinManagement?.assigned === true;
            }
            if (url.includes('/pin-management/fund-pins')) {
                return permissions.pinManagement?.fund === true;
            }

            // Messages
            if (url.includes('/messages')) {
                return permissions.messages === true;
            }

            // Sahyog Card
            if (url.includes('/credit-management/list')) {
                return permissions.sahyogCard?.cardList === true;
            }
            if (url.includes('/credit-management/request')) {
                return permissions.sahyogCard?.requestNew === true;
            }
            if (url.includes('/credit-management/assigned-card-list')) {
                return permissions.sahyogCard?.assignedCards === true;
            }
            if (url.includes('/credit-management/request-amount')) {
                return permissions.sahyogCard?.requestAmounts === true;
            }
            if (url.includes('/credit-management/payable-amount')) {
                return permissions.sahyogCard?.payableAmount === true;
            }
            if (url.includes('/credit-management/all-transanction')) {
                return permissions.sahyogCard?.transactions === true;
            }
            if (url.includes('/credit-management/reports')) {
                return permissions.sahyogCard?.reports === true;
            }

            // Gift Card
            if (url.includes('/gift-card-management/add')) {
                return permissions.giftCard?.add === true;
            }
            if (url.includes('/gift-card-management/list')) {
                return permissions.giftCard?.list === true;
            }
            if (url.includes('/gift-card-management/distributor')) {
                return permissions.giftCard?.distributor === true;
            }
            if (url.includes('/gift-card-management/receive')) {
                return permissions.giftCard?.receive === true;
            }

            // Loan Management
            if (url.includes('/loan-management/loans/Personal')) {
                return permissions.loanManagement?.personalLoans === true;
            }
            if (url.includes('/loan-management/loans/Garanteed')) {
                return permissions.loanManagement?.guaranteedLoans === true;
            }
            if (url.includes('/loan-management/loans/fd-against-loans')) {
                return permissions.loanManagement?.fdAgainstLoans === true;
            }
            if (url.includes('/loan-management/pay-loan')) {
                return permissions.loanManagement?.payLoan === true;
            }
            if (url.includes('/loan-management/user-transanction')) {
                return permissions.loanManagement?.userTransactions === true;
            }
            if (url.includes('/loan-management/admin-transanction')) {
                return permissions.loanManagement?.adminTransactions === true;
            }
            if (url.includes('/loan-management/reports')) {
                return permissions.loanManagement?.reports === true;
            }

            // SHG
            if (url.includes('/shg')) {
                return permissions.shg === true;
            }

            // Careers
            if (url.includes('/careers')) {
                return permissions.careers === true;
            }

            // Awards
            if (url.includes('/awards')) {
                return permissions.awards === true;
            }

            // Settings
            if (url.includes('/vertex-settings/general')) {
                return permissions.settings?.general === true;
            }
            if (url.includes('/vertex-settings/fees')) {
                return permissions.settings?.fees === true;
            }

            // State Management
            if (url.includes('/master-data/states')) {
                return permissions.stateManagement?.states === true;
            }
            if (url.includes('/master-data/districts')) {
                return permissions.stateManagement?.districts === true;
            }
            if (url.includes('/master-data/areas')) {
                return permissions.stateManagement?.areas === true;
            }

            // Payment Management
            if (url.includes('/payments')) {
                return permissions.paymentManagement === true;
            }

            // If no specific permission found, deny access
            console.warn('No permission found for route:', url);
            return false;
        }

        // For any other user types, deny access
        this.router.navigate(['/account/login']);
        return false;
    }
}
