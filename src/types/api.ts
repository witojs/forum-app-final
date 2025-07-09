// API Response Types
export interface ApiResponse<T> {
  status: 'success' | 'fail';
  message: string;
  data: T;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Thread Types
export interface Thread {
  id: string;
  title: string;
  body: string;
  category: string;
  createdAt: string;
  ownerId: string;
  upVotesBy: string[];
  downVotesBy: string[];
  totalComments: number;
}

export interface CreateThreadData {
  title: string;
  body: string;
  category: string;
}

// Comment Types
export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  owner: User;
  upVotesBy: string[];
  downVotesBy: string[];
}

export interface CreateCommentData {
  id: string;
  content: string;
}

// Thread Detail Type
export interface ThreadDetail {
  id: string;
  title: string;
  body: string;
  category: string;
  createdAt: string;
  owner: User;
  upVotesBy: string[];
  downVotesBy: string[];
  comments: Comment[];
}

// Leaderboard Types
export interface LeaderboardEntry {
  user: User;
  score: number;
}

// API Methods Types
export interface ApiMethods {
  register: (data: RegisterData) => Promise<User>;
  login: (data: LoginData) => Promise<string>;
  getOwnProfile: () => Promise<User>;
  getAllUsers: () => Promise<User[]>;
  getAllThreads: () => Promise<Thread[]>;
  getThreadDetail: (id: string) => Promise<ThreadDetail>;
  createThread: (data: CreateThreadData) => Promise<Thread>;
  createComment: (data: CreateCommentData) => Promise<Comment>;
  toggleVoteThread: (id: string) => Promise<void>;
  toggleVoteComment: (id: string, commentId: string) => Promise<void>;
  neutralizeVoteThread: (id: string) => Promise<void>;
  neutralizeVoteComment: (id: string, commentId: string) => Promise<void>;
  seeLeaderboards: () => Promise<LeaderboardEntry[]>;
  putAccessToken: (token: string) => void;
  getAccessToken: () => string | null;
}
