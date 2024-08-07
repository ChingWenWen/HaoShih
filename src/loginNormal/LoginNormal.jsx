import "bootstrap-icons/font/bootstrap-icons.css";

import LoginForm from "../components/LoginForm";

const LoginNormal = () => {
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
            <LoginForm />
          </div>
        </div>
      </div>
    </>
  );
};
export default LoginNormal;
