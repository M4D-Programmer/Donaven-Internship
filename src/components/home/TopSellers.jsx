import React from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import Skeleton from "../UI/Skeleton";

const TopSellers = ({ api_Data = [], loading }) => {
  const sellers = Array.isArray(api_Data) ? api_Data : [];

  const getSellerName = (item) =>
    item?.authorName || item?.name || item?.title || item?.username || "Unknown Seller";

  const getSellerPrice = (item) =>
    item?.price || item?.priceEth || item?.eth || item?.amount || item?.salePrice || "—";

  const getSellerImage = (item) => item?.authorImage || item?.image || item?.avatar || AuthorImage;

  const getSellerLink = (item) => (item?.authorId ? `/authors/${item.authorId}` : "/author");

  if (loading) {
    return (
      <section id="section-popular" className="pb-5">
        <div data-aos="fade-in" data-aos-easing="ease-in-out" data-aos-duration="1000" className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="text-center">
                <h2>Top Sellers</h2>
                <div className="small-border bg-color-2"></div>
              </div>
            </div>
            <div className="col-md-12">
              <ol className="author_list">
                {new Array(12).fill(0).map((_, index) => (
                  <li key={index}>
                    <div className="author_list_pp">
                      <Skeleton width="50px" height="50px" borderRadius="50%" />
                    </div>
                    <div className="author_list_info">
                      <Skeleton width="120px" height="16px" borderRadius="4px" />
                      <Skeleton width="60px" height="14px" borderRadius="4px" className="mt-2" />
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="section-popular" className="pb-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Top Sellers</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="col-md-12">
            <ol className="author_list">
              {sellers.slice(0, 12).map((item, index) => {
                const sellerName = getSellerName(item);
                const sellerPrice = getSellerPrice(item);
                const sellerImage = getSellerImage(item);
                const sellerLink = getSellerLink(item);

                return (
                  <li key={item?.authorId || item?.id || index}>
                    <div className="author_list_pp">
                      <Link to={sellerLink}>
                        <img className="lazy pp-author" src={sellerImage} alt={sellerName} />
                        <i className="fa fa-check"></i>
                      </Link>
                    </div>
                    <div className="author_list_info">
                      <Link to={sellerLink}>{sellerName}</Link>
                      <span>{sellerPrice}</span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSellers;
