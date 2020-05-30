import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useParams, Link } from "react-router-dom";
import LoadingIcon from "./LoadingIcon";

function ProfilePosts() {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const { username } = useParams();

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    try {
      async function fetchData() {
        const response = await Axios.get(`/profile/${username}/posts`, {
          CancelToken: ourRequest.token,
        });
        setPosts(response.data);
        setIsLoading(false);
      }
      fetchData();
      return () => {
        ourRequest.cancel();
      };
    } catch (e) {
      console.log("There was some error", e);
    }
  }, []);
  if (isLoading) {
    return <LoadingIcon />;
  } else {
    return (
      <div className="list-group">
        {posts.map((post) => {
          const date = new Date(post.createdDate);
          const formattedDate = `${
            date.getMonth() + 1
          }/${date.getDate()}/${date.getFullYear()}`;
          return (
            <Link
              key={post._id}
              to={`/post/${post._id}`}
              className="list-group-item list-group-item-action"
            >
              <img className="avatar-tiny" src={post.author.avatar} />{" "}
              <strong>{post.title}</strong>{" "}
              <span className="text-muted small">on {formattedDate} </span>
            </Link>
          );
        })}
      </div>
    );
  }
}

export default ProfilePosts;
