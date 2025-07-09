import {
  ApiResponse,
  User,
  Thread,
  ThreadDetail,
  Comment,
  LeaderboardEntry,
  RegisterData,
  LoginData,
  CreateThreadData,
  CreateCommentData,
  ApiMethods,
} from '../types/api';

const api = ((): ApiMethods => {
  const BASE_URL = 'https://forum-api.dicoding.dev/v1';

  async function register({ name, email, password }: RegisterData): Promise<User> {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const responseJson: ApiResponse<{ user: User }> = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const { data: { user } } = responseJson;
    return user;
  }

  function putAccessToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  function getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
  }

  async function login({ email, password }: LoginData): Promise<string> {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const responseJson: ApiResponse<{ token: string }> = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const { data: { token } } = responseJson;
    return token;
  }

  async function getOwnProfile(): Promise<User> {
    const response = await fetchWithAuth(`${BASE_URL}/users/me`);
    const responseJson: ApiResponse<{ user: User }> = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const { data: { user } } = responseJson;
    return user;
  }

  async function getAllUsers(): Promise<User[]> {
    const response = await fetch(`${BASE_URL}/users`);
    const responseJson: ApiResponse<{ users: User[] }> = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const { data: { users } } = responseJson;
    return users;
  }

  async function getAllThreads(): Promise<Thread[]> {
    const response = await fetch(`${BASE_URL}/threads`);
    const responseJson: ApiResponse<{ threads: Thread[] }> = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const { data: { threads } } = responseJson;
    return threads;
  }

  async function getThreadDetail(id: string): Promise<ThreadDetail> {
    const response = await fetch(`${BASE_URL}/threads/${id}`);
    const responseJson: ApiResponse<{ detailThread: ThreadDetail }> = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const { data: { detailThread } } = responseJson;
    return detailThread;
  }

  async function createThread({ title, body, category }: CreateThreadData): Promise<Thread> {
    const response = await fetchWithAuth(`${BASE_URL}/threads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        body,
        category,
      }),
    });

    const responseJson: ApiResponse<{ thread: Thread }> = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const { data: { thread } } = responseJson;
    return thread;
  }

  async function createComment({ id, content }: CreateCommentData): Promise<Comment> {
    const response = await fetchWithAuth(
      `${BASE_URL}/threads/${id}/comments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
        }),
      },
    );

    const responseJson: ApiResponse<{ comment: Comment }> = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const { data: { comment } } = responseJson;
    return comment;
  }

  async function toggleVoteThread(id: string): Promise<void> {
    const response = await fetchWithAuth(`${BASE_URL}/threads/${id}/up-vote`, {
      method: 'POST',
    });

    const responseJson: ApiResponse<{}> = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
  }

  async function toggleVoteComment(id: string, commentId: string): Promise<void> {
    const response = await fetchWithAuth(
      `${BASE_URL}/threads/${id}/comments/${commentId}/up-vote`,
      {
        method: 'POST',
      },
    );

    const responseJson: ApiResponse<{}> = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
  }

  async function neutralizeVoteThread(id: string): Promise<void> {
    const response = await fetchWithAuth(
      `${BASE_URL}/threads/${id}/neutral-vote`,
      {
        method: 'POST',
      },
    );

    const responseJson: ApiResponse<{}> = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
  }

  async function neutralizeVoteComment(id: string, commentId: string): Promise<void> {
    const response = await fetchWithAuth(
      `${BASE_URL}/threads/${id}/comments/${commentId}/neutral-vote`,
      {
        method: 'POST',
      },
    );

    const responseJson: ApiResponse<{}> = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
  }

  async function seeLeaderboards(): Promise<LeaderboardEntry[]> {
    const response = await fetch(`${BASE_URL}/leaderboards`);
    const responseJson: ApiResponse<{ leaderboards: LeaderboardEntry[] }> = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const { data: { leaderboards } } = responseJson;
    return leaderboards;
  }

  return {
    register,
    login,
    getOwnProfile,
    getAllUsers,
    getAllThreads,
    getThreadDetail,
    createThread,
    createComment,
    toggleVoteThread,
    toggleVoteComment,
    neutralizeVoteThread,
    neutralizeVoteComment,
    seeLeaderboards,
    putAccessToken,
    getAccessToken,
  };
})();

export default api;
