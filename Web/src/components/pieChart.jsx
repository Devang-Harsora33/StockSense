import React, { useState, useEffect } from "react";
import { Pie } from "@ant-design/plots";
import AOS from "aos";
import "aos/dist/aos.css";

const PieChart = ({ count1, count2, count3 }) => {
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
    console.log("Counts:", count1, count2, count3);

    // Check if count1, count2, and count3 are defined and are strings
    if (typeof count2 === "string" && typeof count3 === "string") {
      const number2 = count2.replace(/,/g, "");
      const number3 = count3.replace(/,/g, "");

      const numericalData = [
        // { type: "Total Products", value: Number(count1) },
        { type: "Total Amount Invested", value: Number(number2) },
        { type: "Total Amount Profit", value: Number(number3) },
      ];

      console.log("Numerical Data:", numericalData);

      setConfig({ ...config, data: numericalData });
    } else {
      console.error("One or more of the count variables are not strings.");
    }
  }, [count1, count2, count3]);

  return (
    <div data-aos="fade-right" style={{ width: "500px", height: "400px" }}>
      {config.data.length > 0 && <Pie {...config} />}{" "}
      {/* Render chart only when data is available */}
    </div>
  );
};

export default PieChart;
