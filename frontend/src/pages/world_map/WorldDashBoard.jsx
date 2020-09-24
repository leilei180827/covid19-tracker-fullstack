import React, { useState, useEffect } from "react";
import { Col, Row, Typography } from "antd";
import {
  fetch_global,
} from "../../network/world";
import "./WorldDashBoard.css";
import HeaderCard from "../header_card/HeaderCard";
import WorldMap from "./WorldMap";
import WorldTable from "./WorldTable";
export default function WorldDashBoard(props) {
  const [sum, setSum] = useState({
    cumulative_cases: 0,
    new_cases: 0,
    cumulative_deaths: 0,
    new_deaths: 0,
    date_reported: "",
  });
  const [globalHistory, setGlobalHistory] = useState([]);
  useEffect(() => {
    fetch_global()
      .then(({ data }) => {
        let sorted = data.sort(
          (a, b) => a.cumulative_cases - b.cumulative_cases
        );
        setSum(sorted[sorted.length - 1]);
        setGlobalHistory(sorted);
        props.getUpdateTime(
          new Date(sorted[sorted.length - 1].date_reported).toLocaleDateString()
        );
        // console.log(sorted);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="world">
      <div className="world-cards">
        <Row gutter={16}>
          <Col span={6}>
            <HeaderCard
              quantity={sum.cumulative_cases}
              name="cumulative_cases"
              styleColor="#25f3e6"
            ></HeaderCard>
          </Col>
          <Col span={6}>
            <HeaderCard quantity={sum.new_cases} name="new_cases"></HeaderCard>
          </Col>
          <Col span={6}>
            <HeaderCard
              quantity={sum.cumulative_deaths}
              name="cumulative_deaths"
            ></HeaderCard>
          </Col>
          <Col span={6}>
            <HeaderCard
              quantity={sum.new_deaths}
              name="new_deaths"
              styleColor="#25f3e6"
            ></HeaderCard>
          </Col>
        </Row>
      </div>
      <div className="world-map">
        <Row gutter={16}>
          {/* <Col span={2}></Col> */}
          <Col span={24}>
            <WorldMap />
          </Col>
          {/* <Col span={2}></Col> */}
        </Row>
      </div>
      <div className="world-table">
        <Row gutter={16}>
          <Col span={24}>
            <WorldTable data={globalHistory} />
          </Col>
        </Row>
      </div>
    </div>
  );
}
