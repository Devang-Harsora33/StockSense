import React, { useState, useEffect } from "react";
// import "./login.css";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithRedirect,
} from "firebase/auth";
import { auth, db } from "../database/firebase_config";
import Glogo from "/Login/Google.png";
import login from "/Login/login_screen.svg";
import Vector from "/Login/Vector.png";
import Vector2 from "/Login/Vector2.png";
import Vector3 from "/Login/Vector3.png";
import Vector4 from "/Login/Vector4.png";
import Vector5 from "/Login/Vector5.png";
import signup from "/Login/signupscreen.svg";

import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ToastContainer, toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "@firebase/firestore";
import Aos from "aos";
// import Navbar from "./Navbar";

export default function Login() {
  const [password, setPass] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible2, setPasswordVisible2] = useState(false);
  useEffect(() => {
    Aos.init({
      duration: 1000,
    });
  }, []);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const togglePasswordVisibility2 = () => {
    setPasswordVisible2(!passwordVisible2);
  };
  const [password2, setPass2] = useState("");
  const [email, setEmail] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  // const [isHovered, setIsHovered] = useState(false);
  // const [redirectToHome, setRedirectToHome] = useState(false);
  const [currentUser, getCurrentUser] = useState({});

  // const handleSignUp1 = () => {
  //   createUserWithEmailAndPassword(auth, email, password)
  //     .then((userCredential) => {
  //       const user = userCredential.user;
  //       console.log("Logged in user:", user);
  //     })
  //     .catch((error) => {
  //       console.log(error.code, error.message);
  //       // Handle the error, you can also show a toast notification
  //       // toast.error("An error occurred. Please try again.");
  //     });
  // };

  const handleSignIn1 = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Logged in user:", user);
        navigate("/homepage");
      })
      .catch((error) => {
        console.log(error.code, error.message);
      });
  };

  const handleSignUp5 = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // const db = firebase.firestore();
      await setDoc(doc(db, "users", user.uid), {
        name: name,
      });
    } catch (error) {
      console.error("Error signing up:", error.message);
    }
  };

  //Check current logged in users
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        setUser(user);
      } else {
        // User is signed out
        setUser(null);
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user != null) {
      navigate("/");
    }
  });

  // {isOpen &&
  // if (!isOpen) return null;
  return (
    <>
      <div className=" flex w-[100%]">
        {/* <Navbar /> */}

        {isLogin ? (
          <div className="flex  justify-center items-center bg-[#fcfcfc] h-[100vh] w-[100%]">
            <div className=" w-full flex justify-center items-center">
              <img src={login} className=" w-[30rem]" alt="image" />
            </div>

            <div className=" flex justify-center items-center w-full">
              <div className=" max-w-[28rem] p-8 border rounded-lg shadow-md w-[100%] bg-white">
                <div className="text-center mb-[3rem]">
                  <p className="text-2xl font-medium font-poppins w-full mb-2 ">
                    Welcome back, Login to continue!
                  </p>
                  <p className="text-gray-600">
                    Easily Report, Track and Manage Cases
                  </p>
                </div>
                <div className="my-4">
                  <div className=" relative">
                    <img
                      src={Vector2}
                      alt="Icon"
                      className="absolute inset-y-0 left-0 ml-3 mt-3"
                    />
                    <input
                      type="email"
                      id="email_field"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 pl-[2.5rem] bg-[#fcfcfc] text-[#8391A1] font-urbanist border rounded-lg  focus:outline-none focus:border-gray-600"
                    />
                  </div>
                </div>
                <div className="my-4">
                  {/* <label
                    htmlFor="password_field"
                    className="block text-sm font-semibold text-gray-600 mb-1"
                  >
                    Password
                  </label> */}
                  <div className="relative">
                    <img
                      src={Vector3}
                      alt="Icon"
                      className="absolute inset-y-0 left-0 ml-3 mt-4"
                    />
                    <input
                      type={passwordVisible ? "text" : "password"}
                      id="password_field"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPass(e.target.value)}
                      className="w-full px-3 py-2 pl-[2.5rem] bg-[#fcfcfc] text-[#8391A1] font-urbanist border rounded-lg focus:outline-none focus:border-gray-600"
                    />
                    <img
                      src={Vector5}
                      alt="Icon"
                      className="absolute inset-y-0 right-0 mr-3 mt-3 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    />
                  </div>
                </div>
                <p className=" mt-[3rem]">
                  Don't have an account?{" "}
                  <b
                    className="text-emerald_green hover:text-dark_emerald_green transition-all ease-in-out cursor-pointer"
                    onClick={() => setIsLogin(false)}
                  >
                    Sign up
                  </b>
                </p>
                <button
                  type="button"
                  onClick={handleSignIn1}
                  className="mt-4 w-full bg-emerald_green hover:bg-dark_emerald_green transition-all ease-in-out text-white px-4 py-2 rounded-lg "
                >
                  Log In
                </button>
                {/* <div className="mt-4 flex items-center justify-center gap-x-2">
                  <hr className="flex-1 border-gray-300" />
                  <span className="text-gray-500">Or</span>
                  <hr className="flex-1 border-gray-300" />
                </div> */}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center overflow-hidden items-center bg-[#fcfcfc] w-[100%] h-[100vh] ">
            <div
              data-aos="fade-right"
              className=" w-full flex justify-center items-center"
            >
              <img src={signup} className=" w-[30rem]" alt="image" />
            </div>
            <div
              data-aos="fade-left"
              className=" flex justify-center items-center w-full"
            >
              <div className=" max-w-[28rem] p-8 border rounded-lg shadow-md w-[100%] bg-white">
                <div className="text-center">
                  <p className="text-2xl font-medium font-poppins w-full mb-2 ">
                    Hello, Welcome to StockSense!
                  </p>
                  <p className="text-gray-600">
                    Manage your Inventory at ease.
                  </p>
                </div>
                <div className="my-4">
                  {/* <label
                    htmlFor="name_field"
                    className="block text-sm font-semibold text-gray-600 mb-1"
                  >
                    Name
                  </label> */}
                  <div className=" relative">
                    <img
                      src={Vector}
                      alt="Icon"
                      className="absolute inset-y-0 left-0 ml-3 mt-3"
                    />
                    <input
                      type="text"
                      id="name_field"
                      placeholder="Username"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 pl-[2.5rem] bg-[#fcfcfc] text-[#8391A1] font-urbanist border rounded-lg  focus:outline-none focus:border-gray-600"
                    />
                  </div>
                </div>
                <div className="my-4">
                  <div className=" relative">
                    <img
                      src={Vector2}
                      alt="Icon"
                      className="absolute inset-y-0 left-0 ml-3 mt-3"
                    />
                    <input
                      type="email"
                      id="email_field"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 pl-[2.5rem] bg-[#fcfcfc] text-[#8391A1] font-urbanist border rounded-lg  focus:outline-none focus:border-gray-600"
                    />
                  </div>
                </div>
                <div className="my-4">
                  {/* <label
                    htmlFor="password_field"
                    className="block text-sm font-semibold text-gray-600 mb-1"
                  >
                    Password
                  </label> */}
                  <div className="relative">
                    <img
                      src={Vector3}
                      alt="Icon"
                      className="absolute inset-y-0 left-0 ml-3 mt-4"
                    />
                    <input
                      type={passwordVisible ? "text" : "password"}
                      id="password_field"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPass(e.target.value)}
                      className="w-full px-3 py-2 pl-[2.5rem] bg-[#fcfcfc] text-[#8391A1] font-urbanist border rounded-lg focus:outline-none focus:border-gray-600"
                    />
                    <img
                      src={Vector5}
                      alt="Icon"
                      className="absolute inset-y-0 right-0 mr-3 mt-3 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    />
                  </div>
                </div>
                <div className="my-4">
                  {/* <label
                    htmlFor="password_field"
                    className="block text-sm font-semibold text-gray-600 mb-1"
                    >
                    Password
                  </label> */}
                  <div className="relative">
                    <img
                      src={Vector3}
                      alt="Icon"
                      className="absolute inset-y-0 left-0 ml-3 mt-4"
                    />
                    <input
                      type={passwordVisible2 ? "text" : "password"}
                      id="password_field"
                      placeholder="Password"
                      value={password2}
                      onChange={(e) => setPass2(e.target.value)}
                      className="w-full px-3 py-2 pl-[2.5rem] bg-[#fcfcfc] text-[#8391A1] font-urbanist border rounded-lg focus:outline-none focus:border-gray-600"
                    />
                    <img
                      src={Vector5}
                      alt="Icon"
                      className="absolute inset-y-0 right-0 mr-3 mt-3 cursor-pointer"
                      onClick={togglePasswordVisibility2}
                    />
                  </div>
                </div>
                <p>
                  Already have an account?{" "}
                  <b
                    className="text-emerald_green hover:text-dark_emerald_green cursor-pointer transition-all ease-in-out"
                    onClick={() => setIsLogin(true)}
                  >
                    Log in
                  </b>
                </p>
                <button
                  onClick={handleSignUp5}
                  className="mt-4 w-full bg-emerald_green text-white px-4 py-2 rounded-lg hover:bg-dark_emerald_green transition-all ease-in-out"
                >
                  Register
                </button>
                <div className="mt-4 flex items-center justify-center gap-x-2"></div>
              </div>
            </div>
            <ToastContainer />
          </div>
        )}
      </div>
    </>
  );
}
