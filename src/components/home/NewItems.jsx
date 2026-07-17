import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import Skeleton from "../UI/Skeleton";

const NewItems = ({ api_Data, loading }) => {
  const [items, setItems] = useState([]);
  const [now, setNow] = useState(Date.now());

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 1,
      spacing: 16,
    },
    breakpoints: {
      "(min-width: 768px)": {
        slides: {
          perView: 2,
          spacing: 20,
        },
      },
      "(min-width: 1024px)": {
        slides: {
          perView: 4,
          spacing: 24,
        },
      },
    },
  });

  useEffect(() => {
    setItems(api_Data || []);
  }, [api_Data]);

  useEffect(() => {
    if (!loading && instanceRef.current) {
      instanceRef.current.update();
    }
  }, [items, loading, instanceRef]);

  // This keeps the countdown timer current by updating the clock once per second.
  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const handlePrev = () => {
    instanceRef.current?.prev();
  };

  const handleNext = () => {
    instanceRef.current?.next();
  };

  // This converts each item's expiry date into a human-readable countdown string.
  const countdowns = useMemo(() => {
    const formatCountdown = (expiryDate) => {
      if (!expiryDate) return null;

      const remaining = expiryDate - now;
      if (remaining <= 0) return "Expired";

      const totalSeconds = Math.floor(remaining / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      return `${hours}h ${minutes}m ${seconds}s`;
    };

    return items.map((item) => formatCountdown(item.expiryDate));
  }, [items, now]);

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          <div className="col-lg-12 position-relative">
            {!loading && (
              <>
                <button
                  type="button"
                  className="btn btn-light rounded-circle position-absolute top-50 start-0 translate-middle-y z-3 shadow"
                  style={{ width: "46px", height: "46px", marginLeft: "-8px" }}
                  onClick={handlePrev}
                  aria-label="Previous items"
                >
                  <i className="fa fa-chevron-left"></i>
                </button>
                <button
                  type="button"
                  className="btn btn-light rounded-circle position-absolute top-50 end-0 translate-middle-y z-3 shadow"
                  style={{ width: "46px", height: "46px", marginRight: "-8px" }}
                  onClick={handleNext}
                  aria-label="Next items"
                >
                  <i className="fa fa-chevron-right"></i>
                </button>
              </>
            )}

            {loading ? (
              <div className="row g-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={index}>
                    <div className="nft__item">
                      <div className="nft__item_wrap">
                        <Skeleton width="100%" height="220px" borderRadius="10px" />
                      </div>
                      <div className="nft__item_info mt-3">
                        <Skeleton width="70%" height="20px" borderRadius="4px" />
                        <Skeleton width="40%" height="16px" borderRadius="4px" className="mt-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div ref={sliderRef} className="keen-slider">
                {items.map((item, index) => (
                  <div className="keen-slider__slide" key={item.id}>
                    <div className="nft__item">
                      <div className="author_list_pp">
                        <Link
                          to={`/authors/${item.authorId}`}
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title={`Creator: ${item.title}`}
                        >
                          <img className="lazy" src={item.authorImage} alt={item.title} />
                          <i className="fa fa-check"></i>
                        </Link>
                      </div>
                      {countdowns[index] ? (
                        <div className="de_countdown">{countdowns[index]}</div>
                      ) : null}

                      <div className="nft__item_wrap">
                        <div className="nft__item_extra">
                          <div className="nft__item_buttons">
                            <button>Buy Now</button>
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

                        <Link to={`/item-details/${item.nftId}`}>
                          <img
                            src={item.nftImage}
                            className="lazy nft__item_preview"
                            alt={item.title}
                          />
                        </Link>
                      </div>
                      <div className="nft__item_info">
                        <Link to={`/item-details/${item.nftId}`}>
                          <h4>{item.title}</h4>
                        </Link>
                        <div className="nft__item_price">{item.price} ETH</div>
                        <div className="nft__item_like">
                          <i className="fa fa-heart"></i>
                          <span>{item.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewItems;
