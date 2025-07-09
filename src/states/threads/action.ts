import { hideLoading, showLoading } from 'react-redux-loading-bar';
import api from '../../utils/api';
import {
  ReceiveThreadsAction,
  AddThreadAction,
  UpVoteThreadAction,
  DownVoteThreadAction,
  NeutralizeVoteThreadAction,
  AppThunk,
} from '../../types/redux';
import { Thread, CreateThreadData } from '../../types/api';

const ActionType = {
  RECEIVE_THREADS: 'RECEIVE_THREADS' as const,
  ADD_THREAD: 'ADD_THREAD' as const,
  UP_VOTE_THREAD: 'UP_VOTE_THREAD' as const,
  DOWN_VOTE_THREAD: 'DOWN_VOTE_THREAD' as const,
  NEUTRALIZE_VOTE_THREAD: 'NEUTRALIZE_VOTE_THREAD' as const,
};

function receiveThreads(threads: Thread[]): ReceiveThreadsAction {
  return {
    type: ActionType.RECEIVE_THREADS,
    payload: {
      threads,
    },
  };
}

function addThread(thread: Thread): AddThreadAction {
  return {
    type: ActionType.ADD_THREAD,
    payload: {
      thread,
    },
  };
}

function upVoteThread(threadId: string, userId: string): UpVoteThreadAction {
  return {
    type: ActionType.UP_VOTE_THREAD,
    payload: {
      threadId,
      userId,
    },
  };
}

function downVoteThread(threadId: string, userId: string): DownVoteThreadAction {
  return {
    type: ActionType.DOWN_VOTE_THREAD,
    payload: {
      threadId,
      userId,
    },
  };
}

function neutralizeVoteThread(threadId: string, userId: string): NeutralizeVoteThreadAction {
  return {
    type: ActionType.NEUTRALIZE_VOTE_THREAD,
    payload: {
      threadId,
      userId,
    },
  };
}

function asyncAddThread({ title, body, category }: CreateThreadData): AppThunk {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const thread = await api.createThread({ title, body, category });
      dispatch(addThread(thread));
    } catch (error) {
      alert((error as Error).message);
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
