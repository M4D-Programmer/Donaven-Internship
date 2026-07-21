import React, { useEffect, useState } from "react";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorItems from "../components/author/AuthorItems";
import { useParams } from "react-router-dom";
import AuthorImage from "../images/author_thumbnail.jpg";
import axios from "axios";
import Skeleton from "../components/UI/Skeleton";

const loadingProfile = {
  authorName: "Loading Author",
  authorImage: AuthorImage,
  tag: "@author",
  address: "0x1234...abcd",
  followers: 777,
};

const Author = () => {
  const { authorId } = useParams();
  const [authorProfile, setAuthorProfile] = useState(loadingProfile);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const buildProfile = (profile = {}) => ({
      ...loadingProfile,
      authorName: profile.authorName || loadingProfile.authorName,
      authorImage: profile.authorImage || loadingProfile.authorImage,
      tag: profile.tag || loadingProfile.tag,
      address: profile.address || loadingProfile.address,
      followers: profile.followers ?? loadingProfile.followers,
    });

    const fetchData = async () => {
      setLoading(true);

      try {
        const authorResponse = await axios.get(
          `https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=${authorId}`
        );

        if (!isMounted) return;

        const authorData = authorResponse.data || {};
        const profile = authorData;
        const items = authorData.nftCollection || [];
        const mappedCollections = items.map((item) => ({
          ...item,
          authorImage: item.authorImage || profile.authorImage || AuthorImage, // This is to Pass the authorImage to the Card component because it's not present in the item data
          authorId: item.authorId || authorId,
        }));

        setAuthorProfile(buildProfile(profile));
        setCollections(mappedCollections);
      } catch (error) {
        console.error("Error fetching author data:", error);
        if (isMounted) {
          setAuthorProfile(loadingProfile);
          setCollections([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (authorId) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [authorId]);

  const profile = authorProfile || loadingProfile;
  const profileName = profile.authorName;
  const profileTag = profile.tag;
  const profileAddress = profile.address;
  const profileFollowers = profile.followers;
  const profileImage = profile.authorImage;

  const [isAdding, setIsAdding] = useState(true);

  const handleFollow = () => {
    if (isAdding) {
      setAuthorProfile((prevProfile) => ({
          ...prevProfile,
          followers: prevProfile.followers + 1,
        }));
        setIsAdding(false);
      }
      else {
        setAuthorProfile((prevProfile) => ({
          ...prevProfile,
          followers: prevProfile.followers - 1,
        }));
        setIsAdding(true);
      };
    };

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section
          id="profile_banner"
          aria-label="section"
          className="text-light"
          data-bgimage="url(images/author_banner.jpg) top"
          style={{ background: `url(${AuthorBanner}) top` }}
        ></section>

        <section aria-label="section">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="d_profile de-flex">
                  <div className="de-flex-col">
                    <div className="profile_avatar">
                      {loading ? (
                        <Skeleton
                          width="150px"
                          height="150px"
                          borderRadius="50%"
                          className="me-3"
                        />
                      ) : (
                        <img src={profileImage} alt={profileName} />
                      )}

                      <i className="fa fa-check"></i>
                      <div className="profile_name">
                        <h4>
                          {profileName}
                          <span className="profile_username">{profileTag}</span>
                          <span id="wallet" className="profile_wallet">
                            {profileAddress}
                          </span>
                          <button id="btn_copy" title="Copy Text">
                            Copy
                          </button>
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className="profile_follow de-flex">
                    <div className="de-flex-col">
                      <div className="profile_follower">{profileFollowers} followers</div>
                      <button onClick={handleFollow} className="btn-main">
                        {isAdding ? 'Follow' : 'Unfollow'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="de_tab tab_simple">
                  <AuthorItems data={collections} loading={loading} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};


export default Author;