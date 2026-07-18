import React from "react";
import { Link } from "react-router-dom";

const Card = ({ item, countdown, variant = "item" }) => {
  if (!item) return null;

  const title = item.title || item.name || "Untitled";
  const authorLink = item.authorId ? `/authors/${item.authorId}` : "/author";
  const itemLink = item.nftId ? `/item-details/${item.nftId}` : "/item-details";
  const price = item.price ?? item.priceEth ?? item.amount ?? "—";
  const likes = item.likes ?? item.likeCount ?? 0;
  const authorImage = item.authorImage || item.image || "";
  const nftImage = item.nftImage || item.image || "";

  if (variant === "collections") {
    return (
      <div className="nft_coll">
        <div className="nft_wrap">
          <Link to={itemLink}>
            <img src={nftImage} className="lazy img-fluid" alt={title} />
          </Link>
        </div>
        <div className="nft_coll_pp">
          <Link to={authorLink}>
            <img className="lazy pp-coll" src={authorImage} alt={title} />
          </Link>
          <i className="fa fa-check"></i>
        </div>
        <div className="nft_coll_info">
          <Link to={itemLink}>
            <h4>{title}</h4>
          </Link>
          <span>{item.code ? `ERC-${item.code}` : item.category || "NFT"}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="nft__item">
      <div className="author_list_pp">
        <Link
          to={authorLink}
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={`Creator: ${title}`}
        >
          <img className="lazy" src={authorImage} alt={title} />
          <i className="fa fa-check"></i>
        </Link>
      </div>
      {countdown ? <div className="de_countdown">{countdown}</div> : null}

      <div className="nft__item_wrap">
        <div className="nft__item_extra">
          <div className="nft__item_buttons">
            <button type="button">Buy Now</button>
            <div className="nft__item_share">
              <h4>Share</h4>
              <button type="button" className="btn btn-link p-0">
                <i className="fa fa-facebook fa-lg"></i>
              </button>
              <button type="button" className="btn btn-link p-0">
                <i className="fa fa-twitter fa-lg"></i>
              </button>
              <button type="button" className="btn btn-link p-0">
                <i className="fa fa-envelope fa-lg"></i>
              </button>
            </div>
          </div>
        </div>

        <Link to={itemLink}>
          <img src={nftImage} className="lazy nft__item_preview" alt={title} />
        </Link>
      </div>
      <div className="nft__item_info">
        <Link to={itemLink}>
          <h4>{title}</h4>
        </Link>
        <div className="nft__item_price">{price} ETH</div>
        <div className="nft__item_like">
          <i className="fa fa-heart"></i>
          <span>{likes}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;