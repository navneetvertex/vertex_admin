import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    /**
     * Get the first available route for sub-admin based on their permissions
     */
    getFirstAvailableRoute(permissions: any): string | null {
        // Order of priority for fallback routes
        if (permissions.members?.view) return '/members/all';
        if (permissions.members?.kyc) return '/members/kyc';
        if (permissions.members?.accountClosure) return '/members/account-closure-requests';
        if (permissions.advisors?.view || permissions.advisors?.manage) return '/agents';
        if (permissions.franchises?.view) return '/franchises/list';
        if (permissions.franchises?.manage) return '/franchises/add';
        if (permissions.deposits?.compulsory) return '/deposits/compulsory-deposit';
        if (permissions.deposits?.recurring) return '/deposits/recurring-deposit';
        if (permissions.deposits?.fixed) return '/deposits/fixed-deposit';
        if (permissions.pinManagement?.add) return '/pin-management/add';
        if (permissions.pinManagement?.assigned) return '/pin-management/list';
        if (permissions.pinManagement?.fund) return '/pin-management/fund-pins';
        if (permissions.messages) return '/messages';
        if (permissions.sahyogCard?.cardList) return '/credit-management/list';
        if (permissions.sahyogCard?.requestNew) return '/credit-management/request';
        if (permissions.sahyogCard?.assignedCards) return '/credit-management/assigned-card-list';
        if (permissions.sahyogCard?.requestAmounts) return '/credit-management/request-amount';
        if (permissions.sahyogCard?.payableAmount) return '/credit-management/payable-amount';
        if (permissions.sahyogCard?.transactions) return '/credit-management/all-transanction';
        if (permissions.sahyogCard?.reports) return '/credit-management/reports';
        if (permissions.giftCard?.add) return '/gift-card-management/add';
        if (permissions.giftCard?.list) return '/gift-card-management/list';
        if (permissions.giftCard?.distributor) return '/gift-card-management/distributor';
        if (permissions.giftCard?.receive) return '/gift-card-management/receive';
        if (permissions.loanManagement?.personalLoans) return '/loan-management/loans/Personal';
        if (permissions.loanManagement?.guaranteedLoans) return '/loan-management/loans/Garanteed';
        if (permissions.loanManagement?.fdAgainstLoans) return '/loan-management/loans/fd-against-loans';
        if (permissions.loanManagement?.payLoan) return '/loan-management/pay-loan';
        if (permissions.loanManagement?.userTransactions) return '/loan-management/user-transanction';
        if (permissions.loanManagement?.adminTransactions) return '/loan-management/admin-transanction';
        if (permissions.loanManagement?.reports) return '/loan-management/reports';
        if (permissions.shg) return '/shg';
        if (permissions.careers) return '/careers';
        if (permissions.awards) return '/awards';
        if (permissions.settings?.general) return '/vertex-settings/general';
        if (permissions.settings?.fees) return '/vertex-settings/fees';
        if (permissions.stateManagement?.states) return '/master-data/states';
        if (permissions.stateManagement?.districts) return '/master-data/districts';
        if (permissions.stateManagement?.areas) return '/master-data/areas';
        if (permissions.paymentManagement) return '/payments';

        return null;
    }

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
                this.router.navigate(['/account/login']);
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
                const firstRoute = this.getFirstAvailableRoute(permissions);
                if (firstRoute) {
                    this.router.navigate([firstRoute]);
                    return false;
                }
                // No permissions at all, redirect to login
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
                const firstRoute = this.getFirstAvailableRoute(permissions);
                if (firstRoute) {
                    this.router.navigate([firstRoute]);
                } else {
                    this.router.navigate(['/account/login']);
                }
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
