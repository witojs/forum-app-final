/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { FaReply } from 'react-icons/fa';
import {
  AiOutlineDislike,
  AiOutlineLike,
  AiFillDislike,
  AiFillLike,
} from 'react-icons/ai';
import postedAt from '../utils';
import {
  asyncDownVoteThread,
  asyncNeutralizeVoteThread,
  asyncUpVoteThread,
} from '../states/shared/action';
import NavBarLink from '../styledComponents/NavBarLink';

function ThreadItem({
  category,
  title,
  body,
  createdAt,
  totalComments,
  id,
  user,
  upVotesBy,
  downVotesBy,
  authUser,
}) {
  const dispatch = useDispatch();

  const upVote = () => {
    dispatch(asyncUpVoteThread(id));
  };

  const downVote = () => {
    dispatch(asyncDownVoteThread(id));
  };

  const neutralizeVote = () => {
    dispatch(asyncNeutralizeVoteThread(id));
  };

  return (
    <div className="thread-item" role="button" tabIndex={0}>
      <p className="thread-item__category">#{category}</p>
      <article className="thread-item__info">
        <NavBarLink to={`/threads/${id}`}>
          <h2>{title}</h2>
        </NavBarLink>
        <p>{body}</p>
      </article>
      <div className="thread-item__detail">
        <button
          className="button-vote"
          type="button"
          onClick={
            upVotesBy.includes(authUser || ' ') ? neutralizeVote : upVote
          }
        >
          {upVotesBy.includes(authUser || ' ') ? (
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
            downVotesBy.includes(authUser || ' ') ? neutralizeVote : downVote
          }
        >
          {downVotesBy.includes(authUser || ' ') ? (
            <AiFillDislike className="icon-voted" />
          ) : (
            <AiOutlineDislike className="icon-unvoted" />
          )}
        </button>
        <span>{downVotesBy.length}</span>
        <p>
          <FaReply />
          {totalComments}
        </p>
        <p>{postedAt(createdAt)}</p>
        <span>dibuat oleh:</span>
        <img
          className="thread-item__detail-avatar"
          src={user.avatar}
          alt={user.name}
        />
        <span>
          <strong>{user.name}</strong>
        </span>
      </div>
    </div>
  );
}

export default ThreadItem;

ThreadItem.propTypes = {
  title: PropTypes.string.isRequired,
  authUser: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  totalComments: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  user: PropTypes.objectOf(PropTypes.string).isRequired,
  upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
};
