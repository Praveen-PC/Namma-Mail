import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import logo from "../../assets/macsoft-logo.png";

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
