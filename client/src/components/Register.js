import React, { Fragment, useState } from "react";
import "../assets/scss/Login.scss";
import { Col, Row, Form, Button } from "react-bootstrap";
import { register } from "../actions/auth";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    repassword: "",
  });
  const { name, email, password, repassword } = formData;

  const onRegister = () => {
    if (password != repassword) {
        toast.warning(`password doesn't match`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })
    }
    dispatch(register({ name, email, password }));
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
            <h1>Register</h1>
            <Form.Control
              className="mt-2"
              placeholder="name"
              name="name"
              onChange={onChange}
            />
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
            <Form.Control
              type="password"
              className="mt-2"
              placeholder="password"
              name="repassword"
              onChange={onChange}
            />
            <p style={{ marginTop: '15px', paddingLeft: '0px' }}>If you have already account, <Link to="/login">Login</Link></p>
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
              <Button className="mt-2" style={{ width: '100%' }} onClick={() => onRegister()}>
                Sign Up
              </Button>
            </div>
          </Row>
        </div>
      </div>
    </Fragment>
  );
};

export default Register;
