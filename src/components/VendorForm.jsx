import { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
// import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VendorForm = (props) => {
  // 重新導向功能
  const navigate = useNavigate();
  // 管理表單資料
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    address: "",
    password: "",
  });
  // 表單是否已經被驗證
  const [validated, setValidated] = useState(false);
  // 手機號碼驗證狀態
  const [phoneError, setPhoneError] = useState(false);

  // 有 change => 更新 state
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "phone" && value !== "") {
      setPhoneError(!validatePhone(value));
    } else if (name === "phone" && value === "") {
      setPhoneError(false); // 如果欄位為空，不顯示錯誤
    }
  };

  // 手機號碼驗證函數
  const validatePhone = (phone) => {
    const phoneRegex = /^09\d{8}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false || !validatePhone(formData.phone)) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      // 把有改變且與原始數據不同的項目打包成一個新物件 updatedFields
      const updatedFields = Object.keys(formData).reduce((acc, key) => {
        if (formData[key] !== "" && formData[key] !== props.profile[key]) {
          acc[key] = formData[key];
        }
        return acc;
      }, {});

      try {
        const response = await axios.put(
          `http://localhost:3200/put/member/profile/${props.profile.uid}`,
          updatedFields
        );
        console.log("Full response:", response);

        // 根據響應決定是否導航
        if (response.status === 200) {
          console.log("Profile updated successfully:", response.data.message);
          console.log("Updated fields:", response.data.updatedFields);
          alert("資料更新成功");

          // 更新表單狀態
          setFormData((prevState) => ({
            ...prevState,
            ...updatedFields,
          }));

          // 更新 props.profile
          if (typeof props.onProfileUpdate === "function") {
            props.onProfileUpdate({ ...props.profile, ...updatedFields });
          }

          // 重新導回會員資料頁面
          navigate(`/member/${props.profile.uid}`);
        } else {
          console.log("Unexpected response status:", response.status);
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        if (error.response) {
          console.log("Error response:", error.response.data);
          console.log("Error status:", error.response.status);
        }
      }
    } catch (error) {
      // 在這裡處理錯誤，例如顯示錯誤消息
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className=" my-5 ">
        <Col sm="2" className="text-end">
          <p className="c-gray">一般會員</p>
        </Col>
        <Col sm="6">
          <div className="f-start">
            <h2 className="me-2">{props.profile.first_name}</h2>
            <h2 className="me-3">{props.profile.last_name}</h2>
          </div>
        </Col>
      </Row>
      <Row>
        <Col sm="2" className="text-end">
          <p>身份字號</p>
        </Col>
        <Col sm="6">{props.profile.tw_id}</Col>
      </Row>
      <Row>
        <Col sm="2" className="text-end">
          <p>會員帳號</p>
        </Col>
        <Col sm="6">{props.profile.account}</Col>
      </Row>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2" className="text-end">
          會員姓名
        </Form.Label>
        <Col sm="2">
          <Form.Control
            type="text"
            placeholder={props.profile.first_name}
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            id="validationCustomFirstName"
          />
        </Col>
        <Col sm="4">
          <Form.Control
            type="text"
            placeholder={props.profile.last_name}
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            id="validationCustomLastName"
          />
          <Form.Control.Feedback type="invalid">
            請輸入正確姓名
          </Form.Control.Feedback>
        </Col>
      </Form.Group>

      {/* 手機號碼 ==> 已加入驗證邏輯 */}
      <Form.Group as={Row} controlId="validationCustom02" className="mb-3">
        <Form.Label column sm="2" className="text-end">
          手機號碼
        </Form.Label>
        <Col sm="6">
          <Form.Control
            type="tel"
            placeholder={props.profile.phone}
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            isInvalid={phoneError}
          />
          <Form.Control.Feedback type="invalid">
            請輸入有效的手機號碼（格式：09xxxxxxxx）
          </Form.Control.Feedback>
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="validationCustom03" className="mb-3">
        <Form.Label column sm="2" className="text-end">
          電子信箱
        </Form.Label>
        <Col sm="6">
          <Form.Control
            type="email"
            placeholder={props.profile.email}
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <Form.Control.Feedback type="invalid">
            請輸入正確電子信箱
          </Form.Control.Feedback>
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="validationCustom04" className="mb-5">
        <Form.Label column sm="2" className="text-end">
          通訊地址
        </Form.Label>
        <Col sm="6">
          <Form.Control
            type="address"
            placeholder={props.profile.address}
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
          <Form.Control.Feedback type="invalid">
            請輸入正確地址
          </Form.Control.Feedback>
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="validationCustom05" className="mb-3">
        <Form.Label column sm="2" className="text-end">
          修改密碼
        </Form.Label>
        <Col sm="6">
          <Form.Control
            type="password"
            placeholder=""
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          <Form.Control.Feedback type="invalid">
            請輸入密碼
          </Form.Control.Feedback>
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="validationCustom06" className="mb-5">
        <Form.Label column sm="2" className="text-end">
          確認密碼
        </Form.Label>
        <Col sm="6">
          <Form.Control
            type="password"
            placeholder=""
            name="doubleCheck"
            required={formData.password ? "required" : ""}
          />
          <Form.Control.Feedback type="invalid">
            請輸入相同密碼
          </Form.Control.Feedback>
        </Col>
      </Form.Group>

      <Row>
        <Col sm="8">
          <div className="d-flex justify-content-center">
            <Button
              className="me-5"
              variant="bg-white border border-2 c-gray rounded-pill px-4 py-2"
              type="button"
              onClick={() => navigate(`/member/${props.profile.uid}`)}
            >
              取消變更
            </Button>
            <Button
              className="ms-5"
              variant=" bg-blueGray text-white rounded-pill px-4 py-2"
              type="submit"
            >
              儲存變更
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default VendorForm;