import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar"; // Assuming Navbar component is exported from './Navbar'
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../database/firebase_config";
import calendar from "/Cases/calendar.png";
import people from "/Cases/people.png";
import category from "/Cases/search.png";
import placeholder from "/Cases/placeholder.png";
import Details from "./Details";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const Pending = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  const [cases, setCases] = useState([]);
  const [caseId, setCaseId] = useState("");
  const [showAssignPopup, setShowAssignPopup] = useState(false); // State variable to track whether the assign popup should be shown

  useEffect(() => {
    const fetchCases = async () => {
      const casesCollection = collection(db, "cases");
      const casesSnapshot = await getDocs(casesCollection);
      const casesData = casesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCases(
        casesData.filter((caseItem) => caseItem.current_status === "pending")
      );
    };

    fetchCases();
  }, []);

  const handleCaseClick = (caseId) => {
    setCaseId(caseId);
  };

  const handleClosePopup = () => {
    setCaseId(""); // Clear caseId to close the details popup
  };

  const handleAssign = (caseId) => {
    setShowAssignPopup(true); // Show the assign popup when "Step-Up" button is clicked
    setCaseId(caseId); // Set the caseId for which assign popup is opened
  };

  const handleAssignSubmit = async (assignTo) => {
    try {
      const caseRef = doc(db, "cases", caseId);
      await updateDoc(caseRef, {
        assigned_to: assignTo,
        current_status: "assigned",
      });
      console.log("Case assigned successfully!");
      setShowAssignPopup(false);
      window.location.reload(); // Close the assign popup after updating the assign_to field
    } catch (error) {
      console.error("Error assigning case:", error);
    }
  };

  return (
    <>
      <section className="flex relative w-[100%] gap-x-10 ">
        <Navbar />
        <div className="w-[100%] mt-12 flex flex-col">
          <p data-aos="fade-left" className="w-[100%] text-4xl flex mb-[3rem]">
            Pending Cases
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
                <div className=" relative mb-2 pb-2 border-b-[1px] border-gray-300">
                  <p className=" mr-2  text-xl font-bold text-dark-purple">
                    Case Title:
                    <span className="text-xl font-bold text-dark-purple">
                      {" "}
                      {caseItem.case_title}
                    </span>
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event propagation
                      handleAssign(caseItem.case_id);
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
        {showAssignPopup && (
          <AssignPopup
            caseId={caseId}
            onSubmit={handleAssignSubmit}
            onClose={() => setShowAssignPopup(false)}
          />
        )}
      </section>
    </>
  );
};

const InvestigatorDropdown = ({ options }) => {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelect = (event) => {
    setSelectedRole(event.target.value);
  };

  return (
    <div className="relative">
      <select
        className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
        onChange={handleRoleSelect}
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M9.292 12.293a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L10 10.586 6.707 7.293a1 1 0 00-1.414 1.414l4 4z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      {/* {selectedRole && <p className="mt-2">You selected: {selectedRole}</p>} */}
    </div>
  );
};
const AssignPopup = ({ caseId, onSubmit, onClose }) => {
  const [assignTo, setAssignTo] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    "Inspector",
    "Detective",
    "Deputy Officer",
    "Constable",
    "Chief Investigator",
    "Forensic Investigator",
    "Surveillance Investigator",
    "Private Investigator",
    "Computer Forensic Investigator",
    "Criminal Investigator",
    "Fraud Investigator",
    "Homicide Investigator",
    "Narcotics Investigator",
    "Intelligence Analyst",
    "Crime Scene Investigator",
    "Internal Investigator",
    "Legal Investigator",
    "Financial Investigator",
    "Certified Fraud Examiner",
    "Certified Legal Investigator",
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    // You can perform additional actions here when a role is selected
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(assignTo);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-80">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Assign Case</h2>
          <div className="flex flex-col space-y-2">
            <label htmlFor="assignTo" className="text-sm">
              Assign To:
            </label>
            <InvestigatorDropdown options={roles} />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="bg-dark-purple text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            >
              Assign
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Pending;
