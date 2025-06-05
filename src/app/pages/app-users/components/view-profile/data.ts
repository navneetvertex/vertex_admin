import { ChartType } from './profile.model';

const revenueBarChart: ChartType = {
    chart: {
        height: 300,
        type: 'bar',
        toolbar: {
            show: false,
        }
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '14%',
            endingShape: 'rounded'
        },
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
    },
    series: [{
        name: 'Revenue',
        data: [0, 0, 0, 0, 0, 0, 38, 58, 92, 0, 0, 0]
    }],
    xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    yaxis: {
        title: {
            text: '$ (thousands)'
        }
    },
    fill: {
        opacity: 1

    },
    colors: ['#556ee6'],
};

const statData = [
    {
        icon: 'bx bx-check-circle',
        title: 'Complusory Deposit',
        value: '125'
    }, {
        icon: 'bx bx-hourglass',
        title: 'Recurring Deposit',
        value: '12'
    }, {
        icon: 'bx bx-package',
        title: 'Fixed Deposit',
        value: '$36,524'
    }
];

export { revenueBarChart, statData };
