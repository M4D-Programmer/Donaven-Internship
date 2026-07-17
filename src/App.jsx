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

const [loading_api, setLoading_api] = useState(true);
  const fetchCollections = async () => {
    try {
      const { HC_data } = await axios.get(
        "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections"
      );
      const { NI_data } = await axios.get(
        "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems"
      );
    } catch (error) {
      console.error("Failed to fetch hot collections", error);
    } finally {
      setLoading_api(false);
    }
    return { HC_data, NI_data };
  };

  const { HC_data, NI_data } =fetchCollections();




  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home HC_data={HC_data} NI_data={NI_data} loading={loading_api} />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/author" element={<Author />} />
        <Route path="/authors" element={<Author />} />
        <Route path="/authors/:authorId" element={<Author />} />
        <Route path="/item-details" element={<ItemDetails />} />
        <Route path="/item-details/:nftId" element={<ItemDetails />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
