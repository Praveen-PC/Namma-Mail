import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import "bootstrap/dist/js/bootstrap.bundle.min.js"; 

const Header = ({ handleMessageFilter, newMessage }) => {
  const navigate = useNavigate();
  let { ticketStatus } = useParams();
  const token = sessionStorage.getItem("authtoken");
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (token) {
      const jwttoken = token.split(".")[1];
      const decoded = JSON.parse(atob(jwttoken));
      if (decoded && decoded.role) {
        setUserRole(decoded.role);
      }
    }
  }, [token]);




  const handleLogout = () => {
    sessionStorage.removeItem("authtoken");
    navigate("/");
  };
  return (
    <>
      <nav className="navbar navbar-light bg-light ">

        <div className="container-fluid ">
          <div className="d-flex">

            <Link
              to="/dashboard"
              className="navbar-brand  h1 text-decoration-none fw-bold "
            >
              NammaMail

            </Link>

          </div>





          <div className="d-flex justify-content-around  shadow rounded border">


            {!token ? (
              ""
            ) : (
              <>
                <div className="d-flex justify-content-around border-end">
                  <button className="btn border-0 " >
                  <i class="fa-solid fa-user"></i>
                  </button>
                </div>
     
                <div className="d-flex justify-content-around ">
                  <button className="btn border-0 " onClick={handleLogout}>
                    <i className="fa-solid fa-right-from-bracket"></i>
                  </button>
                </div>
                  

              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;



// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useParams } from "react-router-dom";
// import { Popover } from "bootstrap";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";


// const Header = () => {
//   const navigate = useNavigate();
//   const token = sessionStorage.getItem("authtoken");
//   const [userData, setUserData] = useState(null);
//   const [profileData,setProfileData]=useState({
//     name:'',
//     email:'',
//     role:''
//   })
//   console.log("pro",profileData)
//   console.log(userData,"userdata")

//   useEffect(() => {
//     if (token) {
//       try {
//         const jwttoken = token.split(".")[1]; 
//         const decoded = JSON.parse(atob(jwttoken));
//         console.log("Decoded User Data:", decoded); 
//         setUserData(decoded); 
//         setProfileData({
//           name:'',
//           email:decoded.email,
//           role:decoded.role
//         })
//       } catch (error) {
//         console.error("Error decoding token:", error);
        
//       }
//     }
//   }, [token]);

//   useEffect(() => {
//     const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
//     popoverTriggerList.forEach(popover => {
//       new Popover(popover);
//     });
//   }, []);

//   const handleLogout = () => {
//     sessionStorage.removeItem("authtoken");
//     navigate("/");
//   };

//   return (
//     <>
//       <nav className="navbar navbar-light bg-light">
//         <div className="container-fluid">
//           <div className="d-flex">
//             <Link to="/dashboard" className="navbar-brand h1 text-decoration-none fw-bold">
//               NammaMail
//             </Link>
//           </div>

//           <div className="d-flex justify-content-around shadow rounded border">
//             {!token ? (
//               ""
//             ) : (
//               <>
//                 <div className="d-flex justify-content-around border-end">
                 
//                   <button
//                     type="button"
//                     className="btn border-0"
//                     data-bs-toggle="popover"
//                     data-bs-placement="bottom"
//                     data-bs-html="true"
//                     title="User Profile"
//                     data-bs-content={
//                       userData 
//                         ? `<strong>Name:</strong> ${userData.name || "N/A"} <br/>
//                           <strong>Email:</strong> ${userData.email || "N/A"} <br/>
//                           <strong>Role:</strong> ${userData.role || "N/A"}`
//                         : "No user data available"
//                     }
//                   >
//                     <i className="fa-solid fa-user"></i>
//                   </button>
//                 </div>

//                 <div className="d-flex justify-content-around">
//                   <button className="btn border-0" onClick={handleLogout}>
//                     <i className="fa-solid fa-right-from-bracket"></i>
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </nav>
//     </>
//   );
// };

// export default Header;

