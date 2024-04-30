import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar"; // Assuming Navbar component is exported from './Navbar'
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../database/firebase_config";

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

  return (
    <>
      <section className="flex w-[100%] gap-x-10">
        <Navbar />
        <div className="w-[100%] mt-12 flex flex-col">
          <p className="w-[100%] text-4xl flex mb-[3rem]">Add Cases </p>
          {/* Input fields for new case */}
          <div className="bg-white rounded-lg shadow-2xl p-4 mb-4 mr-9">
            <input
              type="text"
              name="caseId"
              value={newCase.caseId}
              onChange={handleChange}
              placeholder="Case ID"
              className="w-full px-3 py-2 mb-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              name="case_title"
              value={newCase.case_title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full px-3 py-2 mb-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            <textarea
              name="case_desc"
              value={newCase.case_desc}
              onChange={handleChange}
              placeholder="Description"
              className="w-full px-3 py-2 mb-2 border rounded-lg focus:outline-none focus:border-blue-500"
            ></textarea>
            <input
              type="text"
              name="case_location"
              value={newCase.case_location}
              onChange={handleChange}
              placeholder="Location"
              className="w-full px-3 py-2 mb-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              name="case_category"
              value={newCase.case_category}
              onChange={handleChange}
              placeholder="Category"
              className="w-full px-3 py-2 mb-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            <input
              type="datetime-local"
              name="case_reported"
              value={currentDatetimeLocalString}
              onChange={handleChange}
              className="w-full px-3 py-2 mb-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />

            <input
              type="text"
              name="case_partyInvolved"
              value={newCase.case_partyInvolved}
              onChange={handleChange}
              placeholder="Party Involved"
              className="w-full px-3 py-2 mb-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              name="case_status"
              value={newCase.case_status}
              onChange={handleChange}
              placeholder="Case Status"
              className="w-full px-3 py-2 mb-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSubmit}
              className="block w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Add Case
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddCases;
