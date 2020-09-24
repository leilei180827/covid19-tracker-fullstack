import React, { useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";
import echarts from "echarts";

export default function AuTable({ date, data, tableName, stateName }) {
  const [tableData, setTableData] = useState([]);
  const tables = ["confirmed", "deaths", "tests"];
  const colors = ["#ffff43", "#ff4e4e", "#25f3e6"];
  useEffect(() => {
    if (data) {
      let changes = [];
      for (let i = 1; i < data.length; i++) {
        let abs = data[i] - data[i - 1];
        changes.push(abs < 0 || abs > 150000 ? 0 : abs);
      }
      setTableData(changes);
    }
  }, [data]);

  const option = {
    color:
      tables.indexOf(tableName) === -1
        ? colors[0]
        : colors[tables.indexOf(tableName)],
    title: {
      text: `new ${tableName} record in ${stateName.toUpperCase()}`,
      left: "left",
      textStyle: {
        color: "#ffffff",
        fontSize: 14,
      },
    },
    tooltip: {
      trigger: "axis",
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
    xAxis: [
      {
        type: "category",
        data: date,
        axisPointer: {
          type: "shadow",
        },
        nameTextStyle: {
          fontSize: 2,
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        name: tableName === "tests" ? "(K)" : "",
        axisLine: {
          lineStyle: {
            color:
              tables.indexOf(tableName) === -1
                ? colors[0]
                : colors[tables.indexOf(tableName)],
            width: 1,
          },
        },
        axisLabel: {
          formatter: function (a) {
            if (tableName === "tests") {
              a = +a;
              return isFinite(a) ? echarts.format.addCommas(+a / 1000) : "";
            } else {
              return a;
            }
          },
        },

        nameTextStyle: {
          fontSize: 8,
        },
      },
    ],
    series: [
      {
        name: tableName,
        type: tableName === "confirmed" ? "bar" : "line",
        data: tableData,
      },
    ],
  };
  return (
    <ReactEcharts
      className="border-table-decoration"
      option={option}
    ></ReactEcharts>
  );
}
