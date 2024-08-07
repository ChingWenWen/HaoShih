import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

const Login = () => {
  console.log('Login 組件開始渲染');

  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Login 組件掛載完成');
    return () => {
      console.log('Login 組件卸載');
    };
  }, []);

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
      } else {
        setError(response.data.error || '登入失敗');
      }
    } catch (error) {
      console.error('登入失敗:', error);
      setError(error.response?.data?.error || '登入失敗');
    }
  };

  const doMemberSubmit = async (formData) => {
    console.log('一般會員登入');
    await doLogin(formData, 'member');
  };

  const doVendorSubmit = async (formData) => {
    console.log('攤主登入');
    await doLogin(formData, 'vendor');
  };

  console.log('Login組件渲染', { doMemberSubmit, doVendorSubmit });

  return (
    <div className="p-5 ">
      <div className=" d-flex rounded-5 overflow-hidden font-special">
        <div className="bg-primary w-50 f-col-center p-5 ">
          <img className="w-50 f-center" src="images/img/normal.png" alt="" />
          <LoginForm
            onSubmit={doMemberSubmit}
            buttonText="我是顧客"
          />
           {console.log('顧客 LoginForm 渲染', { onSubmit: doMemberSubmit })}
        </div>
        <div className="bg-lake w-50 f-col-center p-5 ">
          <img className="w-50 f-center" src="images/img/vendor.png" alt="" />
          <LoginForm
            onSubmit={doVendorSubmit}
            buttonText="我是攤主"
          />
        </div>
      </div>
      {error && <div className="text-danger mt-3">{error}</div>}
    </div>
  );
};
export default Login;
