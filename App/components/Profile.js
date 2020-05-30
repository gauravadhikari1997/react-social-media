import React, { useEffect, useContext, useState } from "react";
import Page from "./Page";
import { useParams } from "react-router-dom";
import Axios from "axios";
import StateContext from "../StateContext";
import ProfilePosts from "./ProfilePosts";

function Profile() {
  const appState = useContext(StateContext);

  const [profileData, setProfileData] = useState({
    isFollowing: false,
    profileAvatar: "https://gravatar.com/avatar/?s=128",
    profileUsername: "...",
    counts: { followerCount: "", followingCount: "", postCount: "" },
  });

  let { username } = useParams();
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    async function fetchData() {
      try {
        const response = await Axios.post(
          `/profile/${username}`,
          {
            token: appState.user.token,
          },
          {
            CancelToken: ourRequest.token,
          }
        );
        setProfileData(response.data);
        return () => {
          ourRequest.cancel();
        };
      } catch (e) {
        console.log("There was some error", e);
      }
    }
    fetchData();
  }, []);
  return (
    <Page title="Profile Page">
      <h2>
        <img className="avatar-small" src={profileData.profileAvatar} />{" "}
        {profileData.profileUsername}
        <button className="btn btn-primary btn-sm ml-2">
          Follow <i className="fas fa-user-plus"></i>
        </button>
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <a href="#" className="active nav-item nav-link">
          Posts: {profileData.counts.postCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Followers: {profileData.counts.followerCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Following: {profileData.counts.followingCount}
        </a>
      </div>

      <ProfilePosts />
    </Page>
  );
}

export default Profile;
