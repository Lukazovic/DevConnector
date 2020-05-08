import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { connect } from "react-redux";
import { addLike, removeLike, deletePost } from "../../actions/post";

const PostItem = ({
  addLike,
  removeLike,
  deletePost,
  auth,
  post: { _id, text, name, avatar, owner, likes, comments, date },
  showActions,
}) => {
  const handleAddLike = e => {
    addLike(_id);
  };

  const handleRemoveLike = e => {
    removeLike(_id);
  };

  const handleDeletePost = e => {
    deletePost(_id);
  };

  return (
    <div className="post bg-white p-1 my-1">
      <div>
        <Link to={`/profile/${owner}`}>
          <img className="round-img" src={avatar} alt="" />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className="my-1">{text}</p>
        <p className="post-date">
          Posted on <Moment format="YYYY/MM/DD">{date}</Moment>
        </p>
        <button onClick={handleAddLike} type="button" className="btn btn-light">
          <i className="fas fa-thumbs-up" />{" "}
          {likes.length > 0 && <span>{likes.length}</span>}
        </button>
        <button
          onClick={handleRemoveLike}
          type="button"
          className="btn btn-light"
        >
          <i className="fas fa-thumbs-down" />
        </button>
        {showActions && (
          <Fragment>
            <Link to={`/posts/${_id}`} className="btn btn-primary">
              Discussion{" "}
              {comments.length > 0 && (
                <span className="comment-count">{comments.length}</span>
              )}
            </Link>
          </Fragment>
        )}
        {!auth.loading && owner === auth.user._id && (
          <button
            onClick={handleDeletePost}
            type="button"
            className="btn btn-danger"
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
    </div>
  );
};

PostItem.defaultProps = {
  showActions: true,
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(
  PostItem
);
