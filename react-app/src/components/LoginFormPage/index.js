import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router";
import './LoginForm.css';
import TopNavigationBar from "../TopNavigationBar";


function LoginFormPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  if (sessionUser) return <Redirect to="/dashboard" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    } else {
      history.push('/dashboard');
    }
  };

  return (
    <>
      <TopNavigationBar />
      <div className="login-form-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h1>Log in</h1>
          {errors.length > 0 && <ul>
            {errors.map((error, idx) => (
              <li key={idx} className="error-msg">{error}</li>
            ))}
          </ul>}
          <label>Email address</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="primary" type="submit">Log in</button>
          <button onClick={(e) => {
            setEmail('demo@aa.io');
            setPassword('password');
          }}>Log In as Demo User</button>
        </form>
      </div>
    </>

  );
}

export default LoginFormPage;
