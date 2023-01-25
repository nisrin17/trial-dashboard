import React from "react";
// import Chart from "react-apexcharts";
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const ColChart = (props: any) => {
    let series = props.series;
    const options: any = {
        chart: {
            type: "bar",
            zoom: {
                enabled: false,
            },
        },
        responsive: [
            {
                breakpoint: 840,
                options: {
                    chart: {
                        width: "100%",
                    },
                },
            },
        ],
        dataLabels: {
            enabled: false,
        },
        title: {
            text: '',
            align: "left",
        },
        grid: {
            row: {
                opacity: 0.5,
            },
        },
        xaxis: {
            categories: props.categories,
            // type: 'datetime',
            labels: {
                show: true,
                rotate: -45,
                style: {
                    // colors: '#fff',
                }
            },
        },
        yaxis: {
            labels: {
                show: true,
                style: {
                    // colors: '#fff',
                }
            },
        },
    };
    return (
        <>
            <h4>{props.title}</h4>
            <h6>{props.sub}</h6>
            <div className="p-4 flex-auto">
                {series !== undefined ? (
                    <Chart
                        options={options}
                        series={series}
                        type="bar"
                        width="100%"
                        height={props.height}
                    />
                ) : (
                    <div></div>
                )}
            </div>
        </>
    );
};

export default ColChart;
