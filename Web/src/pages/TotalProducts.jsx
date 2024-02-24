import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar"; // Assuming Navbar component is exported from './Navbar'
import { collection, getDocs } from "firebase/firestore";
import { db } from "../database/firebase_config";
import calendar from "/Cases/calendar.png";
import people from "/Cases/people.png";
import category from "/Cases/search.png";
import placeholder from "/Cases/placeholder.png";
// import Details from "./Details";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const TotalProducts = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);
  const [cases, setCases] = useState([]);
  const [caseId, setcaseId] = useState("");
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
  console.log(cases);
  // const navigate = useNavigate();
  const handleCaseClick = (caseId) => {
    setcaseId(caseId);
    console.log(caseId);
  };
  const handleClosePopup = () => {
    setcaseId(null);
  };
  const handleassign = (caseId) => {
    console.log(caseId);
  };
  return (
    <>
      <section className="flex relative w-[100%] gap-x-10">
        <Navbar />
        <div className="w-[100%] mt-12 flex flex-col overflow-hidden">
          <p data-aos="fade-left" className="w-[100%] text-4xl flex mb-[3rem]">
            Total Cases
          </p>
          <div className=" overflow-y-scroll overflow-x-hidden h-[40rem]">
            {cases.map((caseItem) => (
              <div
                data-aos="fade-left"
                key={caseItem.case_id}
                className="bg-white rounded-lg shadow-2xl ml-2 p-4 mb-4 mr-9 cursor-pointer border-2 border-gray-200"
                onClick={() => handleCaseClick(caseItem.case_id)}
              >
                <div className="mb-1">
                  <p className=" mr-2 text-sm text-gray-400">
                    Case ID: #
                    <span className=" text-sm  text-gray-400">
                      {caseItem.case_id}
                    </span>
                  </p>
                </div>
                <div className="mb-2 pb-2 border-b-[1px] border-gray-300">
                  <p className=" mr-2  text-xl font-bold text-dark-purple">
                    Case Title:
                    <span className="text-xl font-bold text-dark-purple">
                      {" "}
                      {caseItem.case_title}
                    </span>
                  </p>
                </div>
                <div>
                  <div className="flex mt-2">
                    <p className="mr-2 text-gray-500">Description:</p>
                    <span className="text-gray-700">
                      {caseItem.case_description}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4 text-gray-500">
                    <div className="flex mt-2 items-center gap-x-1">
                      <img src={placeholder} className=" w-7 " alt="" />
                      <p className="mr-2 text-gray-500">Location:</p>
                      <span className="text-gray-700">
                        {caseItem.location_place}
                      </span>
                    </div>
                    <div className="flex mt-2 items-center gap-x-1">
                      <img src={category} className=" w-7 " alt="" />
                      <p className="mr-2 text-gray-500">Category:</p>
                      <span className="text-gray-700">{caseItem.category}</span>
                    </div>
                    <div className="flex mt-2 items-center gap-x-1">
                      <img src={calendar} className=" w-7 " alt="" />
                      <p className="mr-2 text-gray-500">Reported On:</p>
                      <span className="text-gray-700">
                        <span className="text-gray-700">
                          {caseItem.created_time &&
                          caseItem.created_time.toDate &&
                          typeof caseItem.created_time.toDate === "function"
                            ? new Date(
                                caseItem.created_time.toDate()
                              ).toLocaleString("en-GB")
                            : "No reported date"}
                        </span>
                      </span>
                    </div>
                    <div className="flex mt-2 items-center gap-x-1">
                      <img src={people} className=" w-7 " alt="" />
                      <p className="mr-2 text-gray-500">Party Involved:</p>
                      <span className="text-gray-700">
                        {caseItem.involved_party}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {caseId && <Details caseId={caseId} onClose={handleClosePopup} />}
      </section>
    </>
  );
};

export default TotalProducts;
