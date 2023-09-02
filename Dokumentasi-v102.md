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

## Mengaplikasikan ES lint

linter merupakan tool yang dapat membantu kita untuk menerapkan clean code pada code serta meminimalisir potensi bug. Kita akan memasangnya pada project.

1. install ESlint dengan menggunakan command:

```
npm install eslint --save-dev
```

2. Jalankan configurasi awal dengan command:

```
npx eslint --init
```

Setelahnya akan muncul konfigurasi seperti berikut:

- How would you like to use ESLint? → To check syntax, find problems, and enforce code style
- What type of modules does your project use? → JavaScript modules (import/export)
- Which framework does your project use? → React
- Does your project use TypeScript? → No
- Where does your code run? → Browser, Node
- How would you like to define a style for your project? → use a popular style guide
- Which style guide do you want to follow? → Airbnb (atau pilih style yang Anda inginkan)
- What format do you want your config file to be in? → JSON
- (List of react eslint plugins) install them now? → Yes
- Which package manager do you want to use? (pilih yang Anda gunakan).

3. Untuk mengaudit code kita dapat menggunakan command:

```
npx eslint ./src --ext .jsx --ext .js
```

Kita juga dapat membuat shortcut dengan menambahkan script pada package.json

```json
{
  …
  "scripts": {
    …,
    "lint": "eslint ./src --ext .jsx --ext .js"
  },
  …
}
```

Sehingga ketika menjalankan eslint kita dapat menuliskan npm run lint pada command terminal.
Kita juga dapat menonaktifkan rules di berkas .eslintrc.json dengan menulis seperti berikut:

```json
{
  /* konfigurasi lainnya.. */
  "rules": {
    "linebreak-style": "off",
    "no-alert": "off",
    "no-underscore-dangle": "off",
    "import/prefer-default-export": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/jsx-props-no-spreading": "off",
    "object-curly-newline": "off"
  }
}
```

## Automate testing

Pada bagian ini kita akan menerapkan automate testing pada fungsi reducer, fungsi thunk, menguji komponen react serta melakukan E2E test.

### Menerapkan automate testing untuk fungsi reducer

1. Install vitest menggunakan command berikut:

```
npm install vitest --save-dev
```

kemudian tambahkan command pada package.json

```json
"scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint ./src --ext .jsx --ext .js",
    "test": "vitest",
  },
```

2. buat berkas pengujian dengan nama reducer.test.js pada folder states/threads

```js
//states/threads/reducer.test.js
/* eslint-disable import/no-extraneous-dependencies */
import { describe, it, expect } from 'vitest';
import threadsReducer from './reducer';

/**
 * test scenario for threadsReducer
 *
 *  - threadsReducer function
 *  - should return the initial state when given by unknown action
 *  - should return the threads when given by RECEIVE_THREADS action
 *  - should return the threads with new thread when given by ADD_THREAD action
 *
 */

describe('threadsReducer function', () => {
  it('should return the initial state when given by unknown action', () => {
    /* arrange */
    const initialState = [];
    const action = { type: 'UNKNOWN' };

    /* action */
    const nextState = threadsReducer(initialState, action);

    /* assert */
    expect(nextState).toEqual(initialState);
  });

  it('should return the threads when given by RECEIVE_THREADS action', () => {
    /* arrange */
    const initialState = [];
    const action = {
      type: 'RECEIVE_THREADS',
      payload: {
        threads: [
          {
            id: 'thread-1',
            title: 'Thread Pertama',
            body: 'Ini adalah thread pertama',
            category: 'General',
            createdAt: '2021-06-21T07:00:00.000Z',
            ownerId: 'users-1',
            upVotesBy: [],
            downVotesBy: [],
            totalComments: 0,
          },
          {
            id: 'thread-2',
            title: 'Thread Kedua',
            body: 'Ini adalah thread kedua',
            category: 'General',
            createdAt: '2021-06-21T07:00:00.000Z',
            ownerId: 'users-2',
            upVotesBy: [],
            downVotesBy: [],
            totalComments: 0,
          },
        ],
      },
    };

    /* action */
    const nextState = threadsReducer(initialState, action);

    /* assert */
    expect(nextState).toEqual(action.payload.threads);
  });

  it('should return the threads with new thread when given by ADD_THREAD action', () => {
    /* arrange */
    const initialState = [
      {
        id: 'thread-1',
        title: 'Thread Pertama',
        body: 'Ini adalah thread pertama',
        category: 'General',
        createdAt: '2021-06-21T07:00:00.000Z',
        ownerId: 'users-1',
        upVotesBy: [],
        downVotesBy: [],
        totalComments: 0,
      },
    ];

    const action = {
      type: 'ADD_THREAD',
      payload: {
        thread: {
          id: 'thread-2',
          title: 'Thread Kedua',
          body: 'Ini adalah thread kedua',
          category: 'General',
          createdAt: '2021-06-21T07:00:00.000Z',
          ownerId: 'users-2',
          upVotesBy: [],
          downVotesBy: [],
          totalComments: 0,
        },
      },
    };
    /* action */
    const nextState = threadsReducer(initialState, action);
    /* assert */
    expect(nextState).toEqual([action.payload.thread, ...initialState]);
  });
});
```

Pada code di atas, kita menerapkan pengujian pada masing-masing action yang diberikan ke threadsReducer. Kita melakukan pengujian dengan menggunakan langkah arrange, action dan assert.
pada bagian arrange kita mempersiapkan variabel initialState dan action, kemudian pada bagian action kita memanggil fungsi reducer dengan argumen initialState dan action yang kita persiapkan sebelumnya. Terakhir, pada bagian assert kita mencocokan nilai dari threadReducer dengan nilai yang diharapkan pada fungsi reducer tersebut.
Silahkan lakukan pengujian untuk fungsi reducer lainnya pada folder /src/states.

## Menerapkan automate testing untuk fungsi thunk

Kita akan menguji fungsi thunk, seperti yang kita ketahui bahwa fungsi thunk akan memanggil fungsi helper yang berinteraksi dengan API. Pada pengujian ini kita akan menggunakan mock data/ test double sebagai pengganti respon dari API.

1. Install jsdom menggunakan command berikut:

```
npm install jsdom --save-dev
```

Jsdom adalah sebuah library JavaScript yang memungkikan penggunaan objek DOM di lingkungan Node.js. Dengan menggunakan jsdom, pengembang dapat berinteraksi dengan object global yang ada di browser secara programatik. Library ini biasanya digunakan untuk pengujian aplikasi web di lingkungan Node.js tanpa harus bergantung pada browser secara langsung.

2. Buka berkas vite.config.js dan tambahkan test.environment seperti berikut:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
});
```

3. Buat berkas dengan nama action.test.js pada folder src/states/threads

```js
//states/threads/action.test.js
import { afterEach, beforeEach, describe, vi, it, expect } from 'vitest';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import api from '../../utils/api';
import { addThread, asyncAddThread } from './action';

/**
 * skenario test
 *
 * - asyncAddThread thunk
 * - should dispatch action correctly when data fetching success
 * - should dispatch action and call alert correctly when data fetching failed
 */

const fakeAddThreadResponse = {
  id: 'thread-1',
  title: 'Thread Pertama',
  body: 'Ini adalah thread pertama',
  category: 'General',
  createdAt: '2021-06-21T07:00:00.000Z',
  ownerId: 'users-1',
  upVotesBy: [],
  downVotesBy: [],
  totalComments: 0,
};

const title = 'Thread Pertama';
const body = 'Ini adalah thread pertama';
const category = 'General';

const fakeErrorResponse = new Error('Ups, something went wrong');

describe('asyncAddThread thunk', () => {
  beforeEach(() => {
    api._createThread = api.createThread;
  });

  afterEach(() => {
    api.createThread = api._createThread;
  });

  delete api._createThread;

  it('should dispatch action correctly when data fetching success', async () => {
    /* arrange */
    /* stub implementation */
    api.createThread = () => Promise.resolve(fakeAddThreadResponse);
    /* mock dispatch */
    const dispatch = vi.fn();

    /* action */
    await asyncAddThread({ title, body, category })(dispatch);

    /* assert */
    expect(dispatch).toHaveBeenCalledWith(showLoading());
    expect(dispatch).toHaveBeenCalledWith(addThread(fakeAddThreadResponse));
    expect(dispatch).toHaveBeenCalledWith(hideLoading());
  });

  it('should dispatch action and call alert correctly when data fetching failed', async () => {
    /* arrange */
    /* stub implementation */
    api.createThread = () => Promise.reject(fakeErrorResponse);
    /* mock dispatch */
    const dispatch = vi.fn();
    /* mock alert */
    window.alert = vi.fn();

    /* action */
    await asyncAddThread({ title, body, category })(dispatch);

    /* assert */
    expect(dispatch).toHaveBeenCalledWith(showLoading());
    expect(dispatch).toHaveBeenCalledWith(hideLoading());
    expect(window.alert).toHaveBeenCalledWith(fakeErrorResponse.message);
  });
});
```

Pada code di atas, kita melakukan stub implementation terhadap fungsi api.createThread agar mendapatkan hasil yang terprediksi. Kita juga menggunakan mock untuk fungsi dispatch menggunakan fungsi vi.fn().
Silahkan melakukan pengujian untuk berkas lainnya di folder src/states.

Jalankan pengujian menggunakan command npm run test dan pastikan test berhasil.

## Melakukan pengujian pada React Komponen

Kita akan menguji react komponen menggunakan react testing library. Note untuk jest-dom kita akan menginstall versi "@testing-library/jest-dom": "^5.16.5", dikarenakan versi terbaru terdapat perubahan dalam mengambil matchers pada jest-dom.

1. Install React Testing library dengan command berikut:

```
npm install @testing-library/react @testing-library/user-event @testing-library/jest-dom --save-dev
```

2. Buat berkas baru dengan nama LoginInput.test.jsx pada folder src/components

```js
/* eslint-disable object-curly-newline */
/**
 * skenario testing
 *
 * - LoginInput component
 *   - should handle email typing correctly
 *   - should handle password typing correctly
 *   - should call login function when login button is clicked
 */

import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import matchers from '@testing-library/jest-dom/matchers';
import LoginInput from './LoginInput';

expect.extend(matchers);

describe('LoginInput Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should handle email typing correctly', async () => {
    /* arrange */
    render(<LoginInput login={() => {}} />);
    const emailInput = await screen.getByPlaceholderText('Email');

    /* action */
    await userEvent.type(emailInput, 'emailtest');

    /* assert */
    expect(emailInput).toHaveValue('emailtest');
  });

  it('should handle password typing correctly', async () => {
    /* arrange */
    render(<LoginInput login={() => {}} />);
    const passwordInput = await screen.getByPlaceholderText('Password');

    /* action */
    await userEvent.type(passwordInput, 'passwordtest');

    /* assert */
    expect(passwordInput).toHaveValue('passwordtest');
  });

  it('should call login function when login button is clicked', async () => {
    /* arrange */
    const mockLogin = vi.fn();
    render(<LoginInput login={mockLogin} />);

    const emailInput = await screen.getByPlaceholderText('Email');
    await userEvent.type(emailInput, 'emailtest');
    const passwordInput = await screen.getByPlaceholderText('Password');
    await userEvent.type(passwordInput, 'passwordtest');
    const loginButton = await screen.getByRole('button', { name: 'Login' });

    /* action */
    await userEvent.click(loginButton);

    /* assert */
    expect(mockLogin).toBeCalledWith({
      email: 'emailtest',
      password: 'passwordtest',
    });
  });
});
```

fungsi render() di atas mirip seperti penggunaan render pada react-dom. Pada awal body fungsi describe kita memanggil fungsi hook afterEach disertai dengan pemanggilan fungsi cleanup. Hal ini untuk memastikan semua komponen dibersihkan terlebih setiap sebuah pengujian dilakukan.
Pada bagian arrange, kita melakukan render terhadap komponen LoginInput. Kemudian kita mengambil elemen input email menggunakan fungsi screen.getByPlaceholderText('Email').
setelah mendapatkan elemen input, pada bagian action kemudian kita melakukan userEvent dengan mengetik email menggunakan fungsi await userEvent.type(emailInput, 'emailtest'). Terakhir pada bagian assert kita mencocokan emailInput untuk mempunyai value yang sama dengan email yang kita masukan pada fungsi userEvent.type(). method .toHaveValue sendiri tidak terdapat pada expect pada vitest, sehingga kita melakukan extends matchers dari react testing library jest-dom.

## Menerapkan E2E test menggunakan Cypress

### Melakukan konfigurasi Cypress

1. Install Cypress menggunakan command berikut:

```
npm install cypress --save-dev
```

2. Install juga ESLint plugin Cypress dengan command berikut:

```
npm install eslint-plugin-cypress --save-dev
```

3. Buka berkas .eslintrc.json dan tambahkan cypress pada konfigurasi plugins

```json
"plugins": ["react", "react-hooks", "cypress"],
```

4. Masih dalam berkas konfigurasi ESLint, tambahkan juga cypress/globals: true pada konfigurasi env.

```json
  "env": {
    "browser": true,
    "es2021": true,
    "node": true,
    "cypress/globals": true
  },
```

5. Jalankan cypress menggunakan command:

```
npx cypress open
```

6. konfigurasi cypress akan muncul, pilih E2E testing, lalu pilih continue
7. Setelah konfigurasi selesai, pilih jenis browser untuk menjalankan E2E testing
8. Cypress akan membuka browser dan menampilkan dashboard pengujian E2E
9. Buat pengujian baru dengan memilih opsi create new empty spec dan ubah nama berkas menjadi login.cy.js
10. Pada folder project akan muncul folder baru dengan nama cypress serta cypress.config.js. Kita akan men-disable fitur video pada cypress.
11. pada berkas cypress.config.js tambahkan properti video:false seperti berikut:

```js
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  video: false,
});
```

12. buat npm runner script untuk cypress pada berkas package.json

```json
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint ./src --ext .jsx --ext .js",
    "test": "vitest",
    "e2e": "cypress run",
  },
```

### Melakukan Pengujian proses login dengan cypress

1. Buka berkas cypress/e2e/login.cy.js, hapus seluruh code dan tuliskan code berikut:

```js
//cypress/e2e/login.cy.js
/**
 * - Login spec
 *   - should display login page correctly
 *   - should display alert when email is empty
 *   - should display alert when password is empty
 *   - should display alert when email and password are wrong
 *   - should display homepage when email and password are correct
 */
describe('Login Spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/');
  });
  it('should display login page correctly', () => {
    cy.get('input[placeholder="Email"]').should('be.visible');
    cy.get('input[placeholder="Password"]').should('be.visible');
    cy.get('button')
      .contains(/^Login$/)
      .should('be.visible');
  });

  it('should display alert when email is empty', () => {
    // klik tombol login tanpa mengisi username
    cy.get('button')
      .contains(/^Login$/)
      .click();

    // memverifikasi window.alert untuk menampilkan pesan dari API
    cy.on('window:alert', (str) => {
      expect(str).to.equal('"email" is not allowed to be empty');
    });
  });

  it('should display alert when password is empty', () => {
    // mengisi username
    cy.get('input[placeholder="Email"]').type('wito@dicoding.com');

    // klik tombol login tanpa mengisi password
    cy.get('button')
      .contains(/^Login$/)
      .click();

    // memverifikasi window.alert untuk menampilkan pesan dari API
    cy.on('window:alert', (str) => {
      expect(str).to.equal('"password" is not allowed to be empty');
    });
  });

  it('should display alert when email and password are wrong', () => {
    // mengisi email
    cy.get('input[placeholder="Email"]').type('wito@dicoding.com');

    // mengisi password yang salah
    cy.get('input[placeholder="Password"]').type('wrong_password');

    // menekan tombol Login
    cy.get('button')
      .contains(/^Login$/)
      .click();

    // memverifikasi window.alert untuk menampilkan pesan dari API
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Email or password is wrong');
    });
  });

  it('should display homepage when email and password are correct', () => {
    // mengisi username
    cy.get('input[placeholder="Email"]').type('wito@dicoding.com');

    // mengisi password
    cy.get('input[placeholder="Password"]').type('123456');

    // menekan tombol Login
    cy.get('button')
      .contains(/^Login$/)
      .click();

    // memverifikasi bahwa elemen yang berada di homepage ditampilkan
    cy.get('nav')
      .contains(/^Threads$/)
      .should('be.visible');
    cy.get('button').contains('Sign out').should('be.visible');
  });
});
```

2. jalankan pengujian menggunakan command npm run e2e dan pastikan test berjalan dengan baik.

## CI/CD menggunakan github Action & vercel

Pembuatan aplikasi dan automate testing aplikasi telah kita lakukan, selanjutnya kita akan mendeploy aplikasi melalui vercel dengan terlebih dahulu menerapkan continuos integration melalui github Action.
Berikut Rincian dari alur CI/CD tanpa tahapan review.

1. Menghubungkan proyek ke Git provider, seperti GitHub atau Gitlab.
2. Membuat konfigurasi continuous integration pada repository.
3. Melakukan perubahan pada kode.
4. Commit dan push ke version control.
5. Tool CI akan otomatis menjalankan build (jika dibutuhkan), unit testing, integration testing, dan end-to-end testing.
6. Jika hasil testing berhasil, tahapan selanjutnya adalah proses deployment.

## CI menggunakan github Actions

### Memasang Git pada komputer

1. Unduh git melalui halaman berikut: https://git-scm.com/downloads
2. untuk memastikan git telah terpasang tuliskan command berikut pada terminal CMD

```
git -v
```

3. Untuk menetapkan nama dan email di Git, jalankan perintah berikut pada PowerShell/CMD/Terminal.

```
git config --global user.name "Your Name"

git config --global user.email "you@example.com"
```

### Membuat Local Repository

1. Pada project inisialisasi git repository menggunakan command:

```
git init
```

2. Masukan seluruh source code kecuali yang terdapat pada daftar.gitignore dengan perintah berikut:

```
git add .
```

Tanda titik setelah add berarti mencakup semua file dan folder pada project.

3. lakukan commit pertama dengan command berikut:

```
git commit -m “initial commit”
```

### Menghubungkan akun github di local dengan github CLI

Kita akan menghubungkan akun github dengan sistem git di local komputer. kita akan menggunakan github CLI

1. Install github CLI pada halaman berikut https://github.com/cli/cli#installation
2. cek apakah sudah terinstall dengan menuliskan command berikut pada terminal CMD

```
gh --version
```

3. Login akun github dengan menggunakan command:

```
gh auth login
```

akan muncul konfigurasi seperti berikut:

- What account do you want to log into? → GitHub.com
- What is your preferred protocol for Git operations? → HTTPS
- Authenticate Git with your GitHub credentials? → Y
- How would you like to authenticate GitHub CLI? → Login with a web browser

4. gh akan menampilkan one-time code, salin code tersebut kemudian tekan enter dan browser akan terbuka. masukan one-time code yang telah diberikan.
5. klik authorize github

### Membuat Remote Repository

Selanjutnya kita akan membuat remote repository serta mengunggah local repository ke remote repository.

1. Buat repository baru pada akun github
2. Salin alamat repository yang berupa alamat HTTPS
3. Kembali ke project pada terminal tuliskan command berikut:

```
git remote add origin <alamat remote repository Anda>
```

4. setelah berhasil terhubung, unggah local repository ke remote repository dengan command

```
git push origin master
```

5. Cek halaman repository pada github, dan pastikan source code telah terunggah ke remote repository.

### Membuat CI Menggunakan Github Action

Proses CI pada github Action seperti berikut:

- Developer melakukan pull request ke remote repository
- Github akan menjalankan Action dan menjalankan pengujian otomatis
- Jika pengujian lulus, pull request akan di merge. Jika gagal pull request akan di tutup
- setelah di merge kode di branch utama akan berubah dan memicu vercel untuk men-deploy aplikasi

1. buat folder baru dengan nama .github/workflows dan buat berkas ci.yml

```yml
name: Continuous Integration

on:
  pull_request:
    branches:
      - master

jobs:
  automation-test-job:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v2
        with:
          node-version: ${{ matrix.node-version }}
      - name: npm install and test
        run: |
          npm install
          npm run ci:test
```

Pada code di atas kita menggunakan npm run ci:test hal ini dikarenakan agar runner dapat berjalan secara otomatis.

2. Install dependency start-server-and-test menggunakan command berikut:

```
npm install start-server-and-test --save-dev
```

3. kemudian tambahkan runner script pada package.json

```json
 "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint ./src --ext .jsx --ext .js",
    "test": "vitest",
    "e2e": "cypress run",
    "ci:test": "vitest --no-watch && start-server-and-test dev http-get://localhost:5173 e2e"
  },
```

4. commit perubahan dan push ke remote repository dengan command berikut:

```
git add .
git commit -m "add ci action"
git push origin master
```

5. masuk ke halaman repository pada github dan masuk ke menu Actions, pastikan terdapat action Continuous Integration

## CD menggunakan Vercel

1. Daftar akun Vercel pada halaman https://vercel.com/ disarankan menggunakan akun github yang kita pakai pada project
2. Untuk mulai men-deploy aplikasi, impor aplikasi via Git repository, klik tombol Continue with GitHub.
3. Berikan izin individual dengan memilih Only Select Repository dan pilih repository project dan pilih tombol install
4. Masukan password github untuk mengkonfirmasi pemasangan vercel pada github
5. Masuk ke dashboard vercel, pilih Import pada repository project. Vercel akan otomatis membaca dan merekomendasikan configurasi yang sesuai pada project yang kita impor
6. Klik Tombol Deploy untuk men-deploy aplikasi, Tunggu hingga proses selesai
7. Aplikasi telah di deploy! buka aplikasi dari url yang disediakan oleh vercel.

Setiap perubahan pada repository akan dilakukan CI oleh github Actions. Ketika ada pull Request, maka continuous integration akan dijalankan untuk memastikan pengujian pada aplikasi. Jika pengujian lolos kita dapat melakukan merge pull request dan Vercel akan secara otomatis men-deploy ulang aplikasi dengan perubahan yang telah kita lakukan.
Ada Baiknya untuk melakukan branch protection kepada branch master atau main, dikarenakan perubahan pada branch master atau main akan secara otomatis dilakukan CI/CD tanpa melalui proses pull Request.

1. Pada halaman project repository github pilih menu setting
2. Pilih branches
3. Pilh Add branch protection rule
4. Centang pilihan berikut:

- Require a pull request before merging: check
- Require status check to pass before merging: check
- Status checks that are required: automation-test-job (GitHub Actions)

5. klik tombol create

Branch protection telah diterapkan. Selamat anda berhasil mengerjakan project forum ini dengan baik.

Sumber: https://www.dicoding.com/
Referensi styling Link Component with Styled Component:
https://stackoverflow.com/questions/69869021/link-component-not-working-with-styled-components
