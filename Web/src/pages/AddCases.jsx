import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar"; // Assuming Navbar component is exported from './Navbar'
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../database/firebase_config";
import uploadImg from "/AddProducts/Group.png";
import Aos from "aos";

const AddCases = () => {
  const [cases, setCases] = useState([]);
  const [newCase, setNewCase] = useState({
    caseId: "",
    case_title: "",
    case_desc: "",
    case_location: "",
    case_category: "",
    case_reported: null,
    case_partyInvolved: "",
  });

  useEffect(() => {
    const fetchCases = async () => {
      const casesCollection = collection(db, "cases");
      const casesSnapshot = await getDocs(casesCollection);
      const casesData = casesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCases(casesData);
    };

    fetchCases();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCase((prevCase) => ({
      ...prevCase,
      [name]: value,
    }));
  };
  useEffect(() => {
    Aos.init({
      duration: 1000,
    });
  }, []);
  const handleSubmit = async () => {
    try {
      const docRef = await addDoc(collection(db, "cases"), newCase);
      setNewCase({
        caseId: "",
        case_title: "",
        case_desc: "",
        case_location: "",
        case_category: "",
        case_reported: null,
        case_partyInvolved: "",
        case_status: "",
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  const timestampToDatetimeLocalString = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    // Format: YYYY-MM-DDTHH:mm (datetime-local input format)
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Set the input to the current timestamp
  const currentTimestamp = Date.now();
  const currentDatetimeLocalString =
    timestampToDatetimeLocalString(currentTimestamp);
  useEffect(() => {
    Aos.init({
      duration: 1000,
    });
  }, []);
  return (
    <>
      <section className="flex w-[100%] gap-x-10 overflow-y-hidden h-[100vh]">
        <Navbar />
        <div className="w-[100%] mt-12  flex flex-col ">
          <div
            data-aos="fade-left"
            className="w-[100%] text-left text-4xl flex flex-col font-urbanist mb-[3rem]"
          >
            {/* <p className=" text-5xl font-poppins text-emerald_green">
              StockSense
            </p> */}
            Add Product
            {/* <p className=" text-2xl"> </p> */}
          </div>
          {/* Input fields for new case */}
          <div
            data-aos="fade-left"
            className="bg-white rounded-lg shadow-2xl px-[4rem] py-[3rem] overflow-y-scroll mb-4 mr-9"
          >
            <label
              htmlFor="name_field"
              className="block font-urbanist text-gray-500 mb-1"
            >
              Product Name:
            </label>
            <input
              type="text"
              name="caseId"
              value={newCase.caseId}
              onChange={handleChange}
              placeholder="Enter Product Title "
              className="w-full px-4 py-3  mb-3 bg-[#fcfcfc] text-[#8391A1] font-urbanist border rounded-lg  focus:outline-none focus:border-gray-600"
            />

            <label
              htmlFor="name_field"
              className="block font-urbanist text-gray-500 mb-1 mt-4"
            >
              Product Description:
            </label>
            <textarea
              name="case_desc"
              value={newCase.case_desc}
              onChange={handleChange}
              placeholder="Enter a product description or remark"
              rows={6}
              cols={50}
              className="w-full px-4 py-3  mb-3 bg-[#fcfcfc] text-[#8391A1] font-urbanist border rounded-lg  focus:outline-none focus:border-gray-600"
            ></textarea>
            <label
              htmlFor="name_field"
              className="block font-urbanist text-gray-500 mb-1 mt-4"
            >
              Product Rate:
            </label>
            <input
              type="number"
              name="case_location"
              value={newCase.case_location}
              onChange={handleChange}
              placeholder="Enter product rate per unit"
              className="w-full px-4 py-3  mb-3 bg-[#fcfcfc] text-[#8391A1] font-urbanist border rounded-lg  focus:outline-none focus:border-gray-600"
            />
            <label
              htmlFor="name_field"
              className="block font-urbanist text-gray-500 mb-1 mt-4"
            >
              Product Profit:
            </label>
            <input
              type="number"
              name="case_category"
              value={newCase.case_category}
              onChange={handleChange}
              placeholder="Enter profit amount per unit"
              className="w-full px-4 py-3  mb-3 bg-[#fcfcfc] text-[#8391A1] font-urbanist border rounded-lg  focus:outline-none focus:border-gray-600"
            />
            <label
              htmlFor="name_field"
              className="block font-urbanist text-gray-500 mb-1 mt-4"
            >
              Transportation Cost:
            </label>
            <input
              type="text"
              name="case_partyInvolved"
              value={newCase.case_partyInvolved}
              onChange={handleChange}
              placeholder="Enter transportation cost per unit"
              className="w-full px-4 py-3  mb-3 bg-[#fcfcfc] text-[#8391A1] font-urbanist border rounded-lg  focus:outline-none focus:border-gray-600"
            />
            {/* <input
              type="datetime-local"
              name="case_reported"
              value={currentDatetimeLocalString}
              onChange={handleChange}
              className="w-full px-4 py-3  mb-3 bg-[#fcfcfc] text-[#8391A1] font-urbanist border rounded-lg  focus:outline-none focus:border-gray-600"
            /> */}

            <button
              onClick={handleSubmit}
              className=" w-full py-3 px-4 mb-3 mt-4 flex justify-center gap-x-8 items-center bg-emerald_green text-white font-urbanist rounded-lg hover:bg-dark_emerald_green transition-all ease-in-out focus:outline-none focus:bg-emerald_green"
            >
              Upload Image of the Product
              <img src={uploadImg} alt="upload" />
            </button>
            <button
              onClick={handleSubmit}
              className="block w-full py-3 px-4 mt-12 bg-emerald_green text-white font-urbanist rounded-lg hover:bg-dark_emerald_green transition-all ease-in-out focus:outline-none focus:bg-emerald_green"
            >
              Add Product
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddCases;
