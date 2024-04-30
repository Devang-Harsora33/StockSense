import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar"; // Assuming Navbar component is exported from './Navbar'
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../database/firebase_config";
import calendar from "/Cases/calendar.png";
import people from "/Cases/people.png";
import category from "/Cases/search.png";
import placeholder from "/Cases/placeholder.png";
import Details from "./Details";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const Assigned = () => {
  useEffect(() => {
    AOS.init({
      // Initialize AOS
      duration: 1000, // Animation duration
      once: true,
    });
  }, []);
  const [cases, setCases] = useState([]);
  const [caseId, setcaseId] = useState("");
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  useEffect(() => {
    const fetchCases = async () => {
      const casesCollection = collection(db, "cases");
      const casesSnapshot = await getDocs(casesCollection);
      const casesData = casesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCases(
        casesData.filter((caseItem) => caseItem.current_status === "assigned")
      );
    };

    fetchCases();
  }, []);
  console.log(cases);
  // const navigate = useNavigate();

  const handleProceedNextStep = async () => {
    try {
      const caseRef = doc(db, "cases", selectedCaseId);
      await updateDoc(caseRef, {
        current_status: "onGoing",
      });
      console.log("Case Proceeds successfully!");
      setIsPopupOpen(false); // Close the popup after proceeding
      window.location.reload();
    } catch (error) {
      console.error("Error assigning case:", error);
    }
  };

  const handleOngoing = (caseId) => {
    setSelectedCaseId(caseId);
    setIsPopupOpen(true); // Open the popup when the button is clicked
  };
  const handleCaseClick = (caseId) => {
    setcaseId(caseId);
    console.log(caseId);
  };
  const handleClosePopup = () => {
    setcaseId(null);
  };
  return (
    <>
      <section className="flex relative w-[100%] gap-x-10 ">
        <Navbar />
        <div className="w-[100%] mt-12 flex flex-col">
          <p data-aos="fade-left" className="w-[100%] text-4xl flex mb-[3rem]">
            Assigned Cases
          </p>
          <div className=" overflow-y-scroll overflow-x-hidden h-[40rem]">
            {cases.map((caseItem) => (
              <div
                data-aos="fade-left"
                key={caseItem.case_id}
                className="bg-white rounded-lg shadow-2xl ml-2 cursor-pointer p-4 mb-4 mr-9 border-2 border-gray-200"
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
                <div className="relative mb-2 pb-2 border-b-[1px] border-gray-300">
                  <p className="  mr-2  text-xl font-bold text-dark-purple">
                    Case Title:
                    <span className="text-xl font-bold text-dark-purple">
                      {" "}
                      {caseItem.case_title}
                    </span>
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event propagation
                      handleOngoing(caseItem.case_id);
                    }}
                    className=" absolute  z-30 text-gray-100 py-2 px-4 font-semibold bg-dark-purple rounded-2xl bottom-5 right-[5rem]"
                  >
                    Step-Up
                  </button>
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
      {isPopupOpen && (
        <ProceedNextStepPopup
          onClose={handleClosePopup}
          onProceed={handleProceedNextStep}
        />
      )}
    </>
  );
};
const ProceedNextStepPopup = ({ onClose, onProceed }) => {
  const [confirmation, setConfirmation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add any validation logic here
    if (confirmation === "CONFIRM") {
      onProceed();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-2xl p-4">
        <form onSubmit={handleSubmit}>
          <h2>Proceed to Next Step</h2>
          <p>Are you sure you want to proceed to the next step?</p>
          <label htmlFor="confirmation">Type "CONFIRM" to proceed:</label>
          <input
            type="text"
            id="confirmation"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            className="border rounded-md p-1"
          />
          <div className="mt-2">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md mr-2"
            >
              Proceed
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Assigned;
