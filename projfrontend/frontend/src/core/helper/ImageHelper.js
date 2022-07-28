/* eslint-disable jsx-a11y/img-redundant-alt */
import React from "react";
import { API } from "../../backend";

//component to render product images from database
const ImageHelper = ({ product }) => {
  const imageUrl = product
    ? `${API}product/photo/${product._id}`
    : `https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061132_960_720.png`;
  return (
    <div>
      <div className="rounded border border-success p-2">
        <img
          src={imageUrl}
          alt="photo"
          style={{ maxHeight: "100%", maxWidth: "100%" }}
          className="mb-3 rounded"
        />
      </div>
    </div>
  );
};

export default ImageHelper;
