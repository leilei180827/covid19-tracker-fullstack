import React from "react";
import TabControl from "./tabControl/TabControl";
import "./index.css";
import { Typography, Layout } from "antd";
const { Title } = Typography;
const { Footer } = Layout;

export default function MainPage() {
  return (
    <div className="main-page">
      <Title className="page-header" level={2}>
        Covid-19 Tracker
      </Title>
      <TabControl />
      <Footer className="page-footer">
        <span className="page-footer-content">Data Source: WHO&arcgis</span>
      </Footer>
    </div>
  );
}
