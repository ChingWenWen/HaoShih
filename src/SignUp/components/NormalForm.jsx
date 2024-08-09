import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import axios from 'axios';

const NormalForm = ({ onRegistrationSuccess }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    nickname: '',
    tw_id: '',
    account: '',
    phone: '',
    email: '',
    address: '',
    password: '',
    doubleCheck: ''
  });

  const [errorMessage, setErrorMessage] = useState('');

  const doChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const doSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.password !== formData.doubleCheck) {
      setErrorMessage('密碼不相同');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3200/register', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      });
      console.log(response.data);
      alert('註冊成功');
      onRegistrationSuccess();
    } catch (error) {
      console.error('註冊失敗:', error);
      let errorMsg = '發生錯誤，請稍後再試';
      if (error.response) {
        console.error('錯誤狀態:', error.response.status);
        console.error('錯誤數據:', error.response.data);
        errorMsg = `註冊失敗: ${error.response.data.message || '伺服器錯誤'} (狀態: ${error.response.status})`;
      } else if (error.request) {
        console.error('未收到回應:', error.request);
        errorMsg = '無法連接到伺服器，請檢查您的網絡連接';
      } else {
        console.error('錯誤:', error.message);
        errorMsg = `發生錯誤: ${error.message}`;
      }
    }
  };

  return (
    <Form onSubmit={doSubmit}>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2" className="text-end" >
          會員姓名
        </Form.Label>
        <Col sm="3">
          <Form.Control type="text" placeholder="姓氏" name="first_name" value={formData.first_name} onChange={doChange} />
        </Col>
        <Col sm="5">
          <Form.Control type="text" placeholder="名字" name="last_name" value={formData.last_name} onChange={doChange} />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2" className="text-end">
          會員暱稱
        </Form.Label>
        <Col sm="8">
          <Form.Control type="text" placeholder="8個字以內" name="nickname" value={formData.nickname} onChange={doChange} />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2" className="text-end">
          身分字號
        </Form.Label>
        <Col sm="8">
          <Form.Control type="text" placeholder="開頭字母大寫" name="tw_id" value={formData.tw_id} onChange={doChange} />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2" className="text-end">
          會員帳號
        </Form.Label>
        <Col sm="8">
          <Form.Control type="text" placeholder="8~12個英數字組合" name="account" value={formData.account} onChange={doChange} />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2" className="text-end">
          手機號碼
        </Form.Label>
        <Col sm="8">
          <Form.Control type="tel" placeholder="手機號碼" name="phone" value={formData.phone} onChange={doChange} />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2" className="text-end">
          電子信箱
        </Form.Label>
        <Col sm="8">
          <Form.Control type="email" placeholder="電子信箱" name="email" value={formData.email} onChange={doChange} />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-5">
        <Form.Label column sm="2" className="text-end">
          通訊地址
        </Form.Label>
        <Col sm="8">
          <Form.Control
            type="textarea"
            placeholder="免郵遞區號"
            name="address"
            value={formData.address}
            onChange={doChange}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2" className="text-end">
          設定密碼
        </Form.Label>
        <Col sm="8">
          <Form.Control type="password" name="password" value={formData.password} onChange={doChange} />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-5">
        <Form.Label column sm="2" className="text-end">
          確認密碼
        </Form.Label>
        <Col sm="8">
          <Form.Control type="password" name="doubleCheck" value={formData.doubleCheck} onChange={doChange} />
        </Col>
      </Form.Group>
      <Row sm="8" className="justify-content-center">
        <Col className="d-flex justify-content-center">
          <Button
            className="bg-blueGray c-white me-3"
            variant="border border-2 rounded-pill px-4"
            type="submit"
          >
            確認
          </Button>
          <Button
            className="bg-gray c-white"
            variant="border border-2 rounded-pill px-4"
            type="button"
            onClick={() => setFormData({
              first_name: '',
              last_name: '',
              nickname: '',
              tw_id: '',
              account: '',
              phone: '',
              email: '',
              address: '',
              password: '',
              doubleCheck: ''
            })}
          >
            取消
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default NormalForm;
