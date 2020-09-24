import React, { useState, useEffect } from "react";
// import echarts from "echarts";
import world from "echarts/map/js/world";
import ReactEcharts from "echarts-for-react";
import { fetch_countries } from "../../network/world";
import { countryNamesWHO, countryNamesEcharts } from "./diffCountryNames";

export default function WorldMap() {
  const [mapData, setMapData] = useState([]);
  useEffect(() => {
    fetch_countries()
      .then(({ data }) => {
        // console.log(data);
        let temp = modifyCountryName(data);
        // console.log(temp);
        setMapData(temp);
      })
      .catch((error) => console.log(error));
  }, []);
  const modifyCountryName = (countries) => {
    let temp = countries.map((item) => {
      let index = countryNamesWHO.indexOf(item.name);
      //   console.log(index);
      if (index !== -1) {
        item.name = countryNamesEcharts[index];
      }
      return item;
    });
    return temp;
  };
  const option = {
    title: {
      text: "Global Situation",
      link: "http://www.census.gov/popest/data/datasets.html",
      left: "left",
      textStyle: {
        color: "#ffffff",
        fontSize: 15,
      },
    },
    roam: false,
    tooltip: {
      trigger: "item",
      showDelay: 0,
      transitionDuration: 0.2,
      textStyle: {
        fontSize: 15,
        lineHeight: 18,
      },
      formatter: function (params) {
        if (params.data) {
          let result = `${params.data.name} <br/> 
              cumulative cases:${params.data.value} <br/>
              new cases:${params.data.new_cases}<br/>
              cumulative deaths:${params.data.cumulative_deaths}<br/>
              new deaths:${params.data.new_deaths}`;
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
        fontSize: 15,
        lineHeight: 18,
        width: "80%",
      },
      splitList: [
        {
          start: 1,
          end: 999,
        },
        {
          start: 1000,
          end: 99999,
        },
        {
          start: 100000,
          end: 999999,
        },
        {
          start: 1000000,
        },
      ],
      //   color: ["#8A3310", "#C64918", "#E55B25", "#F2AD92", "#F9DCD1"],
      color: ["#8A3310", "#E55B25", "#F2AD92", "#F9DCD1"],
    },
    toolbox: {
      show: true,
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
        name: "world_data",
        type: "map",
        roam: true,
        map: "world",
        emphasis: {
          label: {
            show: true,
            fontSize: 18,
          },
        },
        data: mapData,
      },
    ],
  };
  return (
    <ReactEcharts
      className="border-decoration world-map"
      option={option}
    ></ReactEcharts>
  );
}
