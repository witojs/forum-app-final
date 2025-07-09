/* eslint-disable comma-dangle */
/* eslint-disable indent */
import { ActionType } from './action';

function threadDetailReducer(threadDetail = null, action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_THREAD_DETAIL:
      return action.payload.threadDetail;
    case ActionType.CLEAR_THREAD_DETAIL:
      return null;
    case ActionType.COMMENT_THREAD_DETAIL:
      return {
        ...threadDetail,
        comments: [action.payload.comment, ...threadDetail.comments],
      };

    case ActionType.UP_VOTE_DETAIL_THREAD:
      return {
        ...threadDetail,
        downVotesBy: threadDetail.downVotesBy.filter(
          (id) => id !== action.payload.userId,
        ),
        upVotesBy: threadDetail.upVotesBy.includes(action.payload.userId)
          ? threadDetail.upVotesBy.filter((id) => id !== action.payload.userId)
          : [...threadDetail.upVotesBy, action.payload.userId],
      };

    case ActionType.DOWN_VOTE_DETAIL_THREAD:
      return {
        ...threadDetail,
        upVotesBy: threadDetail.upVotesBy.filter(
          (id) => id !== action.payload.userId,
        ),
        downVotesBy: threadDetail.downVotesBy.includes(action.payload.userId)
          ? threadDetail.downVotesBy.filter(
            (id) => id !== action.payload.userId,
          )
          : [...threadDetail.downVotesBy, action.payload.userId],
      };

    case ActionType.NEUTRALIZE_VOTE_DETAIL_THREAD:
      return {
        ...threadDetail,
        upVotesBy: threadDetail.upVotesBy.filter(
          (id) => id !== action.payload.userId,
        ),
        downVotesBy: threadDetail.downVotesBy.filter(
          (id) => id !== action.payload.userId,
        ),
      };

    case ActionType.UP_VOTE_COMMENT:
      return {
        ...threadDetail,
        comments: threadDetail.comments.map((comment) => {
          if (comment.id === action.payload.commentId) {
            return {
              ...comment,
              upVotesBy: comment.upVotesBy.includes(action.payload.userId)
                ? [
                  ...comment.upVotesBy.filter(
                    (id) => id !== action.payload.userId,
                  ),
                ]
                : [...comment.upVotesBy, action.payload.userId],
              downVotesBy: comment.downVotesBy.filter(
                (id) => id !== action.payload.userId,
              ),
            };
          }

          return comment;
        }),
      };

    case ActionType.DOWN_VOTE_COMMENT:
      return {
        ...threadDetail,
        comments: threadDetail.comments.map((comment) => {
          if (comment.id === action.payload.commentId) {
            return {
              ...comment,
              upVotesBy: comment.upVotesBy.filter(
                (id) => id !== action.payload.userId,
              ),
              downVotesBy: comment.downVotesBy.includes(action.payload.userId)
                ? [
                  ...comment.downVotesBy.filter(
                    (id) => id !== action.payload.userId,
                  ),
                ]
                : [...comment.downVotesBy, action.payload.userId],
            };
          }

          return comment;
        }),
      };

    case ActionType.NEUTRALIZE_VOTE_COMMENT:
      return {
        ...threadDetail,
        comments: threadDetail.comments.map((comment) => {
          if (comment.id === action.payload.commentId) {
            return {
              ...comment,
              upVotesBy: comment.upVotesBy.filter(
                (id) => id !== action.payload.userId,
              ),
              downVotesBy: comment.downVotesBy.filter(
                (id) => id !== action.payload.userId,
              ),
            };
          }

          return comment;
        }),
      };
    default:
      return threadDetail;
  }
}

export default threadDetailReducer;
