import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

const Login = () => {

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const doLogin = async (formData, userType) => {
    try {
      const response = await axios.post('http://localhost:3200/login', {
        account: formData.account,
        password: formData.password,
        userType: userType
      });
      if (response.data.success) {
        console.log('登入成功', response.data);
        const uid = response.data.uid;
        navigate(`/${userType}/${uid}`);
      }
    } catch (error) {
      setError(error.response?.data?.error || '登入失敗');
    }
  };
  return (
    <div className="p-5 ">
      <div className=" d-flex rounded-5 overflow-hidden font-special">
        <div className="bg-primary w-50 f-col-center p-5 ">
          <img className="w-50 f-center" src="images/img/normal.png" alt="" />
          <LoginForm
            onSubmit={(formData) => doLogin(formData, 'member')}
            buttonText="我是顧客"
          />
        </div>
        <div className="bg-lake w-50 f-col-center p-5 ">
          <img className="w-50 f-center" src="images/img/vendor.png" alt="" />
          <LoginForm
            onSubmit={(formData) => doLogin(formData, 'vendor')}
            buttonText="我是攤主"
          />
        </div>
      </div>
      {error && <div className="text-danger mt-3">{error}</div>}
    </div>
  );
};
export default Login;
