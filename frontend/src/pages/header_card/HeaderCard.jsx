import React from "react";
import { Card, Col, Row } from "antd";
import CountUp from "react-countup";
export default function HeaderCard(props) {
  const quantity = props.quantity ? props.quantity : 0;
  const duration = 3;
  const styleHeadColor = props.styleColor ? props.styleColor : "#ffff43";
  return (
    <Card
      className="statistic-card border-decoration"
      headStyle={{ fontSize: "18px", color: styleHeadColor }}
      bodyStyle={{ fontSize: "15px" }}
      title={
        <CountUp end={quantity} duration={duration} separator=","></CountUp>
      }
      bordered={true}
    >
      {props.name.replace("_", " ")}
    </Card>
  );
}
