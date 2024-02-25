import { useEffect, useState } from "react";
import control from "/Navbar/control.png";
import logo from "/Navbar/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../database/firebase_config";

import login from "/Login/login.png";
import logout from "/Login/logout.svg";

const Navbar = () => {
  const [open, setOpen] = useState(true);
  const Menus = [
    { title: "Dashboard", src: "Chart_fill", link: "/homepage" },
    { title: "Add Product", src: "Chat", link: "/addProduct" },
    { title: "Total Products", src: "Chat", link: "/totalProducts" },
    { title: "My Inventory", src: "Chart", link: "/myInventory" },
  ];
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);
  const navigate = useNavigate();
  function GetUserID() {
    const [userID, setUID] = useState(null);
    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          setUID(user.uid);
        }
      });
    }, []);
    return userID;
  }
  const uid = GetUserID();

  const [isHover, setIsHover] = useState(false);
  const handleMouseEnter = () => {
    if (uid) {
      setIsHover(!isHover);
    } else {
      navigate("/");
    }
  };

  const handleLogOut = () => {
    auth
      .signOut()
      .then(() => {
        // Sign-out successful.
        navigate("/");
        console.log("User signed out successfully!");
      })
      .catch((error) => {
        // An error happened.
        console.error("Error signing out:", error);
      });
  };
  return (
    <div className="flex ">
      <div
        className={` ${
          open ? "w-72" : "w-20 "
        } bg-emerald_green h-screen p-5  pt-8 relative duration-300`}
      >
        <img
          src={control}
          className={`absolute cursor-pointer -right-3 top-9 w-7 border-emerald_green
           border-2 rounded-full  ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        />
        <div className="flex gap-x-4 items-center">
          <img
            src={logo}
            className={`cursor-pointer w-10 duration-500 ${
              open && "rotate-[360deg]"
            }`}
          />
          <h1
            className={`text-white origin-left font-medium text-xl duration-200 ${
              !open && "scale-0"
            }`}
          >
            StockSense
          </h1>
        </div>
        <ul className="pt-6">
          {Menus.map((Menu, index) => (
            <li
              key={index}
              className={`flex  rounded-md p-2 cursor-pointer hover:bg-light-white text-white text-sm items-center gap-x-4 
              ${Menu.gap ? "mt-9" : "mt-2"} ${
                index === 0 && "bg-light-white"
              } `}
            >
              <Link to={Menu.link} className=" flex gap-x-2">
                <img src={`./src/assets/${Menu.src}.png`} />
                <span
                  className={`${!open && "hidden"} origin-left duration-200`}
                >
                  {Menu.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="absolute Profile-icon w-[100%] bottom-2 ">
          <div>
            {user?.email ? (
              <div
                onClick={handleLogOut}
                className=" flex w-fit  gap-x-4 rounded-md p-2 items-center  cursor-pointer hover:bg-light-white text-white text-sm"
              >
                <img className="profile-user w-[2.2rem] " src={logout} alt="" />
                <span className=" text-center">Logout</span>
              </div>
            ) : (
              <div className=" flex w-fit  gap-x-4 rounded-md p-2 items-center  cursor-pointer hover:bg-light-white text-white text-sm">
                <img
                  className="default-user w-[2.2rem] "
                  onClick={handleMouseEnter}
                  src={login}
                  alt=""
                />
                <span className=" text-center">Login</span>
              </div>
            )}
          </div>

          {/* {isHover && (
            <div className="profile-user-details">
              {user?.email ? (
                <>
                  <div
                    className="after-login-navbar"
                    style={{ marginRight: "0.1rem" }}
                  > */}
          {/*<button className='logout-navbar' onClick={handleProfile}>Profile</button>*/}
          {/* <button className="logout-navbar" onClick={handleLogOut}>
                      Log out
                    </button>
                  </div> */}
          {/* <p>Name: <b>{user.displayName}</b></p> */}
          {/* </>
              ) : (
                <></>
              )}
            </div>
          )} */}
        </div>
      </div>
      {/* <div className="h-screen flex-1 p-7">
        <h1 className="text-2xl font-semibold ">Home Page</h1>
      </div> */}
    </div>
  );
};
export default Navbar;
