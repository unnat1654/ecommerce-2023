import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState();
  const [relatedProducts, setRelatedProducts] = useState([]);
  //getProduct
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (params?.slug) {
      getProduct();
    }
  }, [params?.slug]);
  return (
    <Layout>
      <div className="row container mt-5">
        <div className="col-md-6">
          <img
            src={`/api/v1/product/product-photo/${product?._id}`}
            className="card-img-top mt-5"
          />
        </div>
        <div className="col-md-6 mt-5">
          <h1 className="text-center">Product Details</h1>
          <br />
          <h6>Name: {product?.name}</h6>
          <h6>Category: {product?.category.name}</h6>
          <h6>Description: {product?.description}</h6>
          <h6>Price: {product?.price}</h6>
        </div>
      </div>
      <hr />
      <div className="row">
        <h1>Similar Products</h1>
        {relatedProducts?.length < 1 && <p>No Similar Products Found</p>}
        <div className="d-flex flex-wrap">
          {relatedProducts?.map((p) => (
            <div className="card d-flex m-2" style={{ width: "18rem" }}>
              <img
                src={`/api/v1/product/product-photo/${p._id}`}
                className="card-img-top"
                alt="..."
              />
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <h5>{p.price}</h5>
                <p className="card-text">
                  {p.description.length > 200
                    ? `${p.description.substring(0, 200)}...`
                    : p.description}
                </p>
                <button className="btn btn-warning">Add To Cart</button>
                <button
                  className="btn btn-info ms-3"
                  onClick={() => {
                    navigate(`/product/${p.slug}`);
                  }}
                >
                  More Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
