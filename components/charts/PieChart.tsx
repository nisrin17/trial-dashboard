import React from "react";
// import Chart from "react-apexcharts";
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const PieChart = (props: any) => {
    let series = props.series;
    const options: any = {
        chart: {
            toolbar: {
                show: true,
                offsetX: 8,
                offsetY: 0,
                tools: {
                    download: true,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true,
                    customIcons: [],
                },
                autoSelected: "zoom",
            },
        },
        colors: [
            '#2d95ec',
            '#f6ba2a',
            '#f64d2a',
            '#8abb21',
            '#e2711d',
            '#5c415d',
            '#498c8a',
        ],
        legend: {
            position: props.legend === undefined ? "right" : props.legend,
        },
        // legend: {
        //     show: false
        // },
        labels: props.categories,
        responsive: [
            {
                breakpoint: 1000,
                options: {
                    chart: {
                        width: "100%",
                    },
                    legend: {
                        position: "bottom",
                    },
                },
            },
        ],
    };
    return (
        <>
            <h4>
                {props.title}
            </h4>
            <h6>{props.sub}</h6>

            <div className="p-4 flex-auto">
                {series !== undefined ? (
                    <Chart
                        options={options}
                        series={series}
                        type="pie"
                        width={props.width === undefined ? "100%" : props.width}
                        height={props.height}

                    />
                ) : (
                    <div></div>
                )}
            </div>
        </>
    );
};

export default PieChart;
