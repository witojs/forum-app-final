/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  AiOutlineDislike,
  AiOutlineLike,
  AiFillDislike,
  AiFillLike,
} from 'react-icons/ai';
import postedAt from '../utils';
import {
  asyncDownVoteThreadDetail,
  asyncNeutralizeVoteThreadDetail,
  asyncUpVoteThreadDetail,
} from '../states/threadDetail/action';

function ThreadDetail({
  title,
  body,
  category,
  createdAt,
  upVotesBy,
  downVotesBy,
  owner,
  id,
}) {
  const authUser = useSelector((states) => states.authUser);

  const dispatch = useDispatch();

  const upVote = () => {
    dispatch(asyncUpVoteThreadDetail(id));
  };

  const downVote = () => {
    dispatch(asyncDownVoteThreadDetail(id));
  };

  const neutralizeVote = () => {
    dispatch(asyncNeutralizeVoteThreadDetail(id));
  };

  return (
    <div className="thread-detail">
      <p className="thread-item__category">#{category}</p>
      <article className="thread-detail__info">
        <h2>{title}</h2>
        <p>{body}</p>
      </article>
      <div className="thread-detail__detail">
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
        <span>{upVotesBy.length}</span>
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
        <span>{downVotesBy.length}</span>
        <div>
          <span>Dibuat oleh: </span>
          <img src={owner.avatar} alt={owner.name} />
          <span>{owner.name}</span>
        </div>
        <p>{postedAt(createdAt)}</p>
      </div>
    </div>
  );
}

export default ThreadDetail;

ThreadDetail.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  owner: PropTypes.objectOf(PropTypes.string).isRequired,
};
