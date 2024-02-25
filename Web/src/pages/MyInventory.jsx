import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar"; // Assuming Navbar component is exported from './Navbar'
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { auth, db } from "../database/firebase_config";
import calendar from "/products/calendar.png";
import MoneyIcon from "@mui/icons-material/Money";
import Details from "./Details";
// import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { DeleteOutline, Inventory } from "@mui/icons-material";
import { Tab, Tabs } from "@mui/material";

const MyInventory = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);
  const [products, setproducts] = useState([]);
  const [productId, setproductId] = useState(null);
  const currentUser = auth.currentUser;
  const uid = currentUser.uid;

  const handleDelete = async (product_id) => {
    console.log(product_id);
    try {
      await deleteDoc(doc(db, "users", uid, "products", product_id));
      console.log("Product deleted successfully");
      // window.location.reload();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  const activeMonth = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const [value, setValue] = useState(activeMonth);

  const handleChange = (event, newValue) => {
    setValue(months[newValue]);
    console.log(months[newValue]);
  };
  const months = [
    new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString(
      "en-US",
      { month: "long", year: "numeric" }
    ),
    new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toLocaleDateString(
      "en-US",
      { month: "long", year: "numeric" }
    ),
    new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toLocaleDateString(
      "en-US",
      { month: "long", year: "numeric" }
    ),
    new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toLocaleDateString(
      "en-US",
      { month: "long", year: "numeric" }
    ),
    new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toLocaleDateString(
      "en-US",
      { month: "long", year: "numeric" }
    ),
  ];

  //   console.log(months);
  //   console.log(activeMonth);

  useEffect(() => {
    const fetchproducts = async () => {
      const productsCollection = collection(db, "users", uid, value);
      const productsSnapshot = await getDocs(productsCollection);
      const productsData = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setproducts(productsData);
    };

    fetchproducts();
  }, [uid, value]);
  console.log(products);
  // const navigate = useNavigate();
  const handleCaseClick = (productId) => {
    setproductId(productId);

    console.log(productId);
  };
  const handleClosePopup = () => {
    setproductId(null);
  };
  // const handleassign = (productId) => {
  //   console.log(productId);
  // };
  return (
    <>
      <section className="flex relative w-[100%] gap-x-10 overflow-hidden h-[100vh]">
        <Navbar />
        <div className="w-[100%] mt-12 flex flex-col ">
          <p data-aos="fade-left" className="w-[100%] text-4xl flex mb-[3rem]">
            My Inventory
          </p>
          <div className=" w-full flex justify-center items-center mb-6">
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
              textColor="primary"
              indicatorColor="primary"
              centered
              sx={{
                borderRadius: "8px",
                width: "80%",
              }}
            >
              {/* <Tab label={activeMonth} /> */}
              {months.map((month, index) => (
                <Tab key={index} label={month} />
              ))}
            </Tabs>
          </div>
          <div className=" overflow-y-scroll overflow-x-hidden h-[33rem]">
            {products.map((productDetails) => (
              <div
                data-aos="fade-left"
                key={productDetails.product_id}
                className="bg-white rounded-lg shadow-2xl flex justify-start gap-x-10 items-start ml-2 p-4 mb-4 mr-9 cursor-pointer border-2 border-gray-200"
                onClick={() => handleCaseClick(productDetails.product_id)}
              >
                <div className=" w-fit rounded-lg">
                  <img
                    src={productDetails.product_image}
                    className=" w-[100px] "
                    alt="image"
                  />
                </div>
                <div className=" w-full">
                  <div className="mb-0">
                    <p className=" mr-2 text-sm text-gray-400">
                      Product ID: #
                      <span className=" text-sm  text-gray-400">
                        {productDetails.product_id}
                      </span>
                    </p>
                  </div>
                  <div className="mb-2 pb-2 flex  justify-between items-center  border-b-[1px] border-gray-300">
                    <p className=" mr-2  text-xl font-bold text-emerald_green">
                      Product Name:
                      <span className="text-xl font-bold text-emerald_green">
                        {" "}
                        {productDetails.product_name}
                      </span>
                    </p>
                    <div className="flex mt-2 items-center gap-x-1">
                      <img src={calendar} className=" w-7 " alt="" />
                      <p className="mr-2 text-gray-500">Created On:</p>
                      <span className="text-gray-700">
                        <span className="text-gray-700">
                          {productDetails.created_time &&
                          productDetails.created_time.toDate &&
                          typeof productDetails.created_time.toDate ===
                            "function"
                            ? new Date(
                                productDetails.created_time.toDate()
                              ).toLocaleString("en-GB")
                            : "No reported date"}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex mt-2">
                      <p className="mr-2 text-gray-500">Description:</p>
                      <span className="text-gray-700">
                        {productDetails.product_description}
                      </span>
                    </div>

                    <div className=" flex w-full justify-between items-center">
                      <div className="grid grid-cols-2 gap-8 mt-4 text-gray-500">
                        <div className="flex mt-2 items-center gap-x-1">
                          {/* <img src={vector} className=" w-7 " alt="" /> */}
                          <Inventory />
                          <p className="mr-2 text-gray-500">Product Rate </p>
                          <p className="mr-2 text-gray-500">:</p>
                          <span className="text-gray-700">
                            {productDetails.product_rate}
                          </span>
                        </div>
                        <div className="flex mt-2 items-center gap-x-1">
                          {/* <img src={vector} className=" w-7 " alt="" /> */}
                          <MoneyIcon />
                          <p className="mr-2 text-gray-500">Product Profit </p>
                          <p className="mr-2 text-gray-500">:</p>
                          <span className="text-gray-700">
                            {productDetails.product_profit}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(productDetails.product_id)}
                        // className="delete-icon"
                      >
                        <DeleteOutline />
                      </button>
                      {/* <DeleteOutline /> */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {productId && (
          <Details productId={productId} onClose={handleClosePopup} />
        )}
      </section>
    </>
  );
};

export default MyInventory;
