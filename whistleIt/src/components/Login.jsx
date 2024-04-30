import React, { useState, useEffect } from "react";
// import "./login.css";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithRedirect,
} from "firebase/auth";
import { auth } from "../database/firebase_config";

import Glogo from "/Login/Google.png";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ToastContainer, toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "@firebase/firestore";
import Navbar from "./Navbar";

export default function Login() {
  const [password, setPass] = useState("");
  const [email, setEmail] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  // const [isHovered, setIsHovered] = useState(false);
  // const [redirectToHome, setRedirectToHome] = useState(false);
  const [currentUser, getCurrentUser] = useState({});
  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider)
      .then((result) => {
        // Handle successful sign-in
        const user = result.user;
        // console.log(user);
        getCurrentUser(result.user);
        // console.log(currentUser)
      })
      .catch((error) => {
        // Handle error
        console.log(error);
      });
  };

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
      const db = firebase.firestore();
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        role: role, // Replace with the user's actual name
        // Add other user details here
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
          <div className="flex flex-col justify-center items-center bg-dark-purple h-[100vh] w-[100%]">
            <div className="max-w-md p-4 border rounded-lg shadow-md bg-white">
              <div className="text-center">
                <p className="text-2xl font-bold">
                  Welcome back, Login to continue!
                </p>
                <p className="text-gray-600">
                  Easily Report, Track and Manage Cases
                </p>
              </div>
              <div className="my-4">
                <label
                  htmlFor="email_field"
                  className="block text-sm font-semibold text-gray-600 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email_field"
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                />
              </div>
              <div className="my-4">
                <label
                  htmlFor="password_field"
                  className="block text-sm font-semibold text-gray-600 mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password_field"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPass(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                />
              </div>
              <p>
                Don't have an account?{" "}
                <b
                  className="text-blue-500 cursor-pointer"
                  onClick={() => setIsLogin(false)}
                >
                  Sign up
                </b>
              </p>
              <button
                type="button"
                onClick={handleSignIn1}
                className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Log In
              </button>
              <div className="mt-4 flex items-center justify-center gap-x-2">
                <hr className="flex-1 border-gray-300" />
                <span className="text-gray-500">Or</span>
                <hr className="flex-1 border-gray-300" />
              </div>
              <button
                onClick={handleSignIn}
                className="mt-4 w-full flex items-center justify-center gap-x-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                <img
                  className="w-6 h-6"
                  id="google-login-icon"
                  src={Glogo}
                  alt=""
                />
                Sign In with Google
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center bg-dark-purple w-[100%] h-[100vh] ">
            <div className="max-w-md p-4 border rounded-lg shadow-md bg-white">
              <div className="text-center">
                <p className="text-2xl font-bold">
                  Hello, Welcome to WhistleIt!
                </p>
                <p className="text-gray-600">
                  Easily Report, Track and Manage Cases
                </p>
              </div>
              <div className="my-4">
                <label
                  htmlFor="name_field"
                  className="block text-sm font-semibold text-gray-600 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name_field"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                />
                <div className="my-4">
                  <label
                    htmlFor="role_field"
                    className="block text-sm font-semibold text-gray-600 mb-1"
                  >
                    Role
                  </label>
                  <select
                    id="role_field"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                  >
                    <option value="">Select Role</option>
                    <option value="police">Police</option>
                    {/* Add more roles as needed */}
                  </select>
                </div>
              </div>
              <div className="my-4">
                <label
                  htmlFor="email_field"
                  className="block text-sm font-semibold text-gray-600 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email_field"
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                />
              </div>
              <div className="my-4">
                <label
                  htmlFor="password_field"
                  className="block text-sm font-semibold text-gray-600 mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password_field"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPass(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                />
              </div>
              <p>
                Already have an account?{" "}
                <b
                  className="text-blue-500 cursor-pointer"
                  onClick={() => setIsLogin(true)}
                >
                  Log in
                </b>
              </p>
              <button
                onClick={handleSignUp5}
                className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Sign Up
              </button>
              <div className="mt-4 flex items-center justify-center gap-x-2">
                <hr className="flex-1 border-gray-300" />
                <span className="text-gray-500">Or</span>
                <hr className="flex-1 border-gray-300" />
              </div>
              <button
                onClick={handleSignIn}
                className="mt-4 w-full flex items-center justify-center gap-x-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                <img
                  className="w-6 h-6"
                  id="google-login-icon"
                  src={Glogo}
                  alt=""
                />
                Sign In with Google
              </button>
            </div>
            <ToastContainer />
          </div>
        )}
      </div>
    </>
  );
}
