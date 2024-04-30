import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../database/firebase_config";
import X from "/Navbar/X.png";
import calendar from "/Cases/calendar.png";
import people from "/Cases/people.png";
import category from "/Cases/search.png";
import placeholder from "/Cases/placeholder.png";
import person from "/Cases/person.png";
import phone from "/Cases/phone.png";
import file from "/Cases/file.png";
// import GeoMapping from "../components/GeoMapping";
import AOS from "aos";
import "aos/dist/aos.css";
import GeoMapping from "../components/GeoMapping";
import { Skeleton } from "antd";

const Details = ({ caseId, onClose }) => {
  const [caseDetails, setCaseDetails] = useState(null);
  const [evidences, setEvidences] = useState([]);

  useEffect(() => {
    AOS.init({
      // Initialize AOS
      duration: 1000, // Animation duration
      once: true, // Whether animation should only happen once
    });
  }, []);
  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        const casesCollection = collection(db, "cases");
        const q = query(casesCollection, where("case_id", "==", caseId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Assuming only one document matches the query
          const caseData = querySnapshot.docs[0].data();
          setCaseDetails(caseData);
        } else {
          console.log("No case found with the provided caseId");
        }
      } catch (error) {
        console.error("Error fetching case details:", error);
      }
    };

    fetchCaseDetails();
  }, [caseId]);
  useEffect(() => {
    const fetchEvidences = async () => {
      try {
        const evidencesCollection = collection(
          db,
          "cases",
          caseId,
          "evidences"
        );
        const querySnapshot = await getDocs(evidencesCollection);

        const updatedEvidences = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvidences(updatedEvidences);
      } catch (error) {
        console.error("Error fetching evidences:", error);
      }
    };

    fetchEvidences();
  }, [caseId]);

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
          Details for Case ID: {caseId}
        </h2> */}
        {caseDetails ? (
          <div
            key={caseDetails.case_id}
            className=" overflow-y-scroll h-[100%]  "
            // className="bg-white rounded-lg shadow-2xl ml-2 p-4 mb-4 mr-9 border-2 border-gray-200"
          >
            <div className="mb-1">
              <p className=" mr-2 text-sm text-gray-400">
                Case ID: #
                <span className=" text-sm  text-gray-400">
                  {caseDetails.case_id}
                </span>
              </p>
            </div>
            <div className=" relative">
              <div className="mb-2 pb-8 border-b-[1px] border-gray-300">
                <p className=" mr-2  text-2xl font-bold text-dark-purple">
                  Case Title:
                  <span className="text-2xl font-bold text-dark-purple">
                    {" "}
                    {caseDetails.case_title}
                  </span>
                </p>
              </div>
              <div className=" flex absolute right-0 bottom-0 flex-col justify-center items-center text-[12px]">
                <p className="text-gray-700">
                  Modified on:{" "}
                  <span className="text-gray-700">
                    {caseDetails.modified_time &&
                    caseDetails.modified_time.toDate &&
                    typeof caseDetails.modified_time.toDate === "function"
                      ? new Date(
                          caseDetails.modified_time.toDate()
                        ).toLocaleString("en-GB")
                      : "No reported date"}
                  </span>
                </p>
                <p className="text-gray-700">
                  Created On:{" "}
                  <span className="text-gray-700">
                    {caseDetails.created_time &&
                    caseDetails.created_time.toDate &&
                    typeof caseDetails.created_time.toDate === "function"
                      ? new Date(
                          caseDetails.created_time.toDate()
                        ).toLocaleString("en-GB")
                      : "No reported date"}
                  </span>
                </p>
              </div>
            </div>
            <div>
              <div className="flex mt-2 p-2 bg-slate-200 rounded-md border-[1px] mx-6 border-gray-300">
                <p className="mr-2 text-gray-500  font-semibold">
                  Description:
                </p>
                <span className="text-gray-500 ">
                  {caseDetails.case_description}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 gap-x-6 mt-4 text-gray-500">
                <div className="flex mt-2 items-center gap-x-1">
                  <img src={category} className=" w-7 " alt="" />
                  <p className="mr-2 text-gray-500">Category:</p>
                  <span className="text-gray-700">{caseDetails.category}</span>
                </div>
                <div className="flex mt-2 items-center gap-x-1">
                  <img src={calendar} className=" w-7 " alt="" />
                  <p className="mr-2 text-gray-500">Reported On:</p>
                  <span className="text-gray-700">
                    <span className="text-gray-700">
                      {caseDetails.created_time &&
                      caseDetails.created_time.toDate &&
                      typeof caseDetails.created_time.toDate === "function"
                        ? new Date(
                            caseDetails.created_time.toDate()
                          ).toLocaleString("en-GB")
                        : "No reported date"}
                    </span>
                  </span>
                </div>
                <div className="flex mt-2 items-center gap-x-1">
                  <img src={people} className=" w-7 " alt="" />
                  <p className="mr-2 text-gray-500">Party Involved:</p>
                  <span className="text-gray-700">
                    {caseDetails.involved_party}
                  </span>
                </div>
                <div className="flex mt-2 items-center gap-x-1">
                  <img src={person} className=" w-7 " alt="" />
                  <p className="mr-2 text-gray-500">Assigned To:</p>
                  <span className="text-gray-700">
                    {caseDetails.assigned_to}
                  </span>
                </div>
                <div className="flex mt-2 items-center gap-x-1">
                  <img src={placeholder} className=" w-7 " alt="" />
                  <p className="mr-2 text-gray-500">Location:</p>
                  <span className="text-gray-700">
                    {caseDetails.location_place}
                  </span>
                </div>
              </div>

              <div className="flex flex-col mt-6 items-start gap-x-1">
                <div>
                  <GeoMapping
                    latitude={caseDetails.location_x}
                    longitude={caseDetails.location_y}
                  />
                </div>
                <div className=" flex mt-4 items-center">
                  <img src={phone} className=" w-8 h-8 items-center" alt="" />
                  <p className="ml-2   text-gray-500">
                    Contact Details:
                    <br />
                    <span className="  text-gray-700">
                      {" "}
                      {caseDetails.contact_name},{caseDetails.contact_phone}
                    </span>
                  </p>
                </div>
              </div>

              <div className=" mt-6 flex flex-col ">
                <p>Uploaded Evidence(s)</p>
                <ul className=" mt-6">
                  {evidences.map((evidence) => (
                    <li key={evidence.id}>
                      <a
                        className=" p-4 border-2 border-gray-200 rounded-2xl flex gap-4 w-fit"
                        href={evidence.document_link}
                      >
                        {evidence.document_name}{" "}
                        <img src={file} className=" w-7" />
                      </a>
                    </li>
                  ))}
                </ul>
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
