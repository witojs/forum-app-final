/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable object-curly-newline */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import {
  AiOutlineDislike,
  AiOutlineLike,
  AiFillDislike,
  AiFillLike,
} from 'react-icons/ai';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import postedAt from '../utils';
import {
  asyncDownVoteComment,
  asyncNeutralizeVoteComment,
  asyncUpVoteComment,
} from '../states/threadDetail/action';

function CommentItem({
  id,
  content,
  createdAt,
  upVotesBy,
  downVotesBy,
  owner,
}) {
  const authUser = useSelector((states) => states.authUser);

  const dispatch = useDispatch();

  const upVote = () => {
    dispatch(asyncUpVoteComment(id));
  };

  const downVote = () => {
    dispatch(asyncDownVoteComment(id));
  };

  const neutralizeVote = () => {
    dispatch(asyncNeutralizeVoteComment(id));
  };

  return (
    <div className="comment-item">
      <div className="comment-item__info">
        <div>
          <img src={owner.avatar} alt={owner.name} />
          <span> {owner.name}</span>
        </div>
        <p>{postedAt(createdAt)}</p>
      </div>
      <p className="comment-item__content">{content}</p>
      <footer className="comment-item__vote">
        <button
          className="button-vote"
          type="button"
          onClick={
            upVotesBy.includes(authUser.id || ' ') ? neutralizeVote : upVote
          }
        >
          {upVotesBy.includes(authUser.id || ' ') ? (
            <AiFillLike className="icon-voted" />
          ) : (
            <AiOutlineLike className="icon-unvoted" />
          )}
        </button>
        <p>{upVotesBy.length} </p>
        <button
          className="button-vote"
          type="button"
          onClick={
            downVotesBy.includes(authUser.id || ' ') ? neutralizeVote : downVote
          }
        >
          {downVotesBy.includes(authUser.id || ' ') ? (
            <AiFillDislike className="icon-voted" />
          ) : (
            <AiOutlineDislike className="icon-unvoted" />
          )}
        </button>
        <p> {downVotesBy.length}</p>
      </footer>
    </div>
  );
}

export default CommentItem;

CommentItem.propTypes = {
  id: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  owner: PropTypes.objectOf(PropTypes.string).isRequired,
};
