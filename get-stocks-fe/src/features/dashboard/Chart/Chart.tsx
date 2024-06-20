import Dropdown from '../../../components/Dropdown';
import ReactApexChart from 'react-apexcharts';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../store';
import { useQuery } from '@tanstack/react-query';
import { getUsersByMonthAndYear, getOrdersByMonthAndYear, getItemsByMonthAndYear } from '../../../services/dashboardService';

type Props = {};

export const Chart = (props: Props) => {
    const [loading] = useState(false);

    const { data: usersMonthly } = useQuery({
        queryKey: ['usersMonth'],
        queryFn: () => getUsersByMonthAndYear(),
    });

    const { data: ordersMonthly } = useQuery({
        queryKey: ['ordersMonth'],
        queryFn: () => getOrdersByMonthAndYear(),
    });

    const { data: itemsMonthly } = useQuery({
        queryKey: ['itemsMonth'],
        queryFn: () => getItemsByMonthAndYear(),
    });

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme) === 'dark' ? true : false;
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const revenueChart: any = {
        series: [
            {
                name: 'Người dùng',
                data: usersMonthly?.data?.result?.map((item: any) => item?.count) || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
            {
                name: 'Lượt tải',
                data: itemsMonthly?.data?.result?.map((item: any) => item?.count) || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
            {
                name: 'Lượt nạp',
                data: ordersMonthly?.data?.result?.map((item: any) => item?.count) || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
        ],
        options: {
            chart: {
                height: 325,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },

            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                curve: 'smooth',
                width: 2,
                lineCap: 'square',
            },
            dropShadow: {
                enabled: true,
                opacity: 0.2,
                blur: 10,
                left: -7,
                top: 22,
            },
            colors: isDark ? ['#2196F3', '#E7515A', '#8b5cf6'] : ['#E7515A', '#06b6d4', '#8b5cf6'],
            markers: {
                discrete: [
                    {
                        seriesIndex: 0,
                        dataPointIndex: 6,
                        fillColor: '#1B55E2',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                    {
                        seriesIndex: 1,
                        dataPointIndex: 5,
                        fillColor: '#E7515A',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                    {
                        seriesIndex: 1,
                        dataPointIndex: 5,
                        fillColor: '#8b5cf6',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                ],
            },
            labels: usersMonthly?.data?.result?.map((item: any) => item?.month) || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                crosshairs: {
                    show: true,
                },
                labels: {
                    offsetX: isRtl ? 2 : 0,
                    offsetY: 5,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-xaxis-title',
                    },
                },
            },
            yaxis: {
                tickAmount: usersMonthly?.data?.total < 8 ? usersMonthly?.data?.total : 8,
                labels: {
                    formatter: (value: number) => {
                        return value;
                    },
                    offsetX: isRtl ? -30 : -10,
                    offsetY: 0,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-yaxis-title',
                    },
                },
                opposite: isRtl ? true : false,
            },
            grid: {
                borderColor: isDark ? '#191E3A' : '#E0E6ED',
                strokeDashArray: 5,
                xaxis: {
                    lines: {
                        show: true,
                    },
                },
                yaxis: {
                    lines: {
                        show: false,
                    },
                },
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                fontSize: '16px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                itemMargin: {
                    horizontal: 10,
                    vertical: 5,
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
                x: {
                    show: false,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: !1,
                    opacityFrom: isDark ? 0.19 : 0.28,
                    opacityTo: 0.05,
                    stops: isDark ? [100, 100] : [45, 100],
                },
            },
        },
    };

    //Sales By Category
    const salesByCategory: any = {
        series: [usersMonthly?.data?.total, ordersMonthly?.data?.total, itemsMonthly?.data?.total],
        options: {
            chart: {
                type: 'donut',
                height: 460,
                fontFamily: 'Nunito, sans-serif',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 25,
                colors: isDark ? '#0e1726' : '#fff',
            },
            colors: isDark ? ['#5c1ac3', '#e2a03f', '#e7515a', '#e2a03f'] : ['#e2a03f', '#5c1ac3', '#e7515a'],
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                height: 50,
                offsetY: 20,
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
                        background: 'transparent',
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '29px',
                                offsetY: -10,
                            },
                            value: {
                                show: true,
                                fontSize: '26px',
                                color: isDark ? '#bfc9d4' : undefined,
                                offsetY: 16,
                                formatter: (val: any) => {
                                    return val;
                                },
                            },
                            total: {
                                show: true,
                                label: 'Tổng',
                                color: '#888ea8',
                                fontSize: '29px',
                                formatter: (w: any) => {
                                    return w.globals.seriesTotals.reduce(function (a: any, b: any) {
                                        return a + b;
                                    }, 0);
                                },
                            },
                        },
                    },
                },
            },
            labels: ['Người dùng', 'Lượt nạp', 'Lượt tải'],
            // states: {
            //     hover: {
            //         filter: {
            //             type: 'none',
            //             value: 0.15,
            //         },
            //     },
            //     active: {
            //         filter: {
            //             type: 'none',
            //             value: 0.15,
            //         },
            //     },
            // },
        },
    };

    return (
        <div>
            <div className="grid xl:grid-cols-3 gap-6 mb-6">
                <div className="panel h-full xl:col-span-2">
                    <div className="flex items-center justify-between dark:text-white-light mb-5">
                        <h5 className="font-semibold text-lg">Thống kê</h5>
                        {/* <div className="dropdown">
                            <Dropdown
                                offset={[0, 1]}
                                placement={`'bottom-star`}
                                button={
                                    <svg className="w-5 h-5 text-black/70 dark:text-white/70 hover:!text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                }
                            >
                                <ul>
                                    <li>
                                        <button type="button">Weekly</button>
                                    </li>
                                    <li>
                                        <button type="button">Monthly</button>
                                    </li>
                                    <li>
                                        <button type="button">Yearly</button>
                                    </li>
                                </ul>
                            </Dropdown> 
                        </div>*/}
                    </div>
                    <p className="text-lg dark:text-white-light/90">{/* Total Profit <span className="text-primary ml-2">$10,840</span> */}</p>
                    <div className="relative">
                        <div className="bg-white dark:bg-black rounded-lg">
                            {loading ? (
                                <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                    <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
                                </div>
                            ) : (
                                <>{usersMonthly && ordersMonthly && itemsMonthly ? <ReactApexChart series={revenueChart.series} options={revenueChart.options} type="area" height={325} /> : ''}</>
                            )}
                        </div>
                    </div>
                </div>

                <div className="panel h-full">
                    <div className="flex items-center mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light"></h5>
                    </div>
                    <div>
                        <div className="bg-white dark:bg-black rounded-lg">
                            {loading ? (
                                <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                    <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
                                </div>
                            ) : (
                                <>
                                    {usersMonthly && ordersMonthly && itemsMonthly ? (
                                        <ReactApexChart series={salesByCategory.series} options={salesByCategory.options} type="donut" height={460} />
                                    ) : (
                                        ''
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chart;
