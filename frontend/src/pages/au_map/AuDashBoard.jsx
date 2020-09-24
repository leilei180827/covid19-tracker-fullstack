import React, { useState, useEffect } from "react";
import { fetch_au_latest, fetch_au_states } from "../../network/australia";
import { Col, Row } from "antd";
import HeaderCard from "../header_card/HeaderCard";
import AuMap from "./AuMap";
import AuTable from "./AuTable";
export default function AuDashBoard(props) {
  const statesCode = ["act", "nsw", "nt", "qld", "sa", "tas", "vic", "wa"];
  const statesName = [
    "Australia Capital Territory",
    "New South Wales",
    "Northern Territory",
    "Queensland",
    "South Australia",
    "Tasmania",
    "Victoria",
    "Western Australia",
  ];
  const prepareDataForAuMap = (states) => {
    const result = [
      { name: "Australia Capital Territory" },
      { name: "New South Wales" },
      { name: "Northern Territory" },
      { name: "Queensland" },
      { name: "South Australia" },
      { name: "Tasmania" },
      { name: "Victoria" },
      { name: "Western Australia" },
    ];
    console.log(states);
    for (let item in states) {
      for (let i = 0; i < statesCode.length; i++) {
        if (item.includes(statesCode[i])) {
          if (item.includes("deaths")) {
            result[i]["deaths"] = Number(states[item]);
          } else if (item.includes("tests")) {
            result[i]["tests"] = Number(states[item]);
          } else {
            result[i]["value"] = Number(states[item]);
          }
        }
      }
    }
    return result;
  };
  const prepareDataForAuTable = (historyData) => {
    let pattern = {
      date: [],
      act: { confirmed: [], deaths: [], tests: [] },
      vic: { confirmed: [], deaths: [], tests: [] },
      nsw: { confirmed: [], deaths: [], tests: [] },
      qld: { confirmed: [], deaths: [], tests: [] },
      nt: { confirmed: [], deaths: [], tests: [] },
      wa: { confirmed: [], deaths: [], tests: [] },
      sa: { confirmed: [], deaths: [], tests: [] },
      tas: { confirmed: [], deaths: [], tests: [] },
    };
    // pattern['date']
    historyData.map((item) => {
      pattern.date.push(new Date(item.date_reported).toLocaleDateString());

      pattern.act.confirmed.push(item.act);
      pattern.act.deaths.push(item.act_deaths);
      pattern.act.tests.push(item.act_tests);

      pattern.vic.confirmed.push(item.vic);
      pattern.vic.deaths.push(item.vic_deaths);
      pattern.vic.tests.push(item.vic_tests);

      pattern.qld.confirmed.push(item.qld);
      pattern.qld.deaths.push(item.qld_deaths);
      pattern.qld.tests.push(item.qld_tests);

      pattern.nt.confirmed.push(item.nt);
      pattern.nt.deaths.push(item.nt_deaths);
      pattern.nt.tests.push(item.nt_tests);

      pattern.sa.confirmed.push(item.sa);
      pattern.sa.deaths.push(item.sa_deaths);
      pattern.sa.tests.push(item.sa_tests);

      pattern.wa.confirmed.push(item.wa);
      pattern.wa.deaths.push(item.wa_deaths);
      pattern.wa.tests.push(item.wa_tests);

      pattern.tas.confirmed.push(item.tas);
      pattern.tas.deaths.push(item.tas_deaths);
      pattern.tas.tests.push(item.tas_tests);

      pattern.nsw.confirmed.push(item.nsw);
      pattern.nsw.deaths.push(item.nsw_deaths);
      pattern.nsw.tests.push(item.nsw_tests);
    });
    return pattern;
  };
  const changeState = (value) => {
    console.log(value);
    if (statesName.indexOf(value) === -1) return;
    setStateName(statesCode[statesName.indexOf(value)]);
  };
  const [auLatest, setAuLatest] = useState({});
  const [auMapData, setAuMapData] = useState([]);
  const [auTableData, setAuTableData] = useState({});
  const [stateName, setStateName] = useState("vic");
  const tables = ["confirmed", "deaths", "tests"];
  useEffect(() => {
    fetch_au_latest()
      .then(({ data }) => {
        setAuLatest(data[0]);
        props.getUpdateTime(
          new Date(data[0].date_reported).toLocaleDateString()
        );
      })
      .catch((error) => console.log(error));
  }, [props]);

  useEffect(() => {
    fetch_au_states()
      .then(({ data }) => {
        setAuMapData(prepareDataForAuMap(data[data.length - 1]));

        setAuTableData(prepareDataForAuTable(data));
        // console.log(data);
      })
      .catch((error) => console.log(error));
  }, []);
  return (
    <div className="au-dashboard">
      <div className="au-cards">
        <Row gutter={16}>
          <Col span={8}>
            <HeaderCard
              quantity={auLatest.total_cases}
              name="total_cases in Australia"
            ></HeaderCard>
          </Col>
          <Col span={8}>
            <HeaderCard
              quantity={auLatest.total_deaths}
              name="total_deaths in Australia"
              styleColor="#ff4e4e"
            ></HeaderCard>
          </Col>
          <Col span={8}>
            <HeaderCard
              quantity={auLatest.total_tests}
              name="total_tests in Australia"
              styleColor="#25f3e6"
            ></HeaderCard>
          </Col>
        </Row>
      </div>
      <div className="au-graph">
        <Row gutter={[8, 8]}>
          <Col span={12}>
            <AuMap data={auMapData} changeState={changeState} />
          </Col>
          {tables.map((item, index) => (
            <Col span={12} key={index}>
              <AuTable
                date={auTableData.date}
                data={
                  auTableData[stateName] ? auTableData[stateName][item] : []
                }
                tableName={item}
                stateName={stateName}
              />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
