import React, { useEffect, useState } from "react";
import { auth, db } from "../database/firebase_config";
import { useNavigate } from "react-router-dom";
import login from "/Login/login.png";
import logout from "/Login/logout.png";
import Navbar from "../components/Navbar";
import PieChart from "../components/pieChart";
import { Card, Space, Statistic } from "antd";
import {
  CheckCircleOutlined,
  DollarCircleOutlined,
  FormOutlined,
  HourglassOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import HoverCard from "@darenft/react-3d-hover-card";
import AOS from "aos";
import "aos/dist/aos.css";
import "@darenft/react-3d-hover-card/dist/style.css";
import { collection, getDocs } from "firebase/firestore";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [revenue, setRevenue] = useState(0);
  const [products, setProducts] = useState([]);
  const [totalProductCount, setTotalProductCount] = useState([]);
  const [totalAmountInvested, setTotalAmountInvested] = useState("");
  const [totalAmountProfit, setTotalAmountProfit] = useState("");
  const [totalTranspotationCost, setTotalTranspotationCost] = useState("");
  const currentUser = auth.currentUser;
  const uid = currentUser.uid;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const ProductsCollection = collection(db, "users", uid, "products");
        const querySnapshot = await getDocs(ProductsCollection);
        const productData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const totalAmountInvested = productData.reduce((total, product) => {
          return total + parseFloat(product.amount_invested.replace(/,/g, ""));
        }, 0);
        const totalAmountProfit = productData.reduce((total, product) => {
          return total + parseFloat(product.total_profit.replace(/,/g, ""));
        }, 0);
        const totalTranspotationCost = productData.reduce((total, product) => {
          return (
            total + parseFloat(product.transportation_cost.replace(/,/g, ""))
          );
        }, 0);

        setProducts(productData);
        setTotalProductCount(productData.length);
        setTotalAmountInvested(totalAmountInvested.toLocaleString("en-IN"));
        setTotalTranspotationCost(
          totalTranspotationCost.toLocaleString("en-IN")
        );
        setTotalAmountProfit(totalAmountProfit.toLocaleString("en-IN"));
        setTotalAmountProfit(totalAmountProfit.toLocaleString("en-IN"));
      } catch (error) {
        console.error("Error fetching Products:", error);
      }
    };
    fetchProducts();
  }, [uid]);
  // const formattedTime = new Date(products.created_time).toLocaleString();
  // console.log(formattedTime);
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const ProductsCollection = collection(db, "Products");
  //       const ProductsSnapshot = await getDocs(ProductsCollection);
  //       let assignedCount = 0;
  //       let pendingCount = 0;
  //       let completedCount = 0;
  //       let onGoingCount = 0;

  //       ProductsSnapshot.forEach((doc) => {
  //         const status = doc.data().current_status;
  //         if (status === "assigned") {
  //           assignedCount++;
  //         } else if (status === "pending") {
  //           pendingCount++;
  //         } else if (status === "completed") {
  //           completedCount++;
  //         } else if (status === "onGoing") {
  //           onGoingCount++;
  //         }
  //       });

  //       setassigned(assignedCount);
  //       setpending(pendingCount);
  //       setcompleted(completedCount);
  //       setonGoing(onGoingCount);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);
  // console.log(Date.now());
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);
  const navigate = useNavigate();

  if (!user) {
    return null;
  }
  function DashboardCard({ title, value, icon }) {
    return (
      <HoverCard scaleFactor={1.1}>
        <Card data-aos="fade-left" className=" shadow-md text-[#000] px-3">
          <Space direction="horizontal">
            {icon}
            <Statistic title={title} value={value} />
          </Space>
        </Card>
      </HoverCard>
    );
  }

  return (
    <>
      <section className=" flex w-[100%] gap-x-10">
        <Navbar />
        <div className=" w-[100%] flex flex-col justify-center items-center gap-y-10 ">
          <p
            data-aos="fade-right"
            className=" w-[100%] text-4xl flex mb-[1rem]"
          >
            DashBoard
          </p>
          <div className=" flex w-[100%] flex-col justify-center h-fit items-center bg-slate-200 p-5 mr-9 rounded-xl">
            <Space direction="horizontal" className=" gap-x-12 mb-4">
              <DashboardCard
                icon={
                  <HourglassOutlined
                    style={{
                      color: "blue",
                      backgroundColor: "rgba(0,0,255,0.25)",
                      borderRadius: 20,
                      fontSize: 24,
                      padding: 8,
                    }}
                  />
                }
                title={"Total Products:"}
                value={totalProductCount}
              />
              <DashboardCard
                icon={
                  <FormOutlined
                    style={{
                      color: "white",
                      backgroundColor: "rgba(0, 128, 202)",
                      borderRadius: 20,
                      fontSize: 24,
                      padding: 8,
                    }}
                  />
                }
                title={"Total Amount Invested:"}
                value={totalAmountInvested}
              />
              <DashboardCard
                icon={
                  <CheckCircleOutlined
                    style={{
                      color: "red",
                      backgroundColor: "rgba(255,0,0,0.25)",
                      borderRadius: 20,
                      fontSize: 24,
                      padding: 8,
                    }}
                  />
                }
                title={"Total Amount Profit:"}
                value={totalAmountProfit}
              />
              {/* <DashboardCard
                icon={
                  <UserOutlined
                    style={{
                      color: "purple",
                      backgroundColor: "rgba(0,255,255,0.25)",
                      borderRadius: 20,
                      fontSize: 24,
                      padding: 8,
                    }}
                  />
                }
                title={"Total Transportation Cost:"}
                value={totalTranspotationCost}
              /> */}
            </Space>
            <section className=" flex w-[100%] justify-center items-center">
              <PieChart
                count1={totalProductCount}
                count2={totalAmountInvested}
                count3={totalAmountProfit}
              />
              <div
                data-aos="fade-left"
                className=" border-[1px] border-gray-400 rounded-2xl w-[50%] h-[27rem] flex flex-col p-4 overflow-y-scroll"
              >
                <p className=" text-[#626d7a] text-2xl border-b-[1px] pb-2 border-gray-400">
                  Recent Inventory Addition
                </p>
                <ul>
                  {products.map((productItem) => (
                    <li key={productItem.id}>
                      <div className=" relative flex w-full gap-x-4 justify-center items-center p-2 border-2 shadow-lg bg-slate-100 border-gray-300 rounded-2xl mt-2">
                        <div className=" w-[5rem]">
                          <img src={productItem.product_image} alt="img" />
                        </div>
                        <div>
                          <p className=" text-emerald_green font-semibold text-lg mt-5">
                            Product Title:{" "}
                            <span className=" ml-4 text-gray-600 font-normal text-base">
                              {productItem.product_name}
                            </span>
                          </p>
                          <div className=" flex gap-x-2">
                            <p className=" text-emerald_green font-semibold text-lg">
                              Description:{" "}
                            </p>
                            <span className=" text-gray-600 font-normal text-base">
                              {productItem.product_description}
                            </span>
                          </div>
                          <div className=" bg-emerald_green py-[0.6rem] px-4 absolute top-2 right-4 rounded-2xl">
                            <span className="text-white">
                              {productItem.created_time &&
                              productItem.created_time.toDate &&
                              typeof productItem.created_time.toDate ===
                                "function"
                                ? new Date(
                                    productItem.created_time.toDate()
                                  ).toLocaleDateString("en-GB")
                                : "No reported date"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
