import { User, Thread, ThreadDetail } from './api';

// Redux Store State Types
export interface RootState {
  users: User[];
  authUser: User | null;
  isPreload: boolean;
  threads: Thread[];
  threadDetail: ThreadDetail | null;
  darkTheme: boolean;
  loadingBar: {
    default: number;
  };
}

// Redux Action Types
export interface BaseAction {
  type: string;
}

export interface PayloadAction<T> extends BaseAction {
  payload: T;
}

// Users Actions
export interface ReceiveUsersAction extends PayloadAction<{ users: User[] }> {
  type: 'RECEIVE_USERS';
}

// Auth User Actions
export interface SetAuthUserAction extends PayloadAction<{ authUser: User }> {
  type: 'SET_AUTH_USER';
}

export interface UnsetAuthUserAction extends BaseAction {
  type: 'UNSET_AUTH_USER';
}

// Preload Actions
export interface SetIsPreloadAction extends PayloadAction<{ isPreload: boolean }> {
  type: 'SET_IS_PRELOAD';
}

// Threads Actions
export interface ReceiveThreadsAction extends PayloadAction<{ threads: Thread[] }> {
  type: 'RECEIVE_THREADS';
}

export interface AddThreadAction extends PayloadAction<{ thread: Thread }> {
  type: 'ADD_THREAD';
}

export interface UpVoteThreadAction extends PayloadAction<{ threadId: string; userId: string }> {
  type: 'UP_VOTE_THREAD';
}

export interface DownVoteThreadAction extends PayloadAction<{ threadId: string; userId: string }> {
  type: 'DOWN_VOTE_THREAD';
}

export interface NeutralizeVoteThreadAction extends PayloadAction<{
  threadId: string;
  userId: string;
}> {
  type: 'NEUTRALIZE_VOTE_THREAD';
}

// Thread Detail Actions
export interface ReceiveThreadDetailAction extends PayloadAction<{ threadDetail: ThreadDetail }> {
  type: 'RECEIVE_THREAD_DETAIL';
}

export interface ClearThreadDetailAction extends BaseAction {
  type: 'CLEAR_THREAD_DETAIL';
}

// Theme Actions
export interface ToggleDarkThemeAction extends BaseAction {
  type: 'TOGGLE_DARKTHEME';
}

// Union Types for Actions
export type UsersAction = ReceiveUsersAction;
export type AuthUserAction = SetAuthUserAction | UnsetAuthUserAction;
export type PreloadAction = SetIsPreloadAction;
export type ThreadsAction = ReceiveThreadsAction | AddThreadAction | UpVoteThreadAction
| DownVoteThreadAction | NeutralizeVoteThreadAction;
export type ThreadDetailAction = ReceiveThreadDetailAction | ClearThreadDetailAction;
export type ThemeAction = ToggleDarkThemeAction;

// Thunk Action Types
export type AppThunk<ReturnType = void> = (
  dispatch: (action: unknown) => void,
  getState: () => RootState,
) => ReturnType;

// Component Props Types
export interface NavigationProps {
  signOut: () => void;
}

export interface ThreadInputProps {
  addThread: (data: { title: string; body: string; category: string }) => void;
}

export interface ThreadItemProps {
  thread: Thread;
  authUser: User;
  upVote: (threadId: string) => void;
  downVote: (threadId: string) => void;
  neutralizeVote: (threadId: string) => void;
}

export interface ThreadListProps {
  threads: Thread[];
  authUser: User;
  upVote: (threadId: string) => void;
  downVote: (threadId: string) => void;
  neutralizeVote: (threadId: string) => void;
}

export interface CommentInputProps {
  addComment: (content: string) => void;
}

export interface CommentItemProps {
  comment: Comment;
  authUser: User;
  upVote: (commentId: string) => void;
  downVote: (commentId: string) => void;
  neutralizeVote: (commentId: string) => void;
}
