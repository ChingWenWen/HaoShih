import React from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import "bootstrap-icons/font/bootstrap-icons.css";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAxios from "axios-hooks";
import SubTitleYellow from "../../components/SubTitleYellow";

const VendorStallProfile = (props) => {
  //   console.log(props.stallProfile);
  const stallProfile = props.stallProfile;
  //   console.log(stallProfile);
  const navigate = useNavigate;

  return (
    <>
      <SubTitleYellow title="攤位資訊" />
      <div className="p-4 d-flex justify-content-center align-items-center d-grid gap-4">
        <div className="w-25 d-flex align-items-center d-grid">
          <img
            src={stallProfile.logo_img}
            className="rounded-circle w-100 object-fit-contain"
          />
        </div>
        <div className="w-75">
          <div className="d-flex justify-content-center">
            <Button
              className="me-5"
              variant=" bg-blueGray text-white rounded-pill px-4 py-2"
              type="submit"
            >
              編輯
            </Button>
            <Button
              variant="bg-white border border-2 c-gray rounded-pill px-4 py-2"
              type="button"
              //   點下去會error
              onClick={() => {
                navigate(`http://localhost:3000/shop/${stallProfile.vinfo}`);
              }}
            >
              查看我的攤位
            </Button>
          </div>
        </div>
      </div>
      <div className="p-4">
        <Row>
          <Col sm="2" className="text-end">
            <p>品牌名稱</p>
          </Col>
          <Col sm="6">{stallProfile.brand_name}</Col>
        </Row>
        <Row>
          <Col sm="2" className="text-end">
            <p>品牌類型</p>
          </Col>
          <Col sm="6">{stallProfile.brand_type}</Col>
        </Row>
        <Row>
          <Col sm="2" className="text-end">
            <p>品牌標籤</p>
          </Col>
          <Col sm="6">
            {stallProfile.tag1}
            {stallProfile.tag2 ? ` ; ${stallProfile.tag2}` : ""}
          </Col>
        </Row>

        {stallProfile.fb ? (
          <Row>
            <Col sm="2" className="text-end">
              <p>品牌ＦＢ</p>
            </Col>
            <Col sm="6">{stallProfile.fb}</Col>
          </Row>
        ) : (
          ""
        )}
        {stallProfile.ig ? (
          <Row>
            <Col sm="2" className="text-end">
              <p>品牌ＩＧ</p>
            </Col>
            <Col sm="6">{stallProfile.ig}</Col>
          </Row>
        ) : (
          ""
        )}
        {stallProfile.web ? (
          <Row>
            <Col sm="2" className="text-end">
              <p>品牌網站</p>
            </Col>
            <Col sm="6">{stallProfile.web}</Col>
          </Row>
        ) : (
          ""
        )}

        <Row>
          <Col sm="2" className="text-end">
            <p>品牌描述</p>
          </Col>
          {/* TODO: 需要解決排版問題 */}
          <Col sm="6">{stallProfile.content}</Col>
        </Row>

        <Row>
          <Col sm="2" className="text-end">
            <p>品牌視覺照</p>
          </Col>
          <Col sm="6">
            <img
              src={stallProfile.brand_img01}
              className="w-50 object-fit-contain"
            />
            {stallProfile.brand_img02 ? (
              <img
                src={stallProfile.brand_img02}
                className="w-50 object-fit-contain"
              />
            ) : (
              ""
            )}
            {stallProfile.brand_img03 ? (
              <img
                src={stallProfile.brand_img03}
                className="w-50 object-fit-contain"
              />
            ) : (
              ""
            )}
            {stallProfile.brand_img04 ? (
              <img
                src={stallProfile.brand_img04}
                className="w-50 object-fit-contain"
              />
            ) : (
              ""
            )}
            {stallProfile.brand_img05 ? (
              <img
                src={stallProfile.brand_img05}
                className="w-50 object-fit-contain"
              />
            ) : (
              ""
            )}
          </Col>
        </Row>
      </div>
    </>
  );
};

export default VendorStallProfile;
