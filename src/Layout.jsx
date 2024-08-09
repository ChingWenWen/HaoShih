import React from "react";
import styles from "./Layout.module.scss";
import Home from "./home/Home";
import News from "./news/News";
import AllVendors from "./allVendor/AllVendors";
import Vendor from "./vendor/Vendor";
import Type from "./type/Type";
import Map from "./map/Map";
import MemberIndexNormal from "./memberIndexNormal/MemberIndexNormal";
import MemberIndexVendor from "./memberIndexVendor/MemberIndexVendor";
import Login from "./login/Login";
import LoginNormal from "./loginNormal/LoginNormal";
import LoginVendor from "./loginVendor/LoginVendor";
import ShopCart from "./shopCart/ShopCart";
import Normal from "./SignUp/Normal";
import SetStalls from "./setStalls/SetStalls";
import Default from "./default/Default";

import { Routes, Route, useLocation } from "react-router-dom";

// TODO:
// 1. 把 Home 搬進來、Layout 搬進 App（注意路徑改變）
// 2. 加上背景xe
// 3. 加上 React Router
const Layout = () => {
  const location = useLocation();
  return (
    <div className="layout">
      <div className="position-relative">
        <div className={styles.background}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/haoshih" element={<Home />} />
            <Route path="/news" element={<News />} />
            <Route path="/shop" element={<AllVendors />} />
            <Route path="/vendor" element={<Vendor />} />
            <Route path="/type" element={<Type />} />
            <Route path="/map" element={<Map />} />
            <Route path="/SetStalls" element={<SetStalls />} />
            {/* TODO: default route  =- 已經在 default/Default.jsx*/}
            <Route path="/member/:uid" element={<MemberIndexNormal />} />
            <Route path="/vendor/:vid" element={<MemberIndexVendor />} />
          </Routes>
          {/* <ShopCart /> */}
          {/* <Step1 /> */}
          {/* <Normal /> */}
        </div>
      </div>
      <Login />
      <LoginNormal />
      <LoginVendor />
    </div>
  );
};

export default Layout;
