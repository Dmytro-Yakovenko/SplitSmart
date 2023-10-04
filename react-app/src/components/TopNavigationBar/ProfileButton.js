import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/session";
import { useHistory } from "react-router";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    setShowMenu(!showMenu);
  };

  const closeMenu = () => setShowMenu(false);

  useEffect(() => {
    if (!showMenu) return;
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    closeMenu();
    history.push('/');
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <ul className="navigation-menu" ref={ulRef}>
        {user ? (
          <>
            <button className="nav-btn" onClick={openMenu}>
              <img src={user.image_url} alt={user.name} />
              <span>{user.short_name}</span>
            </button>
            <ul className={ulClassName}>
              <li> Hello, </li>
              <li>{user.name}!</li>
              <button className="settings" onClick={() => history.push('/settings')}>
                Settings
              </button>
              <button className="log-out" onClick={handleLogout}>
                Log Out
              </button>
            </ul>
          </>
        ) : (
          <>
            <button className='normal' onClick={() => history.push('/login')}>
              Log in
            </button>
            <button className='primary' onClick={() => history.push('/signup')}>
              Sign up
            </button>
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
