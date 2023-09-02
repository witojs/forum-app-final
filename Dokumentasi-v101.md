# Forum App

Project Submission Dicoding React Expert.
Contoh Aplikasi:
https://dicoding-forum-app.vercel.app/
Rest API forum App dicoding:
https://forum-api.dicoding.dev/v1/#/

Hasil akhir Project: https://forum-app-final.vercel.app/

## kriteria Project:

### Kriteria Utama 1: Fungsionalitas Aplikasi

1. Terdapat cara untuk mendaftar akun.
2. Terdapat cara untuk login akun.
3. Menampilkan daftar thread.
4. Ketika item thread dipilih, menampilkan detail thread beserta komentar di dalamnya.
5. Pengguna dapat membuat thread.
6. Pengguna dapat membuat komentar di dalam sebuah thread.
7. Menampilkan Loading bar ketika memuat data dari API.

Note:

1. Perihal authorization dalam mengakses resource threads kami bebaskan. Anda boleh mengharuskan pengguna untuk login ataupun tidak ketika ingin melihat threads. Namun, dalam berinteraksi mengubah data, seperti membuat thread atau komentar, pengguna wajib terotentikasi.
2. Item thread pada halaman daftar thread yang ditampilkan harus mengandung informasi berikut ini.

- Judul dari thread.
- Potongan dari body thread (opsional).
- Waktu pembuatan thread.
- Jumlah komentar.
- Informasi pembuat thread:
  - Nama
  - Avatar (Opsional)

3. Halaman detail thread harus mengandung informasi berikut ini.

- Judul dari thread.
- Body dari thread.
- Waktu pembuatan thread.
- Informasi pembuat thread:
  - Nama
  - Avatar
- Komentar pada thread tersebut. Minimal informasi yang harus ditampilkan adalah:
  - Konten dari komentar.
  - Waktu pembuatan komentar.
  - Informasi pembuat komentar: (Nama, Avatar)

### Kriteria Utama 2: Bugs Highlighting

1. Menggunakan ESLint pada source code aplikasi. Indikasinya adalah terdapat berkas konfigurasi ESLint pada proyek.
2. Menerapkan salah satu Code Convention berikut

- AirBnB JavaScript Style Guide
- Google JavaScript Style Guide.
- StandardJS Style Guide.

3. Tidak ada indikasi error yang ditampilkan ESLint.
4. Menggunakan React Strict Mode.

### Kriteria Utama 3: Arsitektur Aplikasi

1. Hampir seluruh state aplikasi (terutama yang bersumber dari API) disimpan pada Redux Store. Form input atau controlled component diperbolehkan untuk mengelola state-nya sendiri.
2. Tidak ada pemanggilan REST API yang dilakukan di dalam lifecycle atau efek pada komponen.
3. Memisahkan kode UI dengan State di folder yang terpisah.
4. React component bersifat modular dan reusable.

### Tambahan fitur 1: Fitur Votes pada Thread dan Komentar

1. Menyediakan tombol yang dapat digunakan untuk votes pada thread dan komentar.
2. Menampilkan indikasi pada tombol bila pengguna sudah mem-vote thread dan komentar. Contohnya, mengubah warna tombol dari abu-abu menjadi merah bila pengguna sudah up-vote/down-vote.
3. Mengedepankan User Experience dengan menerapkan Optimistically Apply Actions.
4. Menampilkan jumlah votes pada thread dan komentar.

### Tambahan fitur 2: Menampilkan Leaderboard

1. Terdapat halaman untuk menampilkan leaderboard.
2. Setiap item leaderboard, harus menampilkan informasi berikut ini.

- Nama pengguna.
- Avatar pengguna
- Score.

### Tambahan fitur 3: Filter Daftar Thread Berdasarkan Kategori

1. Terdapat fitur untuk mem-filter item thread yang ditampilkan pada halaman daftar threads.
   Note: API tidak menyediakan endpoint untuk filter daftar threads, sehingga fitur ini dibangun murni dari sisi Front-End dengan memanipulasi state aplikasi

# Pengerjaan

## Setting Project

Kita akan membuat project react forum app menggunakan Vite.

1. Buat Folder dengan nama project-forum-app kemudian buka menggunakan vscode. Buka terminal project menggunakan ctrl + `.
2. Ketikan command untuk menginstall project react menggunakan vite

```
npm create vite@latest ./
```

ataupun

```
npm create vite@latest project-forum-app -- --template react
```

### Struktur Folder

Struktur folder dan file pada project adalah sebagai berikut:

```
|src
    |components
    |hooks
    |pages
    |states
    |styledComponents
    |styles
    |utils
    App.jsx
    main.jsx
index.html
package-lock.json
package.json
README.md
vite.config.js
```

- components - berisi berkas React Komponen
- hooks - berisi customs hook
- pages - berisi komponen halaman
- states - berisi berkas terkait state seperti action creator, fungsi thunk, reducer dan store
- styledComponents - berisi berkas terkait styled component
- styles - berisi berkas style.css
- utils - berisi helper function

### Membuat berkas styles dan helper function

1. pada folder styles buat berkas dengan nama style.css dan tuliskan code berikut:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --background-color: #eff0f3;
  --section-color: #fffffe;
  --headline-color: #0d0d0d;
  --highlight-color: #ff8e3c;
  --text-color: #2a2a2a;
  --line-color: rgba(0, 0, 0, 0.2);
}

main {
  /* background-color: var(--section-color); */
  min-height: 100vh;
  max-width: 800px;
  margin: 80px auto;
}

/* app-header */
.app-header {
  height: fit-content;
  background-color: var(--highlight-color);
  text-align: center;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
}

.toggle-theme {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 2em;
  background-color: var(--highlight-color);
  text-align: center;
  border: none;
}

.app-logo {
  display: flex;
  border: 1px solid var(--line-color);
  justify-content: center;
  font-size: 24px;
  z-index: 1;
  padding: 0.3em;
  color: var(--headline-color);
}

/* loading */
.loading {
  position: sticky;
  top: 80px;
}

/* login page, register page*/
.login-page,
.register-page {
  max-width: 600px;
  margin: 50px auto;
  /* background-color: var(--highlight-color); */
  display: flex;
  flex-direction: column;
  text-align: center;
  color: var(--text-color);
}

.login-page__hero,
.register-page__hero {
  padding: 0.5rem;
  align-self: center;
  font-size: 60px;
}

.login-page__main,
.register-page__main {
  border: 1px solid rgba(0, 0, 0, 0.3);
  width: 80%;
  align-self: center;
  background-color: var(--section-color);
  padding: 0.5em;
  margin: 0.5rem;
  border-radius: 10px;
  height: 400px;
}

.login-page__main,
.register-page__main h1 {
  padding: 0.5em;
}

.login-input,
.register-input {
  display: flex;
  flex-direction: column;
  height: 150px;
  gap: 5px;
  margin-top: 5px;
}

.login-input input,
.register-input input {
  padding: 0.5em;
  outline: none;
  font-family: 'Open Sans', sans-serif;
}

.login-input button,
.register-input button,
.thread-input button,
.comment-input button {
  background-color: var(--highlight-color);
  color: var(--headline-color);
  font-weight: bold;
  padding: 0.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.login-input button:hover,
.register-input button:hover,
.thread-input button:hover,
.comment-input button:hover {
  background-color: var(--headline-color);
  color: var(--highlight-color);
}

/* homepage */
.home-page {
  margin: 0 auto;
  width: 100%;
  padding: 1rem;
  /* background-color: var(--section-color); */
  border-radius: 10px;
}

.thread-list {
  display: grid;
  gap: 20px;
}

.thread-item {
  border-bottom: 1px solid var(--highlight-color);
  padding: 1em;
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
}

.thread-item__info h2 {
  margin-bottom: 5px;
}

.thread-item__info p {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.thread-item__category {
  border: 1px solid var(--highlight-color);
  padding: 0.3em;
  width: fit-content;
  border-radius: 5px;
  font-size: 12px;
}

.thread-item__detail {
  width: 500px;
  display: flex;
  justify-content: space-around;
  gap: 5px;
}

.thread-item__detail-avatar {
  border-radius: 50%;
  /* width: 20px; */
  width: 5%;
}

/* navigation */
.navigation {
  width: 100%;
  border: 1px solid var(--line-color);
  display: flex;
  justify-content: center;
  position: fixed;
  left: 0;
  bottom: 0;
  background-color: var(--section-color);
  padding: 1em;
}

.navigation-profile {
  display: flex;
}

.navigation-profile img {
  border-radius: 50%;
}

.navigation-button {
  display: flex;
  justify-content: space-between;
  text-align: center;
  text-decoration: none;
}

.navigation-button p {
  color: var(--text-color);
}

.navigation-button:visited {
  text-decoration: none;
}

.navigation-button button {
  border: none;
  font-size: 30px;
  width: 100px;
  transition: transform 0.3s;
  cursor: pointer;
  background-color: var(--section-color);
}

.navigation-button button:hover {
  transform: scale(1.1);
}

.sign-out__p {
  font-size: 16px;
}

/* Input */
.input-page {
  background-color: var(--section-color);
  color: var(--text-color);
  max-width: 90%;
  margin: 0 auto;
  /* background-color: var(--highlight-color); */
  display: flex;
  flex-direction: column;
  padding: 1em;
  border-radius: 5px;
  text-align: center;
}

.thread-input {
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.thread-input textarea {
  font-family: 'Open Sans', sans-serif;
  padding: 8px;
  width: 100%;
  height: 150px;
  resize: none;
  font-size: 15px;
  outline: none;
}

.thread-input input {
  padding: 0.5em;
  outline: none;
  font-family: 'Open Sans', sans-serif;
}

/* DetailPage */
.detail-page {
  margin: 0 auto;
  width: 100%;
  padding: 1rem;
  /* background-color: var(--section-color); */
  border-radius: 10px;
  height: 900px;
}

.thread-detail {
  border-bottom: 1px solid var(--highlight-color);
  padding: 1em;
  display: flex;
  flex-direction: column;
  gap: 10px;
  /* margin: 10px; */
}

.thread-detail__info {
  margin-bottom: 10px;
}

.thread-detail__info p {
  margin-top: 10px;
}

.thread-detail__detail {
  max-width: 400px;
  display: flex;
  justify-content: space-around;
}

.thread-detail__detail img {
  border-radius: 50%;
  width: 15px;
}

/* comment */

.add-comment {
  margin: 10px;
}

.add-comment h3 {
  margin-bottom: 5px;
}

.comment-input {
  display: grid;
  gap: 20px;
}

.comment-input textarea {
  font-family: 'Open Sans', sans-serif;
  padding: 8px;
  width: 100%;
  height: 150px;
  resize: none;
  font-size: 15px;
  outline: none;
}

.comment-list {
  margin: 10px;
}

.comment-item {
  border-bottom: 1px solid var(--highlight-color);
  padding: 0.5em;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.comment-item__info {
  display: flex;
  padding: 0.5em;
}

.comment-item__info div {
  flex-grow: 2;
}

.comment-item__info img {
  border-radius: 50%;
  width: 20px;
}

.comment-item__info span {
  font-weight: bold;
}

.comment-item__vote {
  display: flex;
  gap: 5px;
}

.button-vote {
  border: none;
  background-color: transparent;
  font-size: 16px;
}

.icon-voted {
  color: var(--text-color);
}
```

2. pada folder utils buat berkas dengan nama api.js dan tuliskan code berikut:

```js
//utils/api.js
/* eslint-disable comma-dangle */
const api = (() => {
  const BASE_URL = 'https://forum-api.dicoding.dev/v1';
  /* fungsi helper register */
  async function register({ name, email, password }) {
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

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const {
      data: { user },
    } = responseJson;

    return user;
  }
  /* fungsi helper login */

  function putAccessToken(token) {
    localStorage.setItem('accessToken', token);
  }

  function getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  async function _fetchWithAuth(url, options = {}) {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
  }

  async function login({ email, password }) {
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

    const responseJson = await response.json();

    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const {
      data: { token },
    } = responseJson;

    return token;
  }

  async function getOwnProfile() {
    const response = await _fetchWithAuth(`${BASE_URL}/users/me`);

    const responseJson = await response.json();

    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const {
      data: { user },
    } = responseJson;

    return user;
  }

  async function getAllUsers() {
    const response = await fetch(`${BASE_URL}/users`);

    const responseJson = await response.json();

    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const {
      data: { users },
    } = responseJson;

    return users;
  }

  async function getAllThreads() {
    const response = await fetch(`${BASE_URL}/threads`);

    const responseJson = await response.json();

    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const {
      data: { threads },
    } = responseJson;

    return threads;
  }

  async function getThreadDetail(id) {
    const response = await fetch(`${BASE_URL}/threads/${id}`);

    const responseJson = await response.json();

    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const {
      data: { detailThread },
    } = responseJson;

    return detailThread;
  }

  async function createThread({ title, body, category }) {
    const response = await _fetchWithAuth(`${BASE_URL}/threads`, {
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

    const responseJson = await response.json();

    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const {
      data: { thread },
    } = responseJson;

    return thread;
  }

  async function createComment({ id, content }) {
    const response = await _fetchWithAuth(
      `${BASE_URL}/threads/${id}/comments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
        }),
      }
    );

    const responseJson = await response.json();

    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const {
      data: { comment },
    } = responseJson;

    return comment;
  }

  /* helper up-vote, down-vote */
  async function toggleVoteThread(id) {
    const response = await _fetchWithAuth(`${BASE_URL}/threads/${id}/up-vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        threadId: id,
      }),
    });

    const responseJson = await response.json();

    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
  }

  async function toggleDownVoteThread(id) {
    const response = await _fetchWithAuth(
      `${BASE_URL}/threads/${id}/down-vote`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          threadId: id,
        }),
      }
    );

    const responseJson = await response.json();

    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
  }

  /* fitur vote thread, vote comment & leaderboard */
  async function upVoteThread(threadId) {
    const response = await _fetchWithAuth(
      `${BASE_URL}/threads/${threadId}/up-vote`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const responseJson = await response.json();

    const { status, message } = responseJson;
    if (status !== 'success') {
      throw new Error(message);
    }

    const {
      data: { vote },
    } = responseJson;

    return vote;
  }

  async function downVoteThread(threadId) {
    const response = await _fetchWithAuth(
      `${BASE_URL}/threads/${threadId}/down-vote`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const responseJson = await response.json();

    const { status, message } = responseJson;
    if (status !== 'success') {
      throw new Error(message);
    }

    const {
      data: { vote },
    } = responseJson;

    return vote;
  }

  async function neutralizeVoteThread(threadId) {
    const response = await _fetchWithAuth(
      `${BASE_URL}/threads/${threadId}/neutral-vote`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const responseJson = await response.json();

    const { status, message } = responseJson;
    if (status !== 'success') {
      throw new Error(message);
    }

    const {
      data: { vote },
    } = responseJson;

    return vote;
  }

  async function upVoteComment(threadId, commentId) {
    const response = await _fetchWithAuth(
      `${BASE_URL}/threads/${threadId}/comments/${commentId}/up-vote`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const responseJson = await response.json();

    const { status, message } = responseJson;
    if (status !== 'success') {
      throw new Error(message);
    }

    const {
      data: { vote },
    } = responseJson;

    return vote;
  }

  async function downVoteComment(threadId, commentId) {
    const response = await _fetchWithAuth(
      `${BASE_URL}/threads/${threadId}/comments/${commentId}/down-vote`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const responseJson = await response.json();

    const { status, message } = responseJson;
    if (status !== 'success') {
      throw new Error(message);
    }

    const {
      data: { vote },
    } = responseJson;

    return vote;
  }

  async function neutralizeVoteComment(threadId, commentId) {
    const response = await _fetchWithAuth(
      `${BASE_URL}/threads/${threadId}/comments/${commentId}/neutral-vote`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const responseJson = await response.json();

    const { status, message } = responseJson;
    if (status !== 'success') {
      throw new Error(message);
    }

    const {
      data: { vote },
    } = responseJson;

    return vote;
  }

  async function seeLeaderboards() {
    const response = await fetch(`${BASE_URL}/leaderboards`);

    const responseJson = await response.json();

    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const {
      data: { leaderboards },
    } = responseJson;

    return leaderboards;
  }

  return {
    register,
    putAccessToken,
    getAccessToken,
    login,
    getOwnProfile,
    getAllUsers,
    getAllThreads,
    getThreadDetail,
    createThread,
    createComment,
    toggleVoteThread,
    toggleDownVoteThread,
    upVoteComment,
    upVoteThread,
    downVoteComment,
    downVoteThread,
    neutralizeVoteComment,
    neutralizeVoteThread,
    seeLeaderboards,
  };
})();

export default api;
```

api.js akan berisi helper function untuk melakukan proses komunikasi dengan REST API.

3. buat berkas dengan nama index.js dan tuliskan code berikut:

```js
//utils/index.js
function postedAt(date) {
  const now = new Date();
  const posted = new Date(date);
  const diff = now - posted;
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diff / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diff / (1000 * 60));
  const diffSeconds = Math.floor(diff / 1000);

  if (diffDays > 0) {
    return `${diffDays} days ago`;
  }
  if (diffHours > 0) {
    return `${diffHours} hours ago`;
  }
  if (diffMinutes > 0) {
    return `${diffMinutes} minutes ago`;
  }
  if (diffSeconds > 0) {
    return `${diffSeconds} seconds ago`;
  }
  return 'just now';
}

export default postedAt;
```

4. buat berkas dengan nama useInput.js pada folder src/hooks

```js
//hooks/useInput.js
import { useState } from 'react';

function useInput(defaultValue = '') {
  const [value, setValue] = useState(defaultValue);

  function handleValueChange({ target }) {
    setValue(target.value);
  }

  return [value, handleValueChange, setValue];
}

export default useInput;
```

useInput merupakan customs hooks yang kita buat untuk meminimalisir penggunaan useState pada komponen form.

### dependency

Kita akan menggunakan beberapa dependency pada project yakni:

- @reduxjs/toolkit - npm install @reduxjs/toolkit
- prop-types - npm install --save prop-types
- react-icons - npm install react-icons --save
- react-redux - npm install react-redux
- react-redux-loading-bar - npm install react-redux-loading-bar
- react-router-dom - npm install --save react-router-dom@6
- styled-components -npm install styled-components
- styled-theming - npm install styled-theming

seiring berkembangnya project kita juga akan menambahkan dependency.

## Alur Aplikasi

Berikut merupakan alur penggunaan aplikasi forum:

1. Pengguna dapat melakukan login di Login Page
2. Jika belum terdaftar dapat melakukan register di Register Page
3. Ketika login berhasil pengguna akan di arahkan ke halaman Home page yang berisi daftar semua thread
4. Pengguna dapat mem-vote thread pada halaman Home Page
5. Ketika thread di-klik akan mengarahkan pengguna ke halaman Detail Page
6. Pengguna dapat menambahkan komentar pada Detail Page
7. Pengguna dapat mem-vote komentar
8. Pengguna dapat menambahkan thread melalui halaman Input Page/ Add Thread Page

## State

Berikut state yang akan digunakan pada aplikasi forum:

1. authUser - authUser mengatur proses login dan logout
2. isPreload - isPreload mengatur proses preload pada halaman home page
3. theme - theme mengatur tema pada aplikasi
4. threadDetail - threadDetail mengatur data detail thread
5. threads - threads mengatur data all thread
6. users - users mengatur proses registrasi dan mengambil data users dari API

## Membuat berkas store.js , App.jsx & main.jsx

1. Buat berkas dengan nama store.js pada folder src/states

```js
//states/store.js
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    /* reducer akan ditambahkan
    seiring berkembannya aplikasi */
  },
});

export default store;
```

berkas store yang kita buat saat ini masih kosong, kita akan menambahkan reducer seiring berkembangnya aplikasi.

2. Buat berkas dengan nama App.jsx pada folder src

```js
//src/App.jsx
import React from 'react';

function App() {
  return (
    <header className="app-header">
      <h1>Hello World</h1>
    </header>
  );
}

export default App;
```

berkas App.js saat ini juga masih kosong, kita akan memperbaharuinya seiring berkembangnya aplikasi.

3. Buat berkas dengan nama main.jsx pada folder src

```js
//src/main.jsx
/* eslint-disable comma-dangle */
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import store from './states/store';

import './styles/style.css';

const root = createRoot(document.getElementById('root'));

// TODO: wrap App with store provider
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <StrictMode>
        <App />
      </StrictMode>
    </BrowserRouter>
  </Provider>
);
```

Pada main.jsx kita membungkus komponen App dengan komponen BrowserRouter, BrowserRouter akan menyediakan route pada komponen App. Kita juga membungkus komponen App dengan komponen Provider dari react-redux. Provider akan menyediakan store ke seluruh cakupan aplikasi.

## Fitur Registrasi

Kita akan membuat halaman registrasi, halaman ini akan memuat form agar pengguna dapat mendaftarkan melakukan pendaftaran akun. kita akan membuat state users yang berfungsi untuk mendaftarkan pengguna serta digunakan untuk mengambil data users dari API

### Membuat action & reducer users

1. Buat folder users di src/states kemudian buat berkas action.js

```js
//states/users/action.js
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import api from '../../utils/api';

const ActionType = {
  RECEIVE_USERS: 'RECEIVE_USERS',
};

function receiveUsers(users) {
  return {
    type: ActionType.RECEIVE_USERS,
    payload: {
      users,
    },
  };
}

function asyncRegisterUser({ name, email, password }) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      await api.register({ name, email, password });
    } catch (error) {
      alert(error.message);
    }
    dispatch(hideLoading());
  };
}

export { ActionType, receiveUsers, asyncRegisterUser };
```

fungsi action creator receiveUser akan membawa data payload users ke reducer. fungsi thunk asyncRegisterUser akan membawa data name, email, password ke API melalui fungsi api.register(). Pada code di atas kita juga men-dispatch showLoading() dan hideLoading() dari react-redux-loading-bar. react-redux-loading-bar akan menampilkan loading bar ketika proses asynchronous di jalankan. Sehingga kita men-dispatch fungsi tersebut di awal serta di akhir fungsi thunk. Kita juga mendefinisikan konstanta ActionType untuk menghindari typo ketika kita akan memasukan action type pada reducer.

2. buat berkas reducer.js pada folder states/users dan tuliskan code berikut:

```js
//states/users/reducer.js
import { ActionType } from './action';

function usersReducer(users = [], action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_USERS:
      return action.payload.users;
    default:
      return users;
  }
}

export default usersReducer;
```

fungsi usersReducer akan menambahkan data action.payload ke state users ketika action RECEIVE_USERS diterima.

3. tambahkan usersReducer ke store.js. Kita juga akan menambahkan loadingBar reducer

```js
//states/store.js
import { configureStore } from '@reduxjs/toolkit';
import { loadingBarReducer } from 'react-redux-loading-bar';
import usersReducer from './users/reducer';

const store = configureStore({
  reducer: {
    users: usersReducer,
    loadingBar: loadingBarReducer,
  },
});

export default store;
```

Pembuata state user sudah selesai, selanjutnya kita akan membuat komponen register input dan halaman register.

### Membuat Komponen Registrasi

1. Buat berkas dengan nama RegisterInput.jsx di src/components dan tuliskan code berikut:

```js
//src/components/RegisterInput.jsx
import React from 'react';
import PropTypes from 'prop-types';
import useInput from '../hooks/useInput';

function RegisterInput({ register }) {
  const [name, onNameChange] = useInput('');
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');

  return (
    <form className="register-input">
      <input
        type="text"
        value={name}
        onChange={onNameChange}
        placeholder="Name"
      />
      <input
        type="text"
        value={email}
        onChange={onEmailChange}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={onPasswordChange}
        placeholder="Password"
      />
      <button type="button" onClick={() => register({ name, email, password })}>
        Register
      </button>
    </form>
  );
}

export default RegisterInput;

RegisterInput.propTypes = {
  register: PropTypes.func.isRequired,
};
```

Komponen RegisterInput akan menerima props berupa fungsi register dari halaman register. Komponen RegisterInput akan memanggil fungsi register ketika tombol Register di klik dan mengirimkan nilai name, email, password sebagai argumennya. Kita juga menggunakan prop-types untuk memastikan props yang diterima oleh komponen sesuai dengan format yang kita tentukan.

2. Buat berkas dengan nama RegisterPage.js di folder src/pages dan tuliskan code berikut:

```js
//src/pages/RegisterPage.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import RegisterInput from '../components/RegisterInput';
import { asyncRegisterUser } from '../states/users/action';

function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onRegister = ({ name, email, password }) => {
    dispatch(asyncRegisterUser({ name, email, password }));

    navigate('/');
  };

  return (
    <section className="register-page">
      <article className="register-page__main">
        <h2>Create your account</h2>
        <RegisterInput register={onRegister} />

        <p>
          Already have an account?
          <Link to="/">Login</Link>
        </p>
      </article>
    </section>
  );
}

export default RegisterPage;
```

Pada Komponen RegisterPage, kita mendeklarasikan fungsi navigate menggunakan hook useNavigate dari react-router. fungsi navigate akan membawa kita ke halaman yang ditentukan ketika dipanggil. kita juga mendeklarasikan fungsi dispatch menggunakan hook useDispatch dari react-redux. fungsi onRegister() akan menerima data name, email, password, data tersebut kemudian memanggil fungsi dispatch dan mengirimkan data ke fungsi thunk asyncRegisterUser().
fungsi onRegister akan kita masukan sebagai nilai props register pada komponen RegisterInput yang telah kita buat sebelumnya.
Fitur Registrasi telah berhasil dibuat kita akan me-render komponen tersebut setelah kita membuat fitur Login.

## Fitur Login

Kita akan membuat halaman login agar pengguna dapat menggunakan aplikasi. fitur login membutuhkan state dengan nama authUser. state ini akan menyimpan data user token yang diperoleh dari API.

### Membuat action & reducer authUser

1. Buat folder authUser di src/states dan buat berkas action.js di dalamnya.

```js
//states/authUser/action.js
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import api from '../../utils/api';

const ActionType = {
  SET_AUTH_USER: 'SET_AUTH_USER',
  UNSET_AUTH_USER: 'UNSET_AUTH_USER',
};

function setAuthUser(authUser) {
  return {
    type: ActionType.SET_AUTH_USER,
    payload: {
      authUser,
    },
  };
}

function unsetAuthUser() {
  return {
    type: ActionType.UNSET_AUTH_USER,
  };
}

function asyncSetAuthUser({ email, password }) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const token = await api.login({ email, password });
      api.putAccessToken(token);
      const authUser = await api.getOwnProfile();
      dispatch(setAuthUser(authUser));
    } catch (error) {
      alert(error.message);
    }
    dispatch(hideLoading());
  };
}

function asyncUnsetAuthUser() {
  return (dispatch) => {
    dispatch(unsetAuthUser());
    api.putAccessToken('');
  };
}

export {
  ActionType,
  setAuthUser,
  unsetAuthUser,
  asyncSetAuthUser,
  asyncUnsetAuthUser,
};
```

Fungsi unsetAuthUser akan mengirimkan action UNSET_AUTH_USER ke reducer yang kemudian reducer akan merubah data authUser menjadi null.
Fungsi asyncUnsetAuthUser akan men-dispatch action unsetAuthUser dan menghapus access token dengan fungsi api.putAccessToken.
Fungsi thunk asyncSetAuthUser akan membawa data email, password ke fungsi api.login(). api.login() kemudian akan mengembalikan data berupa token yang digunakan api.getOwnProfile() untuk mengambil data user. Data user yang kita dapatkan kemudian diberikan ke fungsi action creator setAuthUser() kemudian fungsi setAuthUser akan membawa payload ke reducer.

2. Buat berkas dengan nama reducer.js pada folder states/authUser

```js
//authUser/reducer.js
import { ActionType } from './action';

function authUserReducer(authUser = null, action = {}) {
  switch (action.type) {
    case ActionType.SET_AUTH_USER:
      return action.payload.authUser;
    case ActionType.UNSET_AUTH_USER:
      return null;
    default:
      return authUser;
  }
}

export default authUserReducer;
```

fungsi authUserReducer akan mengembalikan nilai action.payload.authUser ketika action SET_AUTH_USER dijalankan dan akan mengembalikan nilai null ketika action UNSET_AUTH_USER di jalankan.

3. Tambahkan authUserReducer ke store.js

```js
//states/store.js
import { configureStore } from '@reduxjs/toolkit';
import { loadingBarReducer } from 'react-redux-loading-bar';
import usersReducer from './users/reducer';
import authUserReducer from './authUser/reducer';

const store = configureStore({
  reducer: {
    users: usersReducer,
    authUser: authUserReducer,
    loadingBar: loadingBarReducer,
  },
});

export default store;
```

pembuatan state authUser sudah selesai, selanjutnya kita akan membuat komponen Login input dan halaman login.

### Membuat Komponen Login

1. Buat berkas dengan nama LoginInput.jsx pada folder scr/components

```js
//components/LoginInput.jsx
import React from 'react';
import PropTypes from 'prop-types';
import useInput from '../hooks/useInput';

function LoginInput({ login }) {
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');

  return (
    <form className="login-input">
      <input
        type="text"
        value={email}
        onChange={onEmailChange}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={onPasswordChange}
        placeholder="Password"
      />
      <button type="button" onClick={() => login({ email, password })}>
        Login
      </button>
    </form>
  );
}

export default LoginInput;

LoginInput.propTypes = {
  login: PropTypes.func.isRequired,
};
```

Komponen LoginInput akan menerima props fungsi login dari halaman login. Ketika button Login diklik, data email, password akan dibawa ke fungsi login.

2. Buat berkas dengan nama LoginPage.jsx pada folder src/pages

```js
//pages/LoginPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LoginInput from '../components/LoginInput';
import { asyncSetAuthUser } from '../states/authUser/action';

function LoginPage() {
  const dispatch = useDispatch();

  const onLogin = ({ email, password }) => {
    dispatch(asyncSetAuthUser({ email, password }));
  };

  return (
    <section className="login-page">
      <article className="login-page__main">
        <h2>Login to Post Your New thread.</h2>

        <LoginInput login={onLogin} />
        <p>
          Don&apos;t have an account?
          <Link to="/register">Register</Link>
        </p>
      </article>
    </section>
  );
}

export default LoginPage;
```

Komponen LoginPage akan memberikan props login dengan value onLogin ke komponen loginInput. Fungsi onLogin akan mengambil data email, password dan men-dispatch fungsi thunk asyncSetAuthUser dengan argumen email, password yang didapatkan dari komponen LoginInput.

Halaman Register dan Login telah kita selesaikan, mari kita tambahkan ke komponen App.jsx agar komponen tersebut ditampilkan pada aplikasi.

## Komponen App - Menambahkan LoginPage & RegisterPage

Kita akan menambahkan LoginPage & RegisterPage pada komponen App. LoginPage/RegisterPage hanya akan muncul apabila pengguna belum login atau state authUser bernilai null. Update Komponen App.jsx menjadi seperti berikut:

```js
//src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  MdDeveloperMode,
  MdOutlineBrightnessLow,
  MdOutlineDarkMode,
} from 'react-icons/md';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';


function App() {
  const authUser = useSelector((states) => states.authUser);

  if (authUser === null) {
    return (
          <header className="app-header">
            <div className="app-logo">
              <MdDeveloperMode style={{ fontSize: '64px' }} />
              <h1>Forum App</h1>
            </div>
          </header>
          <main>
            <Routes>
              <Route path="/*" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </main>

    );
  }
}

export default App;
```

Pada code di atas, kita mengambil state authUser menggunakan hook useSelector. Kita asumsikan belum ada aksi login atau nilai authUser = null. Sehingga Komponen LoginPage & RegisterPage akan ditampilkan.
Jalankan aplikasi menggunakan command npm run dev dan pastikan LoginPage/RegisterPage ditampilkan. Tidak perlu melakukan Login terlebih dahulu atau melakukan proses Registrasi, hal tersebut akan kita jalankan ketika selesai membuat halaman Home page.

## Fitur Preload

Sejauh ini kita telah membuat 2 buah state, yakni authUser dan users. authUser berperan untuk menyimpan profile pengguna dan users untuk menyimpan profil dari berbagai user.
selanjutnya kita akan membuat proses preload, proses ini digunakan untuk mendapatkan pengguna terautentifikasi dan menetapkan nilai pada authUser. Kita akan membuat state isPreload dengan default nilai true dan akan bernilai false setelah proses preload selesai.

### Membuat fitur preload

1. Buat folder dengan nama isPreload pada src/states dan buat berkas action.js

```js
//isPreload/action.js
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import api from '../../utils/api';
import { setAuthUser } from '../authUser/action';

const ActionType = {
  SET_IS_PRELOAD: 'SET_IS_PRELOAD',
};

function setIsPreload(isPreload) {
  return {
    type: ActionType.SET_IS_PRELOAD,
    payload: {
      isPreload,
    },
  };
}

function asyncPreloadProcess() {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      // preload process
      const authUser = await api.getOwnProfile();
      dispatch(setAuthUser(authUser));
    } catch (error) {
      // fallback process
      dispatch(setAuthUser(null));
    } finally {
      // end preload process
      dispatch(setIsPreload(false));
    }
    dispatch(hideLoading());
  };
}

export { ActionType, setIsPreload, asyncPreloadProcess };
```

Pada isPreload/action.js kita membuat action creator setIsPreload, setIsPreload akan membawa nilai payload yang nantinya akan digunakan untuk merubah state melalui reducer, kita juga mengambil action creator setAuthUser dari authUser/action.js untuk menetapkan nilai dari authUser yang didapat dari api.getOwnProfile(). fungsi getOwnProfile akan mengambil data authUser melalui fetching menggunakan token login.

2. Buat file reducer.js pada folder states/isPreload

```js
//isPreload/reducer.js

import { ActionType } from './action';

function isPreloadReducer(isPreload = true, action = {}) {
  switch (action.type) {
    case ActionType.SET_IS_PRELOAD:
      return action.payload.isPreload;
    default:
      return isPreload;
  }
}

export default isPreloadReducer;
```

isPreloadReducer akan mengembalikan nilai state berdasarkan action type yang di-dispatch.

3. Masukan reducer tersebut ke states/store.js

```js
//states/store.js
import { configureStore } from '@reduxjs/toolkit';
import { loadingBarReducer } from 'react-redux-loading-bar';
import usersReducer from './users/reducer';
import authUserReducer from './authUser/reducer';
import isPreloadReducer from './isPreload/reducer';

const store = configureStore({
  reducer: {
    users: usersReducer,
    authUser: authUserReducer,
    isPreload: isPreloadReducer,
    loadingBar: loadingBarReducer,
  },
});

export default store;
```

## Fitur Menampilkan threads

Kita akan menampilkan threads pada halaman home page. kita perlu membuat state threads yang berisi daftar thread yang dibuat oleh berbagai user.

### Membuat action & reducer threads

1. Buat folder threads di src/states dan buat berkas action.js di dalamnya

```js
//threads/action.js
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import api from '../../utils/api';

const ActionType = {
  RECEIVE_THREADS: 'RECEIVE_THREADS',
  ADD_THREAD: 'ADD_THREAD',
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

export { ActionType, receiveThreads, addThread, asyncAddThread };
```

fungsi receiveThreads akan membawa data threads sebagai payload ke reducer.
fungsi thunk asyncAddThread menerima data berupa title, body, category. Data tersebut kemudian dibawa oleh fungsi api.createThread. api.createThread akan mengirimkan data title, body, category sebagai request body ke API dan mengembalikan data thread. data thread kemudian diambil sebagai payload melalui fungsi action creator addThread yang akan digunakan untuk merubah state thread di reducer.

2. Buat berkas dengan nama reducer.js pada folder states/threads

```js
//threads/reducer.js
import { ActionType } from './action';

function threadsReducer(threads = [], action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_THREADS:
      return action.payload.threads;
    case ActionType.ADD_THREAD:
      return [action.payload.thread, ...threads];
    default:
      return threads;
  }
}

export default threadsReducer;
```

threadsReducer akan mengembalikan nilai action.payload.threads ketika menerima action RECEIVE_THREADS. ketika action ADD_THREAD di dispatch, reducer akan mengembalikan nilai action.payload.thread beserta data threads.

3. Buat folder shared di src/states kemudian buat berkas action.js

```js
//states/shared/action.js
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import api from '../../utils/api';
import { receiveThreads } from '../threads/action';
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

export default asyncPopulateUsersAndThreads;
```

fungsi thunk asyncPopulateUsersAndThreads akan melakukan fetching data API users dan threads melalui fungsi api.getAllUsers dan api.getAllThreads. Data yang diperoleh kemudian dimasukan ke dalam payload oleh fungsi action creator receiveUsers dan receiveThreads. Sehingga ketika fungsi thunk tersebut di dispatch maka kita akan mendapatkan data users dan threads.

4. Tambahkan threadsReducer ke store.js

```js
//states/store.js
import { configureStore } from '@reduxjs/toolkit';
import { loadingBarReducer } from 'react-redux-loading-bar';
import usersReducer from './users/reducer';
import authUserReducer from './authUser/reducer';
import isPreloadReducer from './isPreload/reducer';
import threadsReducer from './threads/reducer';

const store = configureStore({
  reducer: {
    users: usersReducer,
    authUser: authUserReducer,
    isPreload: isPreloadReducer,
    loadingBar: loadingBarReducer,
    threads: threadsReducer,
  },
});

export default store;
```

### Membuat Komponen Threads

1. Buat berkas dengan nama ThreadItem.jsx pada folder src/components

```js
//components/ThreadItem.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { FaReply } from 'react-icons/fa';
import { FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import postedAt from '../utils';

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
}) {
  const navigate = useNavigate();

  const onThreadClick = () => {
    navigate(`/threads/${id}`);
  };

  const onThreadPress = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      navigate(`/threads/${id}`);
    }
  };

  return (
    <div
      className="thread-item"
      role="button"
      tabIndex={0}
      onClick={onThreadClick}
      onKeyDown={onThreadPress}
    >
      <p className="thread-item__category">#{category}</p>
      <article className="thread-item__info">
        <h2>{title}</h2>
        <p>{body}</p>
      </article>
      <div className="thread-item__detail">
        <FiThumbsUp />
        <span>{upVotesBy.length}</span>
        <FiThumbsDown />
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
  body: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  totalComments: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  user: PropTypes.objectOf(PropTypes.string).isRequired,
  upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  downVotesBy: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string))
    .isRequired,
};
```

Komponen ThreadItem menerima props berupa data thread yang telah di iterasi menggunakan method map. props user diambil dari users.id di cocokan dengan ownerId menggunakan method find. Pada ThreadItem kita juga membuat handle function untuk event klik dan event keypress pada element. Ketika elemen ThreadItem di klik maka akan mengarahkan ke halaman detail.

2. Buat berkas ThreadList pada folder src/components

```js
//components/ThreadList.jsx
import React from 'react';
import PropTypes from 'prop-types';
import ThreadItem from './ThreadItem';

function ThreadList({ threads }) {
  return (
    <div className="thread-list">
      {threads.map((thread) => (
        <ThreadItem key={thread.id} {...thread} />
      ))}
    </div>
  );
}

export default ThreadList;

ThreadList.propTypes = {
  threads: PropTypes.arrayOf(PropTypes.objectOf).isRequired,
};
```

Komponen ThreadList akan menerima props berupa threads. Data threads tersebut kemudian dilakukan iterasi melalui method map. Setiap iterasi akan me-render komponen ThreadItem dan diberikan props thread. Fungsi komponen ini adalah sebagai Container dari ThreadItem.

3. Buat berkas HomePage.jsx pada folder src/pages

```js
//pages/HomePage.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ThreadList from '../components/ThreadList';
import asyncPopulateUsersAndThreads from '../states/shared/action';

function HomePage() {
  const threads = useSelector((states) => states.threads);
  const users = useSelector((states) => states.users);
  const authUser = useSelector((states) => states.authUser);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncPopulateUsersAndThreads());
  }, [dispatch]);

  const threadList = threads.map((thread) => ({
    ...thread,
    user: users.find((user) => user.id === thread.ownerId),
    authUser: authUser.id,
  }));

  return (
    <section className="home-page">
      <ThreadList threads={threadList} />
    </section>
  );
}

export default HomePage;
```

Pada Komponen HomePage, kita mengambil state threads, users, dan authUser menggunakan hook useSelector. Data dari threads & users akan di fetch menggunakan fungsi thunk asyncPopulateUsersAndThreads, fungsi thunk ini kita jalankan di dalam useEffect. Sehingga ketika dilakukan render komponen HomePage, asyncPopulateUsersAndThreads akan melakukan proses asynchronous fetching data.
Data threads kemudian kita lakukan iterasi, kita juga mengambil data user dan data authUser untuk dimasukan ke dalam variabel threadList.
Data threadList tersebut terakhir kita masukan ke dalam props threads pada komponen ThreadList.
Halaman HomePage sudah selesai, selanjutnya kita dapat menambahkannya ke dalam Komponen App.

## Komponen App - Menambahkan HomePage

Pada pembahasan sebelumnya kita belum dapat melakukan login dikarenakan belum terdapat halaman utama. Kita akan menambahkan komponen HomePage agar ketika pengguna login, maka halaman homepage akan ditampilkan.

```js
//src/App.jsx
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  MdDeveloperMode,
  MdOutlineBrightnessLow,
  MdOutlineDarkMode,
} from 'react-icons/md';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';


function App() {
  const authUser = useSelector((states) => states.authUser);
  const isPreload = useSelector((states) => states.isPreload);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncPreloadProcess());
  }, [dispatch]);

  if (isPreload) {
    return null;
  }


  if (authUser === null) {
    return (
          <header className="app-header">
            <div className="app-logo">
              <MdDeveloperMode style={{ fontSize: '64px' }} />
              <h1>Forum App</h1>
            </div>
          </header>
          <main>
            <Routes>
              <Route path="/*" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </main>
    );
  }

    return (
        <header className="app-header">
            <div className="app-logo">
            <MdDeveloperMode style={{ fontSize: '64px' }} />
            <h1>Forum App</h1>
            </div>
        </header>
        <main>
            <Routes>
            <Route path="/" element={<HomePage />} />
            </Routes>
        </main>
        );
}

export default App;
```

Ketika pengguna telah login, maka authUser akan memiliki nilai sehingga komponen HomePage akan di-render. Ketika komponen HomePage di-render ulang, maka hook useEffect akan menjalankan fungsi thunk asyncPreloadProcess. asyncPreloadProcess akan mengambil data authUser sehingga pengguna akan tetap dalam status login.

## Fitur Menambahkan Thread

Kita telah menuliskan action dan reducer untuk menambahkan thread pada berkas states/threads/action.js & states/threads/reducer.js, sehingga kita hanya perlu membuat komponen Input dan Halaman Input.

### Membuat Komponen AddThread

1. Buat berkas dengan nama ThreadInput.jsx pada folder src/component

```js
//components/ThreadInput.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import useInput from '../hooks/useInput';

function ThreadInput({ addThread }) {
  const [title, onTitleChange] = useInput('');
  const [body, onBodyChange] = useInput('');
  const [category, onCategoryChange] = useInput('');
  const navigate = useNavigate();

  function addthread() {
    addThread({ title, body, category });
    navigate('/');
  }

  return (
    <>
      <h3>Buat Diskusi Baru</h3>
      <form className="thread-input">
        <input
          type="text"
          value={title}
          onChange={onTitleChange}
          placeholder="Judul"
          required
        />
        <input
          type="text"
          value={category}
          onChange={onCategoryChange}
          placeholder="Kategory"
        />
        <textarea type="text" value={body} onChange={onBodyChange} required />
        <button type="button" onClick={addthread}>
          Buat
        </button>
      </form>
    </>
  );
}

export default ThreadInput;

ThreadInput.propTypes = {
  addThread: PropTypes.func.isRequired,
};
```

Komponen ThreadInput akan menerima props fungsi addThread. kita juga membuat fungsi handle submit dengan nama addthread (huruf kecil). fungsi addthread akan mengirimkan data title, body, category dari form input ke fungsi props addThread. Ketika submit berhasil dilakukan, selain memanggil fungsi addThread, pengguna akan langsung menuju halaman home ('/') dengan memanggil fungsi navigate.

2. Buat berkas dengan nama AddThreadPage.jsx pada folder src/pages

```js
//src/pages/AddThreadPage.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { asyncAddThread } from '../states/threads/action';
import ThreadInput from '../components/ThreadInput';

function AddThreadPage() {
  const dispatch = useDispatch();

  /* menambahkan comment */
  const onAddThread = ({ title, body, category }) => {
    dispatch(asyncAddThread({ title, body, category }));
  };

  return (
    <section className="input-page">
      <ThreadInput addThread={onAddThread} />
    </section>
  );
}

export default AddThreadPage;
```

Komponen AddThreadPage akan memberikan props addThread dengan value onAddThread ke komponen ThreadInput. fungsi onAddThread akan menerima data title, body, category dan men-dispatch fungsi thunk asyncAddThread dengan argumen title, body, category. Sehingga ketika thread ditambahkan maka data tersebut akan dikirim ke API serta diupdate melalui reducer.

## Komponen App - Menambahkan AddThreadPage

Tambahkan AddThreadPage yang telah kita buat ke App.js

```js
//src/App.jsx
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  MdDeveloperMode,
  MdOutlineBrightnessLow,
  MdOutlineDarkMode,
} from 'react-icons/md';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import AddThreadPage from './pages/AddThreadPage';


function App() {
  const authUser = useSelector((states) => states.authUser);
  const isPreload = useSelector((states) => states.isPreload);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncPreloadProcess());
  }, [dispatch]);

  if (isPreload) {
    return null;
  }


  if (authUser === null) {
    return (
          <header className="app-header">
            <div className="app-logo">
              <MdDeveloperMode style={{ fontSize: '64px' }} />
              <h1>Forum App</h1>
            </div>
          </header>
          <main>
            <Routes>
              <Route path="/*" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </main>
    );
  }

    return (
        <header className="app-header">
            <div className="app-logo">
            <MdDeveloperMode style={{ fontSize: '64px' }} />
            <h1>Forum App</h1>
            </div>
        </header>
        <main>
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/threads" element={<AddThreadPage />} />
            </Routes>
        </main>
        );
}

export default App;
```

Halaman tersebut dapat diakses ketika kita menambahkan /threads pada alamat browser. Kita akan membuat tombol aksesnya nanti pada bagian membuat navigasi.
Sejauh ini kita telah membuat halaman Login, Register, Homepage dan menambahkan thread. Selanjutnya kita akan membuat fitur detail thread.

## Fitur Detail Thread

Kita telah membuat mekanisme ketika elemen ThreadItem di klik maka akan mengarahkan ke halaman detail. Kita akan membuat state threadDetail yang menampilkan detail dari thread.

### Membuat action & reducer threadDetail

1. Buat folder threadDetail di src/states dan buat berkas action.js di dalamnya

```js
//threadDetail/action.js
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import api from '../../utils/api';

const ActionType = {
  RECEIVE_THREAD_DETAIL: 'RECEIVE_THREAD_DETAIL',
  CLEAR_THREAD_DETAIL: 'CLEAR_THREAD_DETAIL',
  COMMENT_THREAD_DETAIL: 'COMMENT_THREAD_DETAIL',
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

Cukup kompleks bukan? hal ini dikarenakan kita juga akan membuat fitur mengomentari detail thread di dalamnya.
fungsi thunk asyncReceiveThreadDetail akan menerima data threadId, threadId tersebut lalu akan dibawa oleh fungsi api.getThreadDetail untuk mendapatkan data threadDetail. Data threadDetail tersebut kemudian kita berikan sebagai payload melalui action creator receiveThreadDetail. Kita juga men-dispatch action clearThreadDetail untuk menghapus detail thread lama yang sudah ditampilkan sebelumnya.
fungsi thunk asyncAddComment akan menerima data berupa id dan content. Data tersebut kemudian akan dibawa oleh fungsi api.createComment untuk mendapatkan data comment. Data comment tersebut kemudian akan kita berikan sebagai payload melalui action creator addComment.

2. Buat berkas dengan nama reducer.js pada folder states/threadDetail

```js
//states/threadDetail/reducer.js
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
    default:
      return threadDetail;
  }
}

export default threadDetailReducer;
```

threadDetailReducer akan mengembalikan nilai action.payload.threadDetail ketika menerima action RECEIVE_THREAD_DETAIL.
Ketika menerima action CLEAR_THREAD_DETAIL maka reducer akan menghapus threadDetail.
Ketika menerima action COMMENT_THREAD_DETAIL, reducer akan mengembalikan data threadDetail, beserta properti comments yang telah ditambahkan dengan action.payload.comment.

4. Tambahkan threadDetailReducer ke store.js

```js
//states/store.js
import { configureStore } from '@reduxjs/toolkit';
import { loadingBarReducer } from 'react-redux-loading-bar';
import usersReducer from './users/reducer';
import authUserReducer from './authUser/reducer';
import isPreloadReducer from './isPreload/reducer';
import threadsReducer from './threads/reducer';
import threadDetailReducer from './threadDetail/reducer';

const store = configureStore({
  reducer: {
    users: usersReducer,
    authUser: authUserReducer,
    isPreload: isPreloadReducer,
    loadingBar: loadingBarReducer,
    threads: threadsReducer,
    threadDetail: threadDetailReducer,
  },
});

export default store;
```

### Membuat Komponen ThreadDetail

Halaman detail page akan terdiri dari komponen thread detail, comment input serta comment list.

1. Buat berkas dengan nama ThreadDetail.jsx pada folder src/components

```js
//components/ThreadDetail.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import postedAt from '../utils';

function ThreadDetail({
  title,
  body,
  category,
  createdAt,
  upVotesBy,
  downVotesBy,
  owner,
}) {
  return (
    <div className="thread-detail">
      <p className="thread-item__category">#{category}</p>
      <article className="thread-detail__info">
        <h2>{title}</h2>
        <p>{body}</p>
      </article>
      <div className="thread-detail__detail">
        <FiThumbsUp />
        <span>{upVotesBy.length}</span>
        <FiThumbsDown />
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
  body: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  downVotesBy: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string))
    .isRequired,
  owner: PropTypes.objectOf(PropTypes.string).isRequired,
};
```

Komponen ThreadDetail akan menerima props title, body, category, createdAt, upVotesBy, downVotesBy dan owner. Dimana data dari props tersebut akan di-render pada komponen.

2. Buat berkas dengan nama CommentInput.jsx pada folder components

```js
//components/CommentInput.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';

function CommentInput({ addComment }) {
  const [content, setContent] = useState('');

  function addcomment() {
    addComment(content);
    setContent('');
  }

  function handleChange({ target }) {
    setContent(target.value);
  }

  return (
    <section className="add-comment">
      <h3>Beri Komentar</h3>
      <div className="comment-input">
        <textarea
          type="text"
          placeholder="Apa Komentarmu terhadap topik di atas?"
          value={content}
          onChange={handleChange}
          required
        />
        <button type="submit" onClick={addcomment}>
          Kirim
        </button>
      </div>
    </section>
  );
}

export default CommentInput;

CommentInput.propTypes = {
  addComment: PropTypes.func.isRequired,
};
```

Komponen CommentInput menerima props fungsi addComment. Komponen ini akan me-render elemen text area dan button. Ketika user mensubmit komentar, maka fungsi addcomment (huruf kecil) akan dipanggil. fungsi addcomment akan memanggil fungsi props addComment, dimana addComment akan membawa nilai dari content sebagai argumen fungsi.

3. Buat berkas dengan nama CommentItem.jsx pada folder components

```js
//components/CommentItem.jsx
import React from 'react';
import { FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import PropTypes from 'prop-types';
import postedAt from '../utils';

function CommentItem({ content, createdAt, upVotesBy, downVotesBy, owner }) {
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
        <FiThumbsUp />
        <p>{upVotesBy.length} </p>

        <FiThumbsDown />
        <p> {downVotesBy.length}</p>
      </footer>
    </div>
  );
}

export default CommentItem;

CommentItem.propTypes = {
  content: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  downVotesBy: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string))
    .isRequired,
  owner: PropTypes.objectOf(PropTypes.string).isRequired,
};
```

Komponen CommentItem menerima props content, createdAt, upVotesBy, downVotesBy, dan owner. Data tersebuat kemudian di-render pada komponen.

4. Buat berkas dengan nama CommentList.jsx pada folder components

```js
//components/CommentList.jsx
import React from 'react';
import PropTypes from 'prop-types';
import CommentItem from './CommentItem';

function CommentList({ comments }) {
  return (
    <section className="comment-list">
      <h4>{`Komentar (${comments.length})`}</h4>
      <div className="comment-list__item">
        {comments.map((comment) => (
          <CommentItem key={comment.id} {...comment} />
        ))}
      </div>
    </section>
  );
}

export default CommentList;

CommentList.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.objectOf).isRequired,
};
```

Komponen CommentList menerima props comments, data comments tersebut kemudian dilakukan iterasi dengan method map. Setiap iterasi yang dilakukan akan me-render komponen CommentItem dan diberikan props comment.

5. Buat berkas dengan nama DetailPage pada folder src/pages

```js
//src/pages/DetailPage.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  asyncAddComment,
  asyncReceiveThreadDetail,
} from '../states/threadDetail/action';
import ThreadDetail from '../components/ThreadDetail';
import CommentList from '../components/CommentList';
import CommentInput from '../components/CommentInput';

function DetailPage() {
  const { id } = useParams();

  const threadDetail = useSelector((states) => states.threadDetail);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncReceiveThreadDetail(id));
  }, [dispatch, id]);

  if (!threadDetail) {
    return null;
  }

  /* menambahkan comment */
  const onAddComment = (content) => {
    dispatch(asyncAddComment({ id, content }));
  };

  return (
    <section className="detail-page">
      <ThreadDetail {...threadDetail} />
      <CommentInput addComment={onAddComment} />
      <CommentList comments={threadDetail.comments} />
    </section>
  );
}

export default DetailPage;
```

Pada Komponen DetailPage, kita mendapatkan data id dari parameter url menggunakan hook useParams. Kita juga mengambil state threadDetail menggunakan hook useSelector. Data dari threadDetail akan diambil dengan men-dispatch asyncReceiveThreadDetail dengan argumen id, di dalam fungsi useEffect.
Kita juga membuat fungsi onnAddComment, fungsi ini akan men-dispatch asyncAddComment dengan argumen id, dan content.
Data threadDetail kemudian kita masukan sebagai props pada komponen ThreadDetail, fungsi onAddComment kita masukan sebagai props addComment pada komponen CommentInput. Terakhir kita masukan data threadDetail.comments sebagai props comment pada komponent CommentList.

Dengan selesainya halaman detail, fungsionalitas inti dari aplikasi sudah terbentuk. Pengguna dapat melakukan login/register, halaman berisi daftar thread dapat ditampilkan dan melihat detail thread dan pengguna juga dapat menambahkan thread baru.

Selanjutnya kita akan menambahkan fitur mengubah tema. Kita akan memanfaatkan dependency styled Component dan style theming.

## Fitur Mengubah Tema

Kita akan membuat fitur dimana user dapat mengubah tema halaman menjadi mode terang ataupun mode gelap. kita membutuhkan state yang kita namakan darkTheme.

### Membuat action & reducer darkTheme

1. Buat folder theme di src/states dan buat berkas action.js

```js
//states/theme/action.js
const ActionType = {
  TOGGLE_DARKTHEME: 'TOGGLE_DARKTHEME',
};

function toggleDarkTheme() {
  return {
    type: ActionType.TOGGLE_DARKTHEME,
  };
}

function toggleDarkThemeThunk() {
  return (dispatch, getState) => {
    dispatch(toggleDarkTheme());
    const { darkTheme } = getState();
    localStorage.setItem('theme', JSON.stringify(darkTheme));
  };
}

export { ActionType, toggleDarkTheme, toggleDarkThemeThunk };
```

fungsi thunk toggleDarkThemeThunk akan men-dispatch action toggleDarkTheme yang akan mengubah nilai kebalikan dari state darkTheme. Kita juga mengambil state darkTheme dan kemudian menyimpannya ke dalam localStorage agar tema yang kita gunakan tetap tersimpan walaupun browser telah direfresh.

2. Buat berkas reducer.js pada folder states/theme

```js
//states/theme/reducer.js
import { ActionType } from './action';

function themeReducer(darkTheme = false, action) {
  switch (action.type) {
    case ActionType.TOGGLE_DARKTHEME:
      return !darkTheme;
    default:
      return darkTheme;
  }
}

export default themeReducer;
```

fungsi themeReducer akan mengubah nilai dari state darkTheme menjadi kebalikannya, yakni jika nilai awalnya false menjadi true dan kebalikannya.

3. Masukan themeReducer di atas ke berkas store.js

```js
//states/store.js
import { configureStore } from '@reduxjs/toolkit';
import { loadingBarReducer } from 'react-redux-loading-bar';
import usersReducer from './users/reducer';
import authUserReducer from './authUser/reducer';
import isPreloadReducer from './isPreload/reducer';
import threadsReducer from './threads/reducer';
import threadDetailReducer from './threadDetail/reducer';
import themeReducer from './theme/reducer';

const store = configureStore({
  reducer: {
    users: usersReducer,
    authUser: authUserReducer,
    isPreload: isPreloadReducer,
    threads: threadsReducer,
    threadDetail: threadDetailReducer,
    darkTheme: themeReducer,
    loadingBar: loadingBarReducer,
  },
});

export default store;
```

### Membuat Styled Component

1. Buat folder styledComponents di src dan buat styled Component dengan nama Container.jsx

```js
//src/styledComponents/Container.jsx
import styled from 'styled-components';
import theme from 'styled-theming';

export const backgroundColor = theme('theme', {
  light: '#fff',
  dark: '#2d2d2d',
});

export const textColor = theme('theme', {
  light: '#000',
  dark: '#fff',
});

export const Container = styled.div`
  min-height: 100vh;
  font-family: 'Open Sans', sans-serif;

  background-color: ${backgroundColor};
  color: ${textColor};
`;
```

Pada Komponen Container nilai dari background-color dan color akan mengacu pada nilai tema yang diberikan. nilai tema tersebut berdasarkan pada fungsi theme yang kita import dari style-theming, dimana ketika light nilai background color adalah #fff dan dark adalah #2d2d2d. Begitu juga pada nilai text color.

2. Buat berkas dengan nama DarkThemeProvider.jsx pada folder styledComponents

```js
//styledComponents/DarkThemeProvider.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components';

function DarkThemeProvider({ children }) {
  const darkTheme = useSelector((states) => states.darkTheme);
  const themeKey = localStorage.getItem('theme');
  const storedTheme = themeKey ? JSON.parse(themeKey) : darkTheme;

  return (
    <ThemeProvider theme={{ theme: storedTheme ? 'dark' : 'light' }}>
      {children}
    </ThemeProvider>
  );
}

export default DarkThemeProvider;
```

Pada code di atas, kita membuat komponen DarkThemeProvider dengan props children. props children merupakan data atau elemen yang berada pada opening tag dan closing tag komponen.
Pada komponen DarkThemeProvider kita mengambil state darkTheme menggunakan hook useSelector. Kita juga mengambil data tema yang telah tersimpan di local storage.
Komponen DarkThemeProvider akan mengembalikan ThemeProvider dengan nilai props theme. Sehingga tema yang kita tentukan akan diaplikasikan ke komponen yang berada dalam cakupan DarkThemeProvider.

## Membuat Navigasi

Komponen Navigation akan me-render elemen navigasi dimana pengguna dapat menuju ke halaman daftar thread, menambahkan thread dan melakukan sign-out.

1. Buat berkas dengan nama Navigation.jsx pada folder components

```js
//components/Navigation.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  FaRegPlusSquare,
  FaRegShareSquare,
  FaRegComments,
} from 'react-icons/fa';

function Navigation({ signOut }) {
  return (
    <div className="navigation">
      <nav className="navigation-button">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <button type="button" title="Home">
            <FaRegComments />
          </button>
          <p>Threads</p>
        </Link>
        <Link to="/threads" style={{ textDecoration: 'none' }}>
          <button type="button" title="New Thread">
            <FaRegPlusSquare />
          </button>
          <p>Post Thread</p>
        </Link>
        <button
          className="sign-out"
          type="button"
          onClick={signOut}
          title="Sign-Out"
        >
          <FaRegShareSquare />
          <p className="sign-out__p">Sign out</p>
        </button>
      </nav>
    </div>
  );
}

export default Navigation;

Navigation.propTypes = {
  signOut: PropTypes.func.isRequired,
};
```

Pada Komponen Navigation menerima props fungsi signOut. Komponen ini akan me-render button dengan Link ke halaman home ("/"), menambahkan thread baru ("/threads") dan tombol sign-out.

## Membuat Loading Komponent

Komponen Loading akan me-render tampilan loading bar dari react-redux-loading-bar.

1. Buat berkas dengan nama Loading pada folder src/components

```js
//components/Loading.jsx
import React from 'react';
import LoadingBar from 'react-redux-loading-bar';

function Loading() {
  return (
    <div className="loading">
      <LoadingBar />
    </div>
  );
}

export default Loading;
```

Komponen Loading akan me-render komponen LoadingBar dari react-redux-loading-bar.

## Komponen App - Menambahkan DetailPage, AddThreadPage dan StyledComponent

1. Pada Komponen App.jsx tambahkan routing dan komponen DetailPage, AddThreadPage serta tambahkan juga Komponen Container dan DarkThemeProvider

```js
//src/App.jsx
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  MdDeveloperMode,
  MdOutlineBrightnessLow,
  MdOutlineDarkMode,
} from 'react-icons/md';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { asyncPreloadProcess } from './states/isPreload/action';
import { asyncUnsetAuthUser } from './states/authUser/action';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import Navigation from './components/Navigation';
import AddThreadPage from './pages/AddThreadPage';
import Loading from './components/Loading';
import { Container } from './styledComponents/Container';
import DarkThemeProvider from './styledComponents/DarkThemeProvider';
import { toggleDarkThemeThunk } from './states/theme/action';

function App() {
  const authUser = useSelector((states) => states.authUser);

  const isPreload = useSelector((states) => states.isPreload);

  const darkTheme = useSelector((states) => states.darkTheme);
  const themeKey = localStorage.getItem('theme');
  const storedTheme = themeKey ? JSON.parse(themeKey) : darkTheme;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncPreloadProcess());
  }, [dispatch]);

  const onSignOut = () => {
    dispatch(asyncUnsetAuthUser());
  };

  if (isPreload) {
    return null;
  }

  if (authUser === null) {
    return (
      <DarkThemeProvider>
        <Container>
          <header className="app-header">
            <div className="app-logo">
              <MdDeveloperMode style={{ fontSize: '64px' }} />
              <h1>Forum App</h1>
              <button
                type="button"
                className="toggle-theme"
                onClick={() => dispatch(toggleDarkThemeThunk())}
              >
                {storedTheme ? (
                  <MdOutlineBrightnessLow />
                ) : (
                  <MdOutlineDarkMode />
                )}
              </button>
            </div>
          </header>
          <Loading />
          <main>
            <Routes>
              <Route path="/*" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </main>
        </Container>
      </DarkThemeProvider>
    );
  }

  return (
    <DarkThemeProvider>
      <Container>
        <header className="app-header">
          <div className="app-logo">
            <MdDeveloperMode style={{ fontSize: '64px' }} />
            <h1>Forum App</h1>
            <button
              type="button"
              className="toggle-theme"
              onClick={() => dispatch(toggleDarkThemeThunk())}
            >
              {storedTheme ? <MdOutlineBrightnessLow /> : <MdOutlineDarkMode />}
            </button>
          </div>
        </header>
        <Loading />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/threads/:id" element={<DetailPage />} />
            <Route path="/threads" element={<AddThreadPage />} />
          </Routes>
        </main>

        <footer>
          <Navigation signOut={onSignOut} />
        </footer>
      </Container>
    </DarkThemeProvider>
  );
}

export default App;
```

Pada Komponen App.jsx kita menambahkan fungsi onSignOut, fungsi ini akan menghapus data authUser. Kita juga membuat tombol untuk mengganti tema, ketika tombol tersebut diklik maka akan men-dispatch fungsi thunk toggleDarkThemeThunk.

Jalankan aplikasi menggunakan command npm run dev. Aplikasi seharusnya sudah dapat berjalan dengan baik. Walaupun belum sempurna seperti fitur mem-vote thread dan komentar. Kita akan menyempurnakan aplikasi pada pembahasan selanjutnya.

Sumber: https://www.dicoding.com/
https://levelup.gitconnected.com/implementing-a-dark-theme-toggle-with-react-redux-and-styled-components-e637c4d41e2f
