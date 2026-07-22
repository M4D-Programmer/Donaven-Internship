import React, { useEffect, useState } from "react";
import EthImage from "../images/ethereum.svg";
import { Link, useParams } from "react-router-dom";
import AuthorImage from "../images/author_thumbnail.jpg";
import Skeleton from "../components/UI/Skeleton";
import axios from "axios";

const ItemDetails = () => {
  const { nftId } = useParams();
  const [loading, setLoading] = useState(true);
  const [ITEM, setITEM] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);

      try {
        const ItemResponse = await axios.get(
          `https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails?nftId=${nftId}`
        );

        if (!isMounted) return;

        const data = ItemResponse.data;
        const api = Array.isArray(data) && data.length > 0 ? data[0] : data;

        const ItemDetails = {
          ...api,
          nftImage: api?.nftImage,
          nftId: api?.nftId || nftId,
          nftTag: api?.tag || "art",
          nftTitle: api?.title || "Rainbow Style",
          nftDescription: api?.description || "No description available.",
          nftPrice: api?.price || "1.85",
          nftOwner: api?.ownerName || "Monica Lucas",
          nftOwnerImage: api?.ownerImage || AuthorImage,
          nftOwnerId: api?.ownerId || "1",
          nftCreator: api?.creatorName || "Monica Lucas",
          nftCreatorImage: api?.creatorImage || AuthorImage,
          nftCreatorId: api?.creatorId || "1",
          nftViews: api?.views ?? 100,
          nftLikes: api?.likes ?? 74,
        };

        setITEM(ItemDetails);
      } catch (error) {
        console.error("Error fetching item data:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [nftId]);
    
  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>
        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">
            <div className="row">
              <div className="col-md-6 text-center">
                {loading || !ITEM ? (
                  <Skeleton width="640px" height="640px" className="me-3" />
                ) : (
                  <img
                    src={ITEM.nftImage}
                    className="img-fluid img-rounded mb-sm-30 nft-image"
                    alt={ITEM.nftTitle}
                  />
                )}
              </div>
              <div className="col-md-6">
                <div className="item_info">
                  {loading || !ITEM ? (
                    <>
                      <Skeleton width="60%" height="36px" className="mb-3" />
                      <div className="item_info_counts">
                        <div className="item_info_views">
                          <i className="fa fa-eye"></i>
                          <Skeleton width="40px" height="16px" />
                        </div>
                        <div className="item_info_like">
                          <i className="fa fa-heart"></i>
                          <Skeleton width="40px" height="16px" />
                        </div>
                      </div>
                      <Skeleton width="100%" height="56px" className="mt-3" />
                    </>
                  ) : (
                    <>
                      <h2>{ITEM?.nftTitle} #{ITEM?.nftTag}</h2>

                      <div className="item_info_counts">
                        <div className="item_info_views">
                          <i className="fa fa-eye"></i>
                          {ITEM?.nftViews}
                        </div>
                        <div className="item_info_like">
                          <i className="fa fa-heart"></i>
                          {ITEM?.nftLikes}
                        </div>
                      </div>
                      <p>{ITEM?.nftDescription}</p>
                    </>
                  )}
                  <div className="d-flex flex-row">
                    <div className="mr40">
                      <h6>Owner</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          {loading || !ITEM ? (
                            <Skeleton width="60px" height="60px" borderRadius="50%" />
                          ) : (
                            <Link to={`/authors/${ITEM?.nftOwnerId}`}>
                              <img className="lazy" src={ITEM?.nftOwnerImage} alt="" />
                              <i className="fa fa-check"></i>
                            </Link>
                          )}
                        </div>
                        <div className="author_list_info">
                          {loading || !ITEM ? (
                            <Skeleton width="120px" height="18px" />
                          ) : (
                            <Link to={`/authors/${ITEM?.nftOwnerId}`}>{ITEM?.nftOwner}</Link>
                          )}
                        </div>
                      </div>
                    </div>
                    <div></div>
                  </div>
                  <div className="de_tab tab_simple">
                    <div className="de_tab_content">
                      <h6>Creator</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          {loading || !ITEM ? (
                            <Skeleton width="60px" height="60px" borderRadius="50%" />
                          ) : (
                            <Link to={`/authors/${ITEM?.nftCreatorId}`}>
                              <img className="lazy" src={ITEM?.nftCreatorImage} alt="" />
                              <i className="fa fa-check"></i>
                            </Link>
                          )}
                        </div>
                        <div className="author_list_info">
                            {loading || !ITEM ? (
                              <Skeleton width="120px" height="18px" />
                            ) : (
                              <Link to={`/authors/${ITEM?.nftCreatorId}`}>{ITEM?.nftCreator}</Link>
                            )}
                        </div>
                      </div>
                    </div>
                    <div className="spacer-40"></div>
                    <h6>Price</h6>
                    <div className="nft-item-price">
                      <img src={EthImage} alt="" />
                      {loading || !ITEM ? (
                        <Skeleton width="40px" height="18px" />
                      ) : (
                        <span>{ITEM?.nftPrice}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemDetails;
