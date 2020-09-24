import React from "react";
// import echarts from "echarts";
import australia from "echarts/map/js/australia";
import ReactEcharts from "echarts-for-react";

export default function AuMap(props) {
  const onChartClick = (params) => {
    props.changeState(params.data.name);
  };
  let onEvents = {
    click: onChartClick,
  };

  const option = {
    title: {
      text: "Australia Situation",
      subtext: "click on state to view record",
      left: "left",
      textStyle: {
        color: "#ffffff",
        fontSize: 16,
      },
      subtextStyle: {
        color: "#ffffff",
        fontSize: 12,
      },
    },
    roam: false,
    tooltip: {
      trigger: "item",
      showDelay: 0,
      transitionDuration: 0.2,
      textStyle: {
        fontSize: 14,
        lineHeight: 18,
      },
      formatter: function (params) {
        if (params.data) {
          let result = `${params.data.name} <br/> 
              total cases: ${params.data.value} <br/>
              total deaths: ${params.data.deaths}<br/>
              total tests: ${params.data.tests}`;
          return result;
        }
        return params.value;
      },
    },
    visualMap: {
      show: true,
      x: "left",
      y: "bottom",
      textStyle: {
        fontSize: 10,
        lineHeight: 14,
        width: "80%",
      },
      splitList: [
        {
          start: 1,
          end: 499,
        },
        {
          start: 500,
          end: 999,
        },
        {
          start: 1000,
          end: 9999,
        },
        {
          start: 10000,
        },
      ],
      color: ["#8A3310", "#E55B25", "#F2AD92", "#F9DCD1"],
    },
    toolbox: {
      show: true,
      //   orient: "vertical",
      left: "right",
      top: "top",
      itemSize: 8,
      itemGap: 2,
      feature: {
        dataView: { readOnly: false },
        restore: {},
        saveAsImage: {},
      },
    },
    series: [
      {
        name: "au_map",
        type: "map",
        roam: true,
        map: "australia",
        emphasis: {
          label: {
            show: true,
            fontSize: 12,
          },
        },
        data: props.data,
      },
    ],
  };
  return (
    <ReactEcharts
      className="border-decoration"
      option={option}
      onEvents={onEvents}
    ></ReactEcharts>
  );
}
