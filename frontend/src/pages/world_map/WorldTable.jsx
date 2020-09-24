import React, { useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";
import echarts from "echarts";
import { Col, Row } from "antd";
export default function WorldTable({ data }) {
  const [history, setHistory] = useState({});
  useEffect(() => {
    expensiveComputation();
  }, [data]);
  const expensiveComputation = () => {
    // console.log(data);
    if (!data) return {};
    let dates = [];
    let new_cases = [];
    let new_deaths = [];
    data.map((item) => {
      dates.push(new Date(item.date_reported).toLocaleDateString());
      new_cases.push(item.new_cases);
      new_deaths.push(item.new_deaths);
    });
    // console.log(dates);
    setHistory({
      dates,
      new_cases,
      new_deaths,
    });
  };
  const colors = ["#87cefa", "#ff7f50", "#32cd32", "#da70d6"];
  const categories = ["new_cases", "new_deaths"];
  const options = categories.map((item, index) => ({
    title: {
      text: item.replace("_", " "),
      left: "left",
      textStyle: {
        color: "#ffffff",
        fontSize: 15,
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      bottom: 60,
    },
    dataZoom: [
      {
        type: "inside",
      },
      {
        type: "slider",
      },
    ],
    xAxis: {
      data: history.dates,
      type: "category",
      silent: false,
      splitLine: {
        show: false,
      },
      splitArea: {
        show: false,
      },
    },
    yAxis: {
      splitArea: {
        show: false,
      },
      name: "(K)",
      axisLabel: {
        formatter: function (a) {
          a = +a;
          return isFinite(a) ? echarts.format.addCommas(+a / 1000) : "";
        },
      },
    },
    series: [
      {
        type: "bar",
        data: history[item],
        large: true,
        itemStyle: {
          // color: "#c23531",
          color: colors[index],
        },
      },
    ],
  }));

  return (
    <Row gutter={16}>
      {options.map((item, index) => (
        <Col key={index} span={12}>
          <ReactEcharts
            className="border-decoration"
            option={item}
          ></ReactEcharts>
        </Col>
      ))}
    </Row>
  );
}
