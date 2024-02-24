import React, { useState, useEffect } from "react";
import { Pie } from "@ant-design/plots";
import AOS from "aos";
import "aos/dist/aos.css";

const PieChart = ({ assigned, pending, completed, onGoing }) => {
  const [config, setConfig] = useState({
    appendPadding: 10,
    data: [],
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: "inner",
      offset: "-50%",
      content: "{value}",
      style: {
        textAlign: "center",
        fontSize: 18,
        fill: "#fff",
      },
    },
    interactions: [{ type: "element-active" }],
  });
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  useEffect(() => {
    // Ensure values are numbers
    // const numericalData = [
    //   { type: "Pending Cases", value: Number(pending) },
    //   { type: "Assigned Cases", value: Number(assigned) },
    //   { type: "OnGoing Cases", value: Number(onGoing) },
    //   { type: "Completed Cases", value: Number(completed) },
    // ];
    const numericalData = [
      { type: "Pending Cases", value: 4 },
      { type: "Assigned Cases", value: 4 },
      { type: "OnGoing Cases", value: 4 },
      { type: "Completed Cases", value: 4 },
    ];

    setConfig({ ...config, data: numericalData });
  }, [pending, assigned, completed, onGoing]);

  return (
    <div data-aos="fade-right" style={{ width: "500px", height: "400px" }}>
      <Pie {...config} />
    </div>
  );
};

export default PieChart;
