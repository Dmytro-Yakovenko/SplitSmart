import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./TopNavigation.css";
import logo from './splitsmart-logo.png';

function TopNavigationBar() {
  const sessionUser = useSelector((state) => state.session.user);
  const headerLogin = sessionUser ? "header-login" : "";
  const titleLogin = sessionUser ? "title-login" : "";
  return (
    <header className={`header ${headerLogin}`}>
          <ul className="navigation">
            <li>
              <NavLink
                className="logo"
                exact
                to={sessionUser ? "/dashboard" : "/"}
              >
                {/* <img
                  id="logo"
                  alt="split-smart icon"
                  src="https://res.cloudinary.com/dr1ekjmf4/image/upload/v1687712495/images_lhirzh.png"
                /> */}
                <img src={logo} alt="splitsmart-logo" />
                <h1 className={`title ${titleLogin}`}>SplitSmart</h1>
              </NavLink>
            </li>
              <li>
                <ProfileButton user={sessionUser} />
              </li>
          </ul>
    </header>
  );
}

export default TopNavigationBar;
