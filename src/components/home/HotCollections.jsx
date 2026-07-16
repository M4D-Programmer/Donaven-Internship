import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import Skeleton from "../UI/Skeleton";

const HotCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handlePrev = () => {
    instanceRef.current?.prev();
  };

  const handleNext = () => {
    instanceRef.current?.next();
  };

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const { data } = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections"
        );
        setCollections(data);
      } catch (error) {
        console.error("Failed to fetch hot collections", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  return (
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Hot Collections</h2>
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
                  aria-label="Previous collections"
                >
                  <i className="fa fa-chevron-left"></i>
                </button>
                <button
                  type="button"
                  className="btn btn-light rounded-circle position-absolute top-50 end-0 translate-middle-y z-3 shadow"
                  style={{ width: "46px", height: "46px", marginRight: "-8px" }}
                  onClick={handleNext}
                  aria-label="Next collections"
                >
                  <i className="fa fa-chevron-right"></i>
                </button>
              </>
            )}

            {loading ? (
              <div className="row g-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={index}>
                    <div className="nft_coll">
                      <div className="nft_wrap">
                        <Skeleton width="100%" height="220px" borderRadius="10px" />
                      </div>
                      <div className="nft_coll_pp mt-3">
                        <Skeleton width="50px" height="50px" borderRadius="50%" />
                      </div>
                      <div className="nft_coll_info mt-3">
                        <Skeleton width="70%" height="20px" borderRadius="4px" />
                        <Skeleton width="40%" height="16px" borderRadius="4px" className="mt-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div ref={sliderRef} className="keen-slider">
                {collections.map((item) => (
                  <div className="keen-slider__slide" key={item.id}>
                    <div className="nft_coll">
                      <div className="nft_wrap">
                        <Link to={`/item-details/${item.nftId}`}>
                          <img
                            src={item.nftImage}
                            className="lazy img-fluid"
                            alt={item.title}
                          />
                        </Link>
                      </div>
                      <div className="nft_coll_pp">
                        <Link to={`/authors/${item.authorId}`}>
                          <img
                            className="lazy pp-coll"
                            src={item.authorImage}
                            alt={item.title}
                          />
                        </Link>
                        <i className="fa fa-check"></i>
                      </div>
                      <div className="nft_coll_info">
                        <Link to={`/item-details/${item.nftId}`}>
                          <h4>{item.title}</h4>
                        </Link>
                        <span>ERC-{item.code}</span>
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

export default HotCollections;
