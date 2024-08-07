import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

function LoginForm({ onSubmit, buttonText }) {
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    account: '',
    password: ''
  });

  const doSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      onSubmit(formData);
    }
    setValidated(true);
  };

  const doChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Form noValidate validated={validated} onSubmit={doSubmit}>
      <Col>
        <Form.Group as={Col} controlId="validationCustom01" className="mb-1">
          <Form.Label column>帳號</Form.Label>
          <Form.Control
            type="text"
            name="account"
            value={formData.account}
            onChange={doChange}
            required
          />
          <Form.Control.Feedback type="invalid">請輸入帳號</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} controlId="validationCustom02" className="mb-1">
          <Form.Label column>密碼</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={doChange}
            required
          />
          <Form.Control.Feedback type="invalid">請輸入密碼</Form.Control.Feedback>
        </Form.Group>

        <Col>
          <div className="f-center">
            <Button
              className="bg-white"
              variant=" border border-2 c-gray rounded-pill px-4 py-2 w-25"
              type="submit"
            >
              {buttonText}
            </Button>
          </div>
          <div className="f-start border-top p-3 mt-4 gap-3 w-100">
            <div className="fs-6"> 其他登入</div>
            <div className="f-center gap-4 w-25">
              <img className="w-25" src="images/icon/google.png" alt="google" />
              <img
                className="w-25"
                src="images/icon/facebook.png"
                alt="facebook"
              />
              <img
                className="w-25"
                src="images/icon/twitter.png"
                alt="twitter"
              />
            </div>
          </div>
        </Col>
      </Col>
      <div className="f-end gap-2">
        <div className="c-gray">還沒有帳號嗎？</div>
        <Button
          className="bg-white"
          variant="c-gray border border-2 rounded-pill px-4 py-2 w-25"
          type="button"
        >
          註冊
        </Button>
      </div>
    </Form>
  );
}

export default LoginForm;
