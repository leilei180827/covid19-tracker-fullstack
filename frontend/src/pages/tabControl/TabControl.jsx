import React, { useState } from "react";
import AuDashBoard from "../au_map/AuDashBoard";
import WorldDashBoard from "../world_map/WorldDashBoard";
import { Col, Row, Typography} from "antd";
import "./TabControl.css";
const { Text } = Typography;
export default function TabControl() {
  const [updateTime, setUpdateTime] = useState(new Date().toLocaleDateString());

  const [tab, setTab] = useState("global");
  const changeTab = (name) => {
    setTab(name);
  };
  const getUpdateTime = (value) => {
    setUpdateTime(value);
  };
  return (
    <>
      <Row gutter={16} className="tabs">
        <Col span={6} className="tab-control">
          <Text
            onClick={() => changeTab("global")}
            className={"nav " + (tab === "global" && "active")}
          >
            Global
          </Text>
          <Text
            onClick={() => changeTab("australia")}
            className={"nav " + (tab === "australia" && "active")}
          >
            Australia
          </Text>
        </Col>
        <Col offset={12} span={6}>
          <Text className="update-time">
            updated at:
            <span className="update-time-content">{updateTime}</span>
          </Text>
        </Col>
      </Row>
      {tab === "global" && <WorldDashBoard getUpdateTime={getUpdateTime} />}
      {tab === "australia" && <AuDashBoard getUpdateTime={getUpdateTime} />}
    </>
  );
}
