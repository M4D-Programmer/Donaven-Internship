import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Card from "../UI/Card";
import Skeleton from "../UI/Skeleton";

const formatCountdown = (expiryDate, now) => {
  if (!expiryDate) return null;

  const remaining = expiryDate - now;
  if (remaining <= 0) return "Expired";

  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours}h ${minutes}m ${seconds}s`;
};

const ExploreItems = ({ apiData = [], loading: loadingProp = false }) => {
  const [items, setItems] = useState(apiData || []);
  const [loading, setLoading] = useState(Boolean(loadingProp && !apiData?.length));
  const [visibleCount, setVisibleCount] = useState(8);
  const [sortBy, setSortBy] = useState("");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (Array.isArray(apiData) && apiData.length > 0) {
      setItems(apiData);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchExploreItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore"
        );

        if (isMounted) {
          setItems(response.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch explore items", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchExploreItems();

    return () => {
      isMounted = false;
    };
  }, [apiData]);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (sortBy === "price_low_to_high") {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price_high_to_low") {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "likes_high_to_low") {
      result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }

    return result;
  }, [items, sortBy]);

  const visibleItems = useMemo(() => filteredItems.slice(0, visibleCount), [filteredItems, visibleCount]);
  const hasMoreItems = visibleCount < filteredItems.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 4, filteredItems.length));
  };

  if (loading) {
    return (
      <>
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
            style={{ display: "block", backgroundSize: "cover" }}
          >
            <div className="nft__item">
              <Skeleton width="100%" height="220px" borderRadius="10px" />
              <div className="mt-3">
                <Skeleton width="70%" height="20px" borderRadius="4px" />
                <Skeleton width="40%" height="16px" borderRadius="4px" className="mt-2" />
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      <div className="col-md-12 mb-4 d-flex justify-content-end">
        <select
          id="filter-items"
          className="form-select"
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setVisibleCount(8);
          }}
        >
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>

      {visibleItems.map((item, index) => (
        <div
          key={item.nftId || item.id || index}
          className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
          style={{ display: "block", backgroundSize: "cover" }}
        >
          <Card item={item} countdown={formatCountdown(item.expiryDate, now)} />
        </div>
      ))}

      {filteredItems.length > 0 && (
        <div className="col-md-12 text-center mt-4">
          {hasMoreItems ? (
            <button type="button" id="loadmore" className="btn-main lead" onClick={handleLoadMore}>
              Load more
            </button>
          ) : (
            <p className="text-muted">No more items to show.</p>
          )}
        </div>
      )}

      {!loading && filteredItems.length === 0 && (
        <div className="col-md-12 text-center mt-4">
          <p className="text-muted">No items match the current filter.</p>
        </div>
      )}
    </>
  );
};

export default ExploreItems;
