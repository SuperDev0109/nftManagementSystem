import React, { Fragment, useState } from "react";
import "../assets/scss/Login.scss";
import { Col, Row, Form, Button } from "react-bootstrap";
import { login } from "../actions/auth";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;

  const onLogin = () => {
    dispatch(login({ email, password }));
  };
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <Fragment>
      <ToastContainer />
      <div className="loginPanel">
        <div className="card">
          <Row className="Schedule p-4 m-1">
            <h1>Login</h1>
            <Form.Control
              className="mt-2"
              placeholder="email"
              name="email"
              onChange={onChange}
            />
            <Form.Control
              type="password"
              className="mt-2"
              placeholder="password"
              name="password"
              onChange={onChange}
            />
            <p style={{ marginTop: '15px', paddingLeft: '0px' }}>If you don't have account, <Link to="/register">Sign Up</Link></p>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: "0px",
              }}
            >
              {/* <Link to="/">
                <Button className="mt-2">Back to Home</Button>
              </Link> */}
              <Button className="mt-6" style={{ width: '100%' }} onClick={() => onLogin()}>
                Login
              </Button>
            </div>
          </Row>
        </div>
      </div>
    </Fragment>
  );
};

export default Login;
