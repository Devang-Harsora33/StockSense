import React, { useEffect, useState } from "react";
import { Line } from "@ant-design/charts";
import { auth, db } from "../database/firebase_config";
import { collection, getDocs } from "firebase/firestore";

const LineGraph = (productId) => {
  const [products, setproducts] = useState([]);
  const months = [
    new Date().toLocaleDateString("en-US", { month: "long", Month: "numeric" }),
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString(
      "en-US",
      { month: "long", Month: "numeric" }
    ),
    new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toLocaleDateString(
      "en-US",
      { month: "long", Month: "numeric" }
    ),
    new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toLocaleDateString(
      "en-US",
      { month: "long", Month: "numeric" }
    ),
    new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toLocaleDateString(
      "en-US",
      { month: "long", Month: "numeric" }
    ),
    new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toLocaleDateString(
      "en-US",
      { month: "long", Month: "numeric" }
    ),
  ];
  const currentUser = auth.currentUser;
  const uid = currentUser.uid;
  useEffect(() => {
    const fetchproducts = async () => {
      const productsCollection = collection(db, "users", uid, months);
      const productsSnapshot = await getDocs(productsCollection);
      const productsData = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setproducts(productsData);
    };

    fetchproducts();
  }, []);
  // useEffect(() => {
  //   const fetchproducts = async () => {
  //     const productsCollection = collection(db, "users", uid, months);
  //     const productsSnapshot = await getDocs(productsCollection);
  //     const productsData = productsSnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     setproducts(productsData);
  //   };

  //   fetchproducts();
  // }, [uid, months]);
  console.log(productId);
  console.log(products.product_id);
  const data = [
    {
      Month: new Date(
        Date.now() - 150 * 24 * 60 * 60 * 1000
      ).toLocaleDateString("en-US", { month: "long" }),
      value: 6,
    },
    {
      Month: new Date(
        Date.now() - 120 * 24 * 60 * 60 * 1000
      ).toLocaleDateString("en-US", { month: "long" }),
      value: 4.9,
    },
    {
      Month: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toLocaleDateString(
        "en-US",
        { month: "long" }
      ),
      value: 5,
    },
    {
      Month: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toLocaleDateString(
        "en-US",
        { month: "long" }
      ),
      value: 3.5,
    },
    {
      Month: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString(
        "en-US",
        { month: "long" }
      ),
      value: 4,
    },
    {
      Month: new Date().toLocaleDateString("en-US", { month: "long" }),
      value: 3,
    },
  ];

  const config = {
    data,
    height: 400,
    xField: "Month",
    yField: "value",
    point: {
      size: 5,
      shape: "diamond",
    },
    label: {
      style: {
        fill: "#aaa",
      },
    },
  };

  return <Line {...config} />;
};

export default LineGraph;
