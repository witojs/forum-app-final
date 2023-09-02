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
