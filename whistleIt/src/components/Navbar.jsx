import { useEffect, useState } from "react";
import control from "/Navbar/control.png";
// import calendar from "/Navbar/Calendar.png";
// import chart from "/Navbar/Chart.png";
// import chart_fill from "/Navbar/Chart_fill.png";
// import chat from "/Navbar/Chat.png";
// import folder from "/Navbar/Folder.png";
import logo from "/Navbar/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../database/firebase_config";
// import search from "/Navbar/Search.png";
// import setting from "/Navbar/Setting.png";
// import user from "/Navbar/User.png";
import login from "/Login/login.png";
import logout from "/Login/logout.png";

const Navbar = () => {
  const [open, setOpen] = useState(true);
  const Menus = [
    { title: "Dashboard", src: "Chart_fill", link: "/homepage" },
    { title: "Total Cases", src: "Chat", link: "/totalCases" },
    { title: "Assigned Cases", src: "Chart", link: "/assigned" },
    { title: "Pending Cases", src: "User", gap: true, link: "/pending" },
    { title: "OnGoing Cases", src: "Calendar", link: "/onGoing" },
    { title: "Completed Cases", src: "Search", link: "/completed" },
    // { title: "Files", src: "Folder", gap: true, link: "/files" },
    // { title: "Setting", src: "Setting", link: "/login" },
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
        } bg-dark-purple h-screen p-5  pt-8 relative duration-300`}
      >
        <img
          src={control}
          className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple
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
            WhistleIt
          </h1>
        </div>
        <ul className="pt-6">
          {Menus.map((Menu, index) => (
            <li
              key={index}
              className={`flex  rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 
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
                className=" flex w-fit  gap-x-4 rounded-md p-2 items-center  cursor-pointer hover:bg-light-white text-gray-300 text-sm"
              >
                <img className="profile-user w-[2.2rem] " src={logout} alt="" />
                <span className=" text-center">Logout</span>
              </div>
            ) : (
              <div className=" flex w-fit  gap-x-4 rounded-md p-2 items-center  cursor-pointer hover:bg-light-white text-gray-300 text-sm">
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
