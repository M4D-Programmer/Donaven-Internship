import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Explore from "./pages/Explore";
import Author from "./pages/Author";
import ItemDetails from "./pages/ItemDetails";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import axios from "axios";
import React, { useEffect, useState } from "react";

function App() {
  // This shared state stores the homepage data fetched once from both APIs.
  const [loading_api, setLoading_api] = useState(true);
  const [apiData, setApiData] = useState({
    HC_data: [],
    NI_data: [],
  });

  // This effect loads the Hot Collections and New Items data together so every section can reuse the same payload.
  useEffect(() => {
    let isMounted = true;

    const fetchCollections = async () => {
      try {
        const [hotCollectionsResponse, newItemsResponse] = await Promise.all([
          axios.get(
            "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections"
          ),
          axios.get(
            "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems"
          ),
        ]);

        if (isMounted) {
          setApiData({
            HC_data: hotCollectionsResponse.data,
            NI_data: newItemsResponse.data,
          });
        }
      } catch (error) {
        console.error("Failed to fetch homepage data", error);
      } finally {
        if (isMounted) {
          setLoading_api(false);
        }
      }
    };

    fetchCollections();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Router>
      <Nav />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              HC_data={apiData.HC_data}
              NI_data={apiData.NI_data}
              loading={loading_api}
            />
          }
        />
        <Route path="/explore" element={<Explore />} />
        <Route path="/author" element={<Author />} />
        <Route path="/authors" element={<Author />} />
        <Route path="/authors/:authorId" element={<Author />} />
        <Route path="/item-details" element={<ItemDetails items={apiData.NI_data} />} />
        <Route
          path="/item-details/:nftId"
          element={<ItemDetails items={apiData.NI_data} />}
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
