import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, NavLink } from "react-router-dom";
import { useHistory } from "react-router";
import { signUp } from "../../store/session";
import './SignupForm.css';
import logo from './splitsmart-logo.png';

function SignupFormPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [imgURL, setImgURL] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);

  if (sessionUser) return <Redirect to="/dashboard" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      const data = await dispatch(signUp(name.split(" ")[0], name.split(" ")[1], email, phoneNumber, imgURL, password));
      if (data) {
        setErrors(data)
      } else {
        history.push('/dashboard');
      }
    } else {
      setErrors(['Confirm Password field must be the same as the Password field']);
    }
  };

  return (
    <div className="signup-form-container">
      <NavLink to="/" className="signup-form-image"><img src={logo} alt="splitsmart-logo" className="signup-logo" /></NavLink>
      <form className="signup-form" onSubmit={handleSubmit}>
        {errors.length > 0 && <ul>
          {errors.map((error, idx) => <li key={idx} className="error-msg">{error}</li>)}
        </ul>}
        <label>Hi there! My name is</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        <label>Here's my email address:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        <label>Here's my phone number:</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        <label>And here's my password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        <label>Confirm password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        <button className="accent" type="submit">Sign me up!</button>
      </form>
    </div>
  );
}

export default SignupFormPage;
