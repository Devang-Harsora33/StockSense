import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../database/firebase_config";
import X from "/Navbar/X.png";
// import calendar from "/products/calendar.png";
// import people from "/products/people.png";
// import category from "/products/search.png";
// import placeholder from "/products/placeholder.png";
// import person from "/products/person.png";
// import phone from "/products/phone.png";
// import file from "/products/file.png";
// import GeoMapping from "../components/GeoMapping";
import AOS from "aos";
import "aos/dist/aos.css";

import { Inventory, LocalShipping, QrCodeScanner } from "@mui/icons-material";
// import { Skeleton } from "antd";
import MoneyIcon from "@mui/icons-material/Money";
import LineGraph from "../components/lineChart";

const Details = ({ productId, onClose }) => {
  const [caseDetails, setCaseDetails] = useState(null);
  const [products, setProducts] = useState([]);
  const [newAmountInvested, setNewAmountInvested] = useState("");

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
    });
  }, []);
  const [quantity, setQuantity] = useState("10"); // Initial value

  const handleChange = (event) => {
    setQuantity(event.target.value);
  };
  const currentUser = auth.currentUser;
  const uid = currentUser.uid;
  console.log(productId);
  const [amountInvested, setAmountInvested] = useState(0); // Initial value

  const handleInvestClick = async (
    quantity,
    productRate,
    oldAmount_invested,
    productId
  ) => {
    // Remove commas and convert strings to numbers
    const numberString = productRate.replace(/,/g, "");
    const numberString2 = oldAmount_invested.replace(/,/g, "");

    const product_rate = parseFloat(numberString);
    const oldAmount = parseFloat(numberString2);
    let newAmountInvested = quantity * parseInt(product_rate);
    console.log(newAmountInvested);
    const totalAmountInvested = newAmountInvested + oldAmount;
    const formattedAmount = totalAmountInvested.toLocaleString("en-IN");
    console.log(formattedAmount);
    setAmountInvested(formattedAmount);

    const productRef = doc(
      db,
      "users",
      auth.currentUser.uid,
      "products",
      productId
    );

    try {
      await updateDoc(productRef, {
        amount_invested: formattedAmount,
      });
      console.log("Document successfully updated with new amount invested!");

      // Update the state with the formatted amount for display purposes
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productRef = doc(
          db,
          "users",
          auth.currentUser.uid,
          "products",
          productId
        );
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          setProducts(productSnap.data());
        } else {
          console.log("No such product!");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [productId, products]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div
        data-aos="fade-down"
        className="bg-white rounded-lg shadow-2xl p-4 py-6 my-8 h-[90vh] w-[50rem]"
      >
        <img
          src={X}
          className="absolute cursor-pointer w-[2rem] top-0 right-6 mr-6 mt-6 transition-all text-gray-600 hover:scale-125 hover:text-gray-900"
          onClick={onClose}
        />

        {/* <h2 className="text-sm font-base mb-2 text-gray-400">
          Details for Case ID: {productId}
        </h2> */}
        {products ? (
          <div
            key={products.product_id}
            className=" overflow-y-scroll h-[100%] w-full  overflow-hidden "
            // className="bg-white rounded-lg shadow-2xl ml-2 p-4 mb-4 mr-9 border-2 border-gray-200"
          >
            <div className=" w-full px-[1rem]">
              <div className="mb-1">
                <p className=" mr-2 text-sm text-gray-400">
                  Product ID: #
                  <span className=" text-sm  text-gray-400">
                    {products.product_id}
                  </span>
                </p>
              </div>
              <div className=" w-full flex flex-col justify-center items-center mt-3">
                <img
                  src={products.product_image}
                  className=" w-[60%] border border-2-gray-500 rounded-2xl"
                  alt="image"
                />
              </div>
              <div className=" w-full ">
                <div className="w-[90%] ml-8">
                  <p className=" text-emerald_green text-urbanist  border-b-2 pb-2 border-gray-300 text-3xl  mt-4">
                    {products.product_name}
                  </p>
                  <p className=" font-poppins mt-3">
                    {products.product_description}
                  </p>
                </div>
              </div>
              <div className=" flex w-full justify-between items-center ml-8">
                <div className="grid w-full grid-cols-2 gap-4 mt-4 text-gray-500">
                  <div className="flex mt-2 items-center gap-x-1">
                    {/* <img src={vector} className=" w-7 " alt="" /> */}
                    <Inventory />
                    <p className="mr-2 text-gray-500">Product Rate</p>
                    <p className="mr-2 text-gray-500">:</p>
                    <span className="text-gray-700 text-xl">
                      {products.product_rate}
                    </span>
                  </div>
                  <div className="flex mt-2 items-center gap-x-1">
                    {/* <img src={vector} className=" w-7 " alt="" /> */}
                    <MoneyIcon />
                    <p className="mr-2 text-gray-500">Product Profit</p>
                    <p className="mr-2 text-gray-500">:</p>
                    <span className="text-gray-700 text-xl">
                      {products.product_profit}
                    </span>
                  </div>
                  <div className="flex mt-2 items-center gap-x-1">
                    {/* <img src={vector} className=" w-7 " alt="" /> */}
                    <LocalShipping />
                    <p className="mr-2 text-gray-500">Transportation Cost</p>
                    <p className="mr-2 text-gray-500">:</p>
                    <span className="text-gray-700 text-xl">
                      {products.transportation_cost}
                    </span>
                  </div>
                  <div className="flex mt-2 items-center gap-x-1">
                    {/* <img src={vector} className=" w-7 " alt="" /> */}
                    <QrCodeScanner />
                    <p className="mr-2 text-gray-500">Barcode</p>
                    <p className="mr-2 text-gray-500">:</p>
                    <span className="text-gray-700 text-xl">
                      {products.product_barcodedata}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid w-full grid-cols-2 gap-4 mt-4 text-gray-500 px-8 py-4">
                <div className=" py-2 px-3 bg-emerald_green rounded-xl">
                  <p className=" w-full text-center font-urbanist text-white text-xl">
                    Amount Invested
                  </p>
                  <p className=" w-full text-center font-poppins text-white text-3xl">
                    {"₹ "}
                    {products.amount_invested}
                  </p>
                </div>
                <div className=" py-2 px-3 bg-emerald_green rounded-xl">
                  <p className=" w-full text-center font-urbanist text-white text-xl">
                    Net Profit
                  </p>
                  <p className=" w-full text-center font-poppins text-white text-3xl">
                    {"₹ "}
                    {products.total_profit}
                  </p>
                </div>
              </div>
              <div className=" w-full ">
                <div className="w-[90%] ml-8">
                  <p className=" text-gray-400 text-urbanist  border-b-2 pb-2 border-gray-300 text-xl  mt-4">
                    Product Performance Analysis
                  </p>
                </div>
                <LineGraph productId={products.product_id} />
              </div>
              <div
                className="grid w-full grid-cols-2 gap-4 mt-4 text-gray-500 px-8 py-4"
                style={{ gridTemplateColumns: "3fr 9fr" }}
              >
                <div className="py-2 px-3 w-fit bg-white rounded-xl border-2 border-gray-300">
                  <p className="w-full text-center font-urbanist text-gray-400 text-xl">
                    Total Quantity
                  </p>
                  <input
                    className="w-full text-center font-poppins text-gray-400 text-3xl outline-none border-none"
                    type="number"
                    value={quantity}
                    onChange={handleChange}
                  />
                </div>
                <button
                  className="py-2 px-3 w-full bg-emerald_green rounded-xl hover:bg-dark_emerald_green transition-all ease-in-out"
                  onClick={() =>
                    handleInvestClick(
                      quantity,
                      products.product_rate,
                      products.amount_invested,
                      products.product_id
                    )
                  }
                >
                  <p className="w-full text-center font-poppins text-white text-2xl">
                    Add to Current Inventory
                  </p>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};
export default Details;
