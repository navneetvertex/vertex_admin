import { MenuItem } from './menu.model';


export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'Dashboard',
        icon: 'bx-home-circle',
        link: '/dashboard'
    },
    {
        id: 2,
        label: 'Members',
        icon: 'bx-user',
        subItems: [
            {
                id: 3,
                parentId: 2,
                label: 'KYC Requests',
                link: '/members/kyc'
            },
            {
                id: 2,
                parentId: 2,
                label: 'Member List',
                link: '/members/all'
            },
        ]
    },
    {
        id: 13,
        label: 'Advisors',
        icon: 'bx-user-check',
        link: '/agents'
    },
    {
        id: 14,
        label: 'Franchises',
        icon: 'bx-building-house',
        subItems: [
            {
                id: 27,
                parentId: 14,
                label: 'Add Franchise',
                link: '/franchises/add'
            },
            {
                id: 26,
                parentId: 14,
                label: 'Franchise List',
                link: '/franchises/list'
            },
        ]
    },
    // {
    //     id: 18,
    //     label: 'Deposit Management',
    //     icon: 'bx-wallet',
    //     subItems: [
    //         {
    //             id: 24,
    //             parentId: 18,
    //             label: 'Deposit Settings',
    //             link: '/deposit-management/settings'
    //         },
    //         {
    //             id: 25,
    //             parentId: 18,
    //             label: 'Deposits',
    //             link: '/deposit-management/deposits'
    //         }
    //     ]
    // },
    {
        id: 3,
        label: 'Pin Management',
        icon: 'bx-purchase-tag',
        subItems: [
            {
                id: 4,
                parentId: 3,
                label: 'Add Pins',
                link: '/pin-management/add'
            },
            {
                id: 5,
                parentId: 3,
                label: 'Assigned Pins',
                link: '/pin-management/list'
            }
        ]
    },
    {
        id: 4,
        label: 'Messages',
        icon: 'bx-chat',
        link: '/messages'
    },
    {
        id: 5,
        label: 'Sahyog Card',
        icon: 'bx-credit-card',
        subItems: [
            {
                id: 6,
                parentId: 5,
                label: 'Request for new Card',
                link: '/credit-management/request'
            },
            {
                id: 7,
                parentId: 5,
                label: 'Assigned Cards',
                link: '/credit-management/assigned-card-list'
            },
            {
                id: 8,
                parentId: 5,
                label: 'Request Amounts',
                link: '/credit-management/request-amount'
            },
            {
                id: 9,
                parentId: 5,
                label: 'Payable Amount',
                link: '/credit-management/payable-amount'
            },
            {
                id: 10,
                parentId: 5,
                label: 'Transactions',
                link: '/credit-management/all-transanction'
            }
        ]
    },
    {
        id: 6,
        label: 'Gift Card Management',
        icon: 'bx-gift',
        subItems: [
            {
                id: 11,
                parentId: 6,
                label: 'Add Gift Card',
                link: '/gift-card-management/add'
            },
            {
                id: 12,
                parentId: 6,
                label: 'Gift Cards',
                link: '/gift-card-management/list'
            },
            {
                id: 13,
                parentId: 6,
                label: 'Distributor',
                link: '/gift-card-management/distributor'
            },
            {
                id: 14,
                parentId: 6,
                label: 'Receive Gift Card',
                link: '/gift-card-management/receive'
            }
        ]
    },
    {
        id: 7,
        label: 'Loan Management',
        icon: 'bx-money',
        subItems: [
            {
                id: 15,
                parentId: 7,
                label: 'Loans',
                link: '/loan-management/loans'
            },
            {
                id:18,
                parentId: 7,
                label: 'Pay Loan',
                link: '/loan-management/pay-loan'
            },
            {
                id: 16,
                parentId: 7,
                label: 'User Transactions',
                link: '/loan-management/user-transanction'
            },
            {
                id: 17,
                parentId: 7,
                label: 'Admin Transactions',
                link: '/loan-management/admin-transanction'
            }
        ]
    },
    {
        id: 8,
        label: 'Careers',
        icon: 'bx-briefcase',
        link: '/careers'
    },
    {
        id: 9,
        label: 'Awards',
        icon: 'bx-trophy',
        link: '/awards'
    },
    {
        id: 10,
        label: 'Settings',
        icon: 'bx-cog',
        subItems: [
            {
                id: 22,
                parentId: 10,
                label: 'General Settings',
                link: '/vertex-settings/general'
            },
            {
                id: 23,
                parentId: 10,
                label: 'Member Fees',
                link: '/vertex-settings/fees'
            },

        ]
    },
    {
        id: 11,
        label:'State Management',
        icon: 'bx-data',
        subItems: [
            {
                id: 19,
                parentId: 11,
                label: 'States',
                link: '/master-data/states'
            },
            {
                id: 20,
                parentId: 11,
                label: 'Districts',
                link: '/master-data/districts'
            },
            {
                id: 21,
                parentId: 11,
                label: 'Areas',
                link: '/master-data/areas'
            }
        ]
    },
    {
        id: 12,
        label: 'Payment Management',
        icon: 'bx-credit-card',
        link: '/payments'
    }


]
