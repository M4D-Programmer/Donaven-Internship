import React from "react";
import Card from "../UI/Card";
import Skeleton from "../UI/Skeleton";

const AuthorItems = ({ data = [], loading = false }) => {
  if (loading) {
    return (
      <div className="de_tab_content">
        <div className="tab-1">
          <div className="row">
            {Array.from({ length: 8 }).map((_, index) => (
              <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={index}>
                <div className="nft__item">
                  <Skeleton width="100%" height="220px" borderRadius="10px" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="de_tab_content">
      <div className="tab-1">
        <div className="row">
          {data.map((item, index) => (
            <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={item.nftId || `${item.title}-${index}`}>
              <Card item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthorItems;
