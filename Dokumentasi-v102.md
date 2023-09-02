# Optimized Forum App

Pada Pembahasan kali ini kita akan menerapkan optimisasi seperti penambahan fitur, eslint, automate testing serta deployment dengan CI/CD.

## Fitur Vote Thread

Kita akan menambahkan fitur vote thread, yakni ketika pengguna menekan tombol vote, maka akan menambahkan upvote, downvote maupun neutralize vote.

### Menambahkan action & reducer vote thread

1. Buka berkas action.js di folder states/threads dan tambahkan action creator vote thread

```js
//threads/action.js
/* eslint-disable object-curly-newline */
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import api from '../../utils/api';

const ActionType = {
  RECEIVE_THREADS: 'RECEIVE_THREADS',
  ADD_THREAD: 'ADD_THREAD',
  UP_VOTE_THREAD: 'UP_VOTE_THREAD',
  DOWN_VOTE_THREAD: 'DOWN_VOTE_THREAD',
  NEUTRALIZE_VOTE_THREAD: 'NEUTRALIZE_VOTE_THREAD',
};

function receiveThreads(threads) {
  return {
    type: ActionType.RECEIVE_THREADS,
    payload: {
      threads,
    },
  };
}

function addThread(thread) {
  return {
    type: ActionType.ADD_THREAD,
    payload: {
      thread,
    },
  };
}

/* action creator vote thread */
function upVoteThread(threadId, userId) {
  return {
    type: ActionType.UP_VOTE_THREAD,
    payload: {
      threadId,
      userId,
    },
  };
}

function downVoteThread(threadId, userId) {
  return {
    type: ActionType.DOWN_VOTE_THREAD,
    payload: {
      threadId,
      userId,
    },
  };
}

function neutralizeVoteThread(threadId, userId) {
  return {
    type: ActionType.NEUTRALIZE_VOTE_THREAD,
    payload: {
      threadId,
      userId,
    },
  };
}

function asyncAddThread({ title, body, category }) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const thread = await api.createThread({ title, body, category });
      dispatch(addThread(thread));
    } catch (error) {
      alert(error.message);
    }
    dispatch(hideLoading());
  };
}

export {
  ActionType,
  receiveThreads,
  addThread,
  asyncAddThread,
  upVoteThread,
  downVoteThread,
  neutralizeVoteThread,
};
```

Pada code di atas, kita menambahkan property ActionType action creator upVoteThread, downVoteThread dan neutralizeVoteThread.

2. Buka berkas reducer.js pada folder states/threads

```js
//threads/reducer.js
import { ActionType } from './action';

function threadsReducer(threads = [], action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_THREADS:
      return action.payload.threads;
    case ActionType.ADD_THREAD:
      return [action.payload.thread, ...threads];

    case ActionType.UP_VOTE_THREAD:
      return threads.map((thread) => {
        if (thread.id === action.payload.threadId) {
          return {
            ...thread,
            downVotesBy: thread.downVotesBy.filter(
              (id) => id !== action.payload.userId
            ),
            upVotesBy: thread.upVotesBy.includes(action.payload.userId)
              ? thread.upVotesBy.filter((id) => id !== action.payload.userId)
              : [...thread.upVotesBy, action.payload.userId],
          };
        }

        return thread;
      });

    case ActionType.DOWN_VOTE_THREAD: {
      return threads.map((thread) => {
        if (thread.id === action.payload.threadId) {
          return {
            ...thread,
            upVotesBy: thread.upVotesBy.filter(
              (id) => id !== action.payload.userId
            ),
            downVotesBy: thread.downVotesBy.includes(action.payload.userId)
              ? thread.downVotesBy.filter((id) => id !== action.payload.userId)
              : [...thread.downVotesBy, action.payload.userId],
          };
        }

        return thread;
      });
    }

    case ActionType.NEUTRALIZE_VOTE_THREAD:
      return threads.map((thread) => {
        if (thread.id === action.payload.threadId) {
          return {
            ...thread,
            upVotesBy: thread.upVotesBy.filter(
              (id) => id !== action.payload.userId
            ),
            downVotesBy: thread.downVotesBy.filter(
              (id) => id !== action.payload.userId
            ),
          };
        }

        return thread;
      });
    default:
      return threads;
  }
}

export default threadsReducer;
```

Pada threadsReducer, kita menambahkan case UP_VOTE_THREAD, DOWN_VOTE_THREAD, NEUTRALIZE_VOTE_THREAD.Ketika action UP_VOTE_THREAD diterima reducer akan mengiterasi data threads dan mencari data threads yang memiliki id yang sama dengan action.payload.threadId, jika telah ditemukan maka semua property thread akan dicopy menggunakan spread operator (...). Kemudian property downVotesBy akan mengeluarkan data vote user menggunakan method filter. Lalu menambahkan data upVotesBy jika belum pernah di vote oleh user sebelumnya dan akan menghilangkan nilai data upVotesBy jika telah di vote oleh user sebelumnya.
ketika reducer menerima action DOWN_VOTE_THREAD maka mekanisme merubah state mirip seperti action UP_VOTE_THREAD. terakhir action NEUTRALIZE_VOTE_THREAD akan menghapus nilai vote dari properti upVotesBy & downVotesBy.

action dan reducer pada threads telah kita perbaharui, kita juga perlu memperbaharui action dan reducer pada threadDetail. Hal ini dikarenakan Selain dapat melakukan vote pada halaman daftar thread, kita juga perlu mengaplikasikannya pada halaman detail thread.

1. Buka berkas action.js pada folder states/threadDetail

```js
//threadDetail/action.js
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import api from '../../utils/api';

const ActionType = {
  RECEIVE_THREAD_DETAIL: 'RECEIVE_THREAD_DETAIL',
  CLEAR_THREAD_DETAIL: 'CLEAR_THREAD_DETAIL',
  COMMENT_THREAD_DETAIL: 'COMMENT_THREAD_DETAIL',
  UP_VOTE_DETAIL_THREAD: 'UP_VOTE_DETAIL_THREAD',
  DOWN_VOTE_DETAIL_THREAD: 'DOWN_VOTE_DETAIL_THREAD',
  NEUTRALIZE_VOTE_DETAIL_THREAD: 'NEUTRALIZE_VOTE_DETAIL_THREAD',
  UP_VOTE_COMMENT: 'UP_VOTE_COMMENT',
  DOWN_VOTE_COMMENT: 'DOWN_VOTE_COMMENT',
  NEUTRALIZE_VOTE_COMMENT: 'NEUTRALIZE_VOTE_COMMENT',
};

function receiveThreadDetail(threadDetail) {
  return {
    type: ActionType.RECEIVE_THREAD_DETAIL,
    payload: {
      threadDetail,
    },
  };
}

function clearThreadDetail() {
  return {
    type: ActionType.CLEAR_THREAD_DETAIL,
  };
}

function addComment(comment) {
  return {
    type: ActionType.COMMENT_THREAD_DETAIL,
    payload: {
      comment,
    },
  };
}

/* vote detail thread */
function upVoteDetailThread(threadId, userId) {
  return {
    type: ActionType.UP_VOTE_DETAIL_THREAD,
    payload: {
      threadId,
      userId,
    },
  };
}

function downVoteDetailThread(threadId, userId) {
  return {
    type: ActionType.DOWN_VOTE_DETAIL_THREAD,
    payload: {
      threadId,
      userId,
    },
  };
}

function neutralizeVoteDetailThread(threadId, userId) {
  return {
    type: ActionType.NEUTRALIZE_VOTE_DETAIL_THREAD,
    payload: {
      threadId,
      userId,
    },
  };
}

/* vote comment */
function upVoteComment(commentId, userId) {
  return {
    type: ActionType.UP_VOTE_COMMENT,
    payload: {
      commentId,
      userId,
    },
  };
}

function downVoteComment(commentId, userId) {
  return {
    type: ActionType.DOWN_VOTE_COMMENT,
    payload: {
      commentId,
      userId,
    },
  };
}

function neutralizeVoteComment(commentId, userId) {
  return {
    type: ActionType.NEUTRALIZE_VOTE_COMMENT,
    payload: {
      commentId,
      userId,
    },
  };
}

function asyncReceiveThreadDetail(threadId) {
  return async (dispatch) => {
    dispatch(showLoading());
    dispatch(clearThreadDetail());
    try {
      const threadDetail = await api.getThreadDetail(threadId);
      dispatch(receiveThreadDetail(threadDetail));
    } catch (error) {
      alert(error.message);
    }
    dispatch(hideLoading());
  };
}

/* adding Comment */
function asyncAddComment({ id, content }) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const comment = await api.createComment({ id, content });
      dispatch(addComment(comment));
    } catch (error) {
      alert(error.message);
    }
    dispatch(hideLoading());
  };
}

export {
  ActionType,
  receiveThreadDetail,
  clearThreadDetail,
  asyncReceiveThreadDetail,
  asyncAddComment,
  addComment,
};
```

Pada code di atas, kita menambahkan ActionType vote thread detail & vote comment, serta action creator vote thread detail dan vote comment.

2. Buka berkas reducer.js pada folder states/threadDetail

```js
//threadDetail/reducer.js
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
          (id) => id !== action.payload.userId
        ),
        upVotesBy: threadDetail.upVotesBy.includes(action.payload.userId)
          ? threadDetail.upVotesBy.filter((id) => id !== action.payload.userId)
          : [...threadDetail.upVotesBy, action.payload.userId],
      };

    case ActionType.DOWN_VOTE_DETAIL_THREAD:
      return {
        ...threadDetail,
        upVotesBy: threadDetail.upVotesBy.filter(
          (id) => id !== action.payload.userId
        ),
        downVotesBy: threadDetail.downVotesBy.includes(action.payload.userId)
          ? threadDetail.downVotesBy.filter(
              (id) => id !== action.payload.userId
            )
          : [...threadDetail.downVotesBy, action.payload.userId],
      };

    case ActionType.NEUTRALIZE_VOTE_DETAIL_THREAD:
      return {
        ...threadDetail,
        upVotesBy: threadDetail.upVotesBy.filter(
          (id) => id !== action.payload.userId
        ),
        downVotesBy: threadDetail.downVotesBy.filter(
          (id) => id !== action.payload.userId
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
                      (id) => id !== action.payload.userId
                    ),
                  ]
                : [...comment.upVotesBy, action.payload.userId],
              downVotesBy: comment.downVotesBy.filter(
                (id) => id !== action.payload.userId
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
                (id) => id !== action.payload.userId
              ),
              downVotesBy: comment.downVotesBy.includes(action.payload.userId)
                ? [
                    ...comment.downVotesBy.filter(
                      (id) => id !== action.payload.userId
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
                (id) => id !== action.payload.userId
              ),
              downVotesBy: comment.downVotesBy.filter(
                (id) => id !== action.payload.userId
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
```

sebagai catatan userId yang dimaksud yakni mengacu pada authUser.id.

### Menambahkan fungsi thunk vote thread & comment

1. Buka berkas action.js pada folder states/shared

```js
//states/shared/action.js
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import api from '../../utils/api';
import {
  downVoteThread,
  neutralizeVoteThread,
  receiveThreads,
  upVoteThread,
} from '../threads/action';
import { receiveUsers } from '../users/action';

function asyncPopulateUsersAndThreads() {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const users = await api.getAllUsers();
      const threads = await api.getAllThreads();

      dispatch(receiveUsers(users));
      dispatch(receiveThreads(threads));
    } catch (error) {
      alert(error.message);
    }
    dispatch(hideLoading());
  };
}

/* fungsi thunk vote thread & thread detail */
function asyncUpVoteThread(threadId) {
  return async (dispatch, getState) => {
    dispatch(showLoading());
    const { authUser } = getState();

    dispatch(upVoteThread(threadId, authUser.id));

    try {
      await api.upVoteThread(threadId);
    } catch (message) {
      dispatch(upVoteThread(threadId, authUser.id));
    }

    dispatch(hideLoading());
  };
}

function asyncDownVoteThread(threadId) {
  return async (dispatch, getState) => {
    dispatch(showLoading());
    const { authUser } = getState();

    dispatch(downVoteThread(threadId, authUser.id));

    try {
      await api.downVoteThread(threadId);
    } catch (message) {
      dispatch(downVoteThread(threadId, authUser.id));
    }

    dispatch(hideLoading());
  };
}

function asyncNeutralizeVoteThread(threadId) {
  return async (dispatch, getState) => {
    dispatch(showLoading());
    const { authUser } = getState();

    dispatch(neutralizeVoteThread(threadId, authUser.id));

    try {
      await api.neutralizeVoteThread(threadId);
    } catch (message) {
      dispatch(neutralizeVoteThread(threadId, authUser.id));
    }

    dispatch(hideLoading());
  };
}

export {
  asyncPopulateUsersAndThreads,
  asyncUpVoteThread,
  asyncDownVoteThread,
  asyncNeutralizeVoteThread,
};
```

Note perhatikan import fungsi thunk asyncPopulateUsersAndThreads pada homepage dikarenakan export sudah bukan menggunakan default export melainkan named export.

2. Buka berkas action.js pada folder states/threadDetail, kita akan menambahkan juga fungsi thunk vote comment dan vote thread detail

```js
//threadDetail/action.js
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import api from '../../utils/api';

const ActionType = {
  RECEIVE_THREAD_DETAIL: 'RECEIVE_THREAD_DETAIL',
  CLEAR_THREAD_DETAIL: 'CLEAR_THREAD_DETAIL',
  COMMENT_THREAD_DETAIL: 'COMMENT_THREAD_DETAIL',
  UP_VOTE_DETAIL_THREAD: 'UP_VOTE_DETAIL_THREAD',
  DOWN_VOTE_DETAIL_THREAD: 'DOWN_VOTE_DETAIL_THREAD',
  NEUTRALIZE_VOTE_DETAIL_THREAD: 'NEUTRALIZE_VOTE_DETAIL_THREAD',
  UP_VOTE_COMMENT: 'UP_VOTE_COMMENT',
  DOWN_VOTE_COMMENT: 'DOWN_VOTE_COMMENT',
  NEUTRALIZE_VOTE_COMMENT: 'NEUTRALIZE_VOTE_COMMENT',
};

function receiveThreadDetail(threadDetail) {
  return {
    type: ActionType.RECEIVE_THREAD_DETAIL,
    payload: {
      threadDetail,
    },
  };
}

function clearThreadDetail() {
  return {
    type: ActionType.CLEAR_THREAD_DETAIL,
  };
}

function addComment(comment) {
  return {
    type: ActionType.COMMENT_THREAD_DETAIL,
    payload: {
      comment,
    },
  };
}

/* vote detail thread */
function upVoteDetailThread(threadId, userId) {
  return {
    type: ActionType.UP_VOTE_DETAIL_THREAD,
    payload: {
      threadId,
      userId,
    },
  };
}

function downVoteDetailThread(threadId, userId) {
  return {
    type: ActionType.DOWN_VOTE_DETAIL_THREAD,
    payload: {
      threadId,
      userId,
    },
  };
}

function neutralizeVoteDetailThread(threadId, userId) {
  return {
    type: ActionType.NEUTRALIZE_VOTE_DETAIL_THREAD,
    payload: {
      threadId,
      userId,
    },
  };
}

/* vote comment */
function upVoteComment(commentId, userId) {
  return {
    type: ActionType.UP_VOTE_COMMENT,
    payload: {
      commentId,
      userId,
    },
  };
}

function downVoteComment(commentId, userId) {
  return {
    type: ActionType.DOWN_VOTE_COMMENT,
    payload: {
      commentId,
      userId,
    },
  };
}

function neutralizeVoteComment(commentId, userId) {
  return {
    type: ActionType.NEUTRALIZE_VOTE_COMMENT,
    payload: {
      commentId,
      userId,
    },
  };
}

function asyncReceiveThreadDetail(threadId) {
  return async (dispatch) => {
    dispatch(showLoading());
    dispatch(clearThreadDetail());
    try {
      const threadDetail = await api.getThreadDetail(threadId);
      dispatch(receiveThreadDetail(threadDetail));
    } catch (error) {
      alert(error.message);
    }
    dispatch(hideLoading());
  };
}

/* adding Comment */
function asyncAddComment({ id, content }) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const comment = await api.createComment({ id, content });
      dispatch(addComment(comment));
    } catch (error) {
      alert(error.message);
    }
    dispatch(hideLoading());
  };
}

/* fungsi thunk vote thread & thread detail */
function asyncUpVoteThreadDetail(threadId) {
  return async (dispatch, getState) => {
    dispatch(showLoading());
    const { authUser } = getState();

    dispatch(upVoteDetailThread(threadId, authUser.id));

    try {
      await api.upVoteThread(threadId);
    } catch (message) {
      dispatch(upVoteDetailThread(threadId, authUser.id));
    }

    dispatch(hideLoading());
  };
}

function asyncDownVoteThreadDetail(threadId) {
  return async (dispatch, getState) => {
    dispatch(showLoading());
    const { authUser } = getState();

    dispatch(downVoteDetailThread(threadId, authUser.id));

    try {
      await api.downVoteThread(threadId);
    } catch (message) {
      dispatch(downVoteDetailThread(threadId, authUser.id));
    }

    dispatch(hideLoading());
  };
}

function asyncNeutralizeVoteThreadDetail(threadId) {
  return async (dispatch, getState) => {
    dispatch(showLoading());
    const { authUser } = getState();

    dispatch(neutralizeVoteDetailThread(threadId, authUser.id));

    try {
      await api.neutralizeVoteThread(threadId);
    } catch (message) {
      dispatch(neutralizeVoteDetailThread(threadId, authUser.id));
    }

    dispatch(hideLoading());
  };
}

/* vote comment */
function asyncUpVoteComment(commentId) {
  return async (dispatch, getState) => {
    dispatch(showLoading());
    const { authUser, threadDetail } = getState();
    dispatch(upVoteComment(commentId, authUser.id));

    try {
      await api.upVoteComment(threadDetail.id, commentId);
    } catch (message) {
      dispatch(upVoteComment(commentId, authUser.id));
    }

    dispatch(hideLoading());
  };
}

function asyncDownVoteComment(commentId) {
  return async (dispatch, getState) => {
    dispatch(showLoading());
    const { authUser, threadDetail } = getState();
    dispatch(downVoteComment(commentId, authUser.id));

    try {
      await api.downVoteComment(threadDetail.id, commentId);
    } catch (message) {
      dispatch(downVoteComment(commentId, authUser.id));
    }

    dispatch(hideLoading());
  };
}

function asyncNeutralizeVoteComment(commentId) {
  return async (dispatch, getState) => {
    dispatch(showLoading());
    const { authUser, threadDetail } = getState();
    dispatch(neutralizeVoteComment(commentId, authUser.id));

    try {
      await api.neutralizeVoteComment(threadDetail.id, commentId);
    } catch (message) {
      dispatch(neutralizeVoteComment(commentId, authUser.id));
    }

    dispatch(hideLoading());
  };
}

export {
  ActionType,
  receiveThreadDetail,
  clearThreadDetail,
  asyncReceiveThreadDetail,
  asyncAddComment,
  addComment,
  upVoteDetailThread,
  downVoteDetailThread,
  neutralizeVoteDetailThread,
  upVoteComment,
  downVoteComment,
  neutralizeVoteComment,
  asyncUpVoteComment,
  asyncDownVoteComment,
  asyncNeutralizeVoteComment,
  asyncUpVoteThreadDetail,
  asyncDownVoteThreadDetail,
  asyncNeutralizeVoteThreadDetail,
};
```

### Komponen CommentItem - Menambahkan fungsionalitas vote

Setelah menambahkan action creator vote, fungsi thunk dan memperbaharui threadDetail reducer, kita akan memperbaharui komponen CommentItem agar fungsionalitas vote dapat diterapkan.

1. Buka berkas CommentItem.jsx pada folder components

```js
//components/CommentItem.jsx
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
            <AiOutlineLike />
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
            <AiOutlineDislike />
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
```

Pada code di atas, kita mengambil data authUser, data ini akan kita gunakan untuk memastikan apakah kita melakukan interaksi vote atau tidak. Kita juga menambahkan props id pada komponen.
fungsi upVote, downVote dan neutralizeVote juga ditambahkan, masing-masing fungsi ini akan men-dispatch thunk function berdasarkan argumen id.
Kita juga memperbaharui tombol upvote dan downvote dan memberikan styling warna pada fill icon.

### Komponen ThreadItem - Menambahkan fungsionalitas vote

Komponen ThreadItem pada src/components juga akan kita perbaharui seperti berikut:

```js
//components/ThreadItem.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
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
  /* const navigate = useNavigate(); */
  const dispatch = useDispatch();

  /* const onThreadClick = () => {
    navigate(`/threads/${id}`);
  };

  const onThreadPress = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      navigate(`/threads/${id}`);
    }
  }; */

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
    <div
      className="thread-item"
      role="button"
      tabIndex={0}
      /* onClick={onThreadClick}
      onKeyDown={onThreadPress} */
    >
      <p className="thread-item__category">#{category}</p>
      <article className="thread-item__info">
        <Link to={`/threads/${id}`} style={{ textDecoration: 'none' }}>
          <h2>{title}</h2>
        </Link>
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
            <AiOutlineLike />
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
            <AiOutlineDislike />
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
```

### Komponen ThreadDetail - Menambahkan fungsionalitas vote

Komponen ThreadDetail pada src/components kita perbaharui seperti berikut:

```js
//components/ThreadDetail.jsx
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
            <AiOutlineLike />
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
            <AiOutlineDislike />
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
```

fungsi masing-masing vote kita deklarasikan pada komponen untuk menghindari props driling terutama untuk fungsi vote itu sendiri.

Jalankan aplikasi menggunakan npm run dev dan pastikan aplikasi dapat berjalan dengan baik.

--> Membuat styled Component, dan buat branch baru untuk upload ke repository

referensi styling Link Component with Styled Component.
