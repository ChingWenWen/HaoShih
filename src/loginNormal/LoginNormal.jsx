import "bootstrap-icons/font/bootstrap-icons.css";
import LoginForm from "../components/LoginForm";
import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginNormal = () => {

  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    console.log("LoginNormal handleSubmit", formData);
    // 登入邏輯
    try {
      const response = await axios.post('http://localhost:3200/', {
        account: formData.account,
        password: formData.password,
        userType: 'member'  
      });
      
      if (response.data.success) {
        console.log('登入成功', response.data);
        const uid = response.data.uid;
        // 成功登錄後導到會員頁面
        navigate(`/member/${uid}`);
      } else {
        setError(response.data.error || '登入失敗');
      }
    } catch (error) {
      console.error('登入失敗:', error);
      setError('登入過程發生錯誤，請稍後再試');
    }
  };
  return (
    <>
      <div className="p-5 ">
        <div className=" d-flex rounded-5 overflow-hidden ">
          {/* 一般用戶 */}
          <div className="bg-primary w-50 f-col-around p-5 gap-5">
            <div className="w-50">
              <img
                className=" w-100 f-center object-fit-cover "
                src="images/img/login1.png"
                alt=""
                style={{ height: "200px" }}
              />
            </div>

            <p className="text-center w-50 font-special fs-2">
              探索創意，感受熱情，享受與創作者交流的美好一切
            </p>
            <i className="bi bi-arrow-left-circle fs-3 fw-bolder c-white fs-1"></i>
          </div>

          {/* 登入 */}

          <div className="w-50 f-col-center p-5 bg-glass">
            <LoginForm onSubmit={handleSubmit} buttonText="登入" />
          </div>
        </div>
      </div>
    </>
  );
};
export default LoginNormal;
