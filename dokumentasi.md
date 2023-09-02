# Forum App

Project Submission Dicoding React Expert.
Contoh Aplikasi:
https://dicoding-forum-app.vercel.app/
Rest API forum App dicoding:
https://forum-api.dicoding.dev/v1/#/

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

## Pengerjaan

## Membuat Costum Hooks

Kita akan membuat custom hook, fungsi ini akan menangani input form sehingga kita tidak perlu membuat useState dan input handler berulang pada tiap input komponen.
buat folder /src/hooks dan buat berkas dengan nama useInput.js

```js
//src/hooks/useInput.js
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

Ketika kita akan menggunakannya pada komponen kita dapat melakukan hal seperti berikut:

```js
//contoh penggunaan useInput
import useInput from '../hooks/useInput';

function RegisterInput({ register }) {
  const [name, onNameChange] = useInput('');
  const [id, onIdChange] = useInput('');
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
        value={id}
        onChange={onIdChange}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={onPasswordChange}
        placeholder="Password"
      />
      <button type="button" onClick={() => register({ name, id, password })}>
        Register
      </button>
    </form>
  );
}
```

## Fitur Registrasi Pengguna

Fitur ini akan mendaftarkan pengguna baru, user akan mendaftar pada aplikasi yang mana data tersebut akan digunakan pada saat Login.

### Membuat helper function Register

Buat folder dengan nama utils dan buat file api.js. api.js akan berisi helper function terkait dengan fungsi fetching API. file ini akan kita update dengan semakin banyaknya fitur yang kita tambahkan pada project.

```js
//utils/api.js
const api = (() => {
  const BASE_URL = 'https://forum-api.dicoding.dev/v1';

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
  /* fungsi helper yang akan ditambahkan nanti */
  return {
    register,
  };
})();

export default api;
```

fungsi register akan mengirimkan data berupa nama, email dan password. fungsi ini akan mengembalikan data user dengan properti id, name, email dan avatar.

### Membuat fitur Registrasi

1. Buat folder states/users dan buat berkas action.js.

```js
//states/users/action.js
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
    try {
      await api.register({ name, email, password });
    } catch (error) {
      alert(error.message);
    }
  };
}

export { ActionType, receiveUsers, asyncRegisterUser };
```

fungsi receiveUser merupakan action creator yang akan membawa data user ke dalam payload. fungsi ini akan kita gunakan pada fungsi thunk pada folder shared. Dimana akan menampilkan data users pada halaman Homepage.
fungsi asyncRegisterUser merupakan fungsi thunk, fungsi ini akan mengirimkan data registrasi name, email, password ke API menggunakan function api.register().

2. buat berkas reducer.js pada folder states/users

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

usersReducer akan mengubah state dari users berdasarkan action yang di-dispatch. Selanjutnya kita akan menambahkan reducer tersebut pada store.

3. Buat berkas dengan nama store.js pada folder src/states

```js
//states/store.js
import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './users/reducer';

const store = configureStore({
  reducer: {
    users: usersReducer,
  },
});

export default store;
```

berkas store ini akan kita update seiring berkembangnya aplikasi.

### Menyediakan store ke seluruh aplikasi

Store yang telah kita buat perlu kita masukan pada berkas src/index.js, berkas ini merupakan parent dari keseluruhan aplikasi. Agar semua komponen dapat menggunakan state yang telah kita buat, kita perlu menyediakan provider dengan props store

```js
//src/index.js
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import store from './states/store';

import './styles/style.css';

const root = createRoot(document.getElementById('root'));

// TODO: wrap App with store provider
root.render(
  <Provider store={store}>
    <StrictMode>
      <App />
    </StrictMode>
  </Provider>
);
```

### Membuat Komponen Registrasi

1. Buat folder components di dalam folder src kemudian buat berkas dengan nama RegisterInput.js

```js
//components/RegisterInput.js
import React from 'react';
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
        placeholder="Username"
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
```

Komponen RegisterInput akan menerima props fungsi register dari Register Page.

2. Buat folder pages di dalam folder src dan buat berkas RegisterPage.js

```js
//scr/pages/RegisterPage.js
import React from 'react';
import { IoEarthOutline } from 'react-icons/io5';
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
      <header className="register-page__hero">
        <h1>
          <IoEarthOutline />
        </h1>
      </header>
      <article className="register-page__main">
        <h2>Create your account</h2>
        <RegisterInput register={onRegister} />

        <p>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </article>
    </section>
  );
}

export default RegisterPage;
```

Pada Komponen RegisterPage, kita membuat fungsi onRegister yang akan men-dispatch asyncRegisterUser dengan data name, email, password. Fungsi tersebut kemudian kita masukan dalam props register yang akan digunakan oleh Komponen RegisterInput. Kita juga menggunakan React Router yakni useNavigate() dan Komponen Link. useNavigate() akan secara otomatis mengarahkan kita ke homePage ('/') ketika proses registrasi berhasil. Kita juga menyediakan Link ke halaman Login jika pengguna telah memiliki user.

Note: fungsi useNavigate(), Navigate dan Link perlu anda comment terlebih dahulu, agar dapat me-render aplikasi dan mencoba fitur tersebut. fungsi di atas merupakan bagian dari react router yang akan kita sempurnakan nanti.

### Memasukan Komponen RegisterPage ke App.js

Untuk Dapat menggunakan RegisterPage kita perlu memasukannya pada komponen App. Komponen ini akan kita update dengan berkembangnya aplikasi.

```js
//src/App.js
import React from 'react';
import { MdDeveloperMode } from 'react-icons/md';
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
      <header className="register-page__hero">
        <h1>
          <MdDeveloperMode />
        </h1>
      </header>
      <article className="register-page__main">
        <h2>Create your account</h2>
        <RegisterInput register={onRegister} />

        <p>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </article>
    </section>
  );
}

export default RegisterPage;
```

Jalankan aplikasi menggunakan command npm run start, dan coba register menggunakan nama dan email baru. Pastikan tidak terdapat error yang muncul.

## Fitur Login

Fitur Login pada aplikasi digunakan agar pengguna dapat menggunakan fitur-fitur pada aplikasi seperti membuat thread, like thread membuat comment.

### Membuat helper function Login

Pada berkas /utils/api.js kita akan menambahkan helper function untuk fitur login seperti berikut:

```js
//utils/api.js
const api = (() => {
  const BASE_URL = 'https://forum-api.dicoding.dev/v1';

  /* fungsi register disembunyikan */

  //menyimpan access token ke local storage
  function putAccessToken(token) {
    localStorage.setItem('accessToken', token);
  }
  //mengambil access token dari local storage
  function getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  //melakukan fetching data dengan authorization token
  async function _fetchWithAuth(url, options = {}) {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
  }

  //mengirimkan request body login ke api dan mendapatkan token
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

  //mengambil data authUser
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
})();
```

Pada fungsi login, kita mengirimkan data email dan password yang telah kita registrasikan sebelumnya. fungsi login ini akan mengembalikan token yang akan kita gunakan untuk memakai fitur seperti create thread, create comment dll. fungsi \_fetchWithAuth akan melakukan fetching dengan authorization token. fungsi getOwnProfile akan mengembalikan data user yang nantinya akan kita gunakan sebagai state authUser.

### Membuat fitur Login

1. Buat folder authUser di src/states dan buat berkas action.js

```js
//authUser/action.js
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
    try {
      const token = await api.login({ email, password });
      api.putAccessToken(token);
      const authUser = await api.getOwnProfile();
      dispatch(setAuthUser(authUser));
    } catch (error) {
      alert(error.message);
    }
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

fungsi asyncSetAuthUser akan mengirimkan data login ke API kemudian menerima token, token tersebut kemudian akan disimpan pada local storage melalui fungsi api.putAccessToken. fungsi api.getOwnProfile() akan mengembalikan data AuthUser yang kemudian kita berikan ke action setAuthUser sebagai payload.
fungsi asyncUnsetAuthUser akan men-dispatch action unsetAuthUser, kemudian menghapus access token dari local storage dengan fungsi api.putAccessToken('').

2. Buat file reducer.js pada folder states/authUser

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

fungsi authUserReducer akan mengubah state authUser berdasarkan action yang diterima, action SET_AUTH_USER akan menambahkan payload yakni data authUser yang telah kita terima dari API. action UNSET_AUTH_USER akan mengubah state authUser menjadi null.

3. Masukan reducer yang telah kita buat ke store.js

```js
//states/store.js
import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './users/reducer';
import authUserReducer from './authUser/reducer';

const store = configureStore({
  reducer: {
    users: usersReducer,
    authUser: authUserReducer,
  },
});

export default store;
```

### Membuat Komponen Login

1. Buat berkas dengan nama LoginInput.js pada folder src/components

```js
//components/LoginInput.js
import React from 'react';
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
        placeholder="Username"
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
```

Komponen LoginInput akan menerima props fungsi login dari LoginPage.

2. Buat berkas LoginPage.js di dalam folder src/pages

```js
//pages/LoginPage.js
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
        <h2>Login to Post a thread.</h2>

        <LoginInput login={onLogin} />
        <p>
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </article>
    </section>
  );
}

export default LoginPage;
```

Pada LoginPage.js kita akan membuat fungsi dengan nama onLogin, onLogin akan menerima argumen email, password dari Komponen LoginInput. onLogin kemudian akan men-dispatch asyncSetAuthUser. Sehingga ketika login berhasil dilakukan , data authUser akan tersedia untuk digunakan pada aplikasi.

## Fitur Preload

Sejauh ini kita telah membuat 2 buah state, yakni authUser dan users. authUser berperan untuk menyimpan profile pengguna dan users untuk menyimpan profil dari berbagai user.
selanjutnya kita akan membuat proses preload, proses ini digunakan untuk mendapatkan pengguna terautentifikasi dan menetapkan nilai pada authUser. Kita akan membuat state isPreload dengan default nilai true dan akan bernilai false setelah proses preload selesai.

### Membuat fitur preload

1. Buat folder dengan nama isPreload pada src/states dan buat berkas action.js

```js
//isPreload/action.js
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
import usersReducer from './users/reducer';
import authUserReducer from './authUser/reducer';
import isPreloadReducer from './isPreload/reducer';

const store = configureStore({
  reducer: {
    users: usersReducer,
    authUser: authUserReducer,
    isPreload: isPreloadReducer,
  },
});

export default store;
```

## Mengupdate Komponen App - Routing

Kita telah membuat state authUser & isPreload. State tersebut akan kita manfaatkan dalam menerapkan routing pada aplikasi kita.

1. Tambahkan Komponen BrowserRouter dari react router sebagai parent dari komponen App pada scr/index.js

```js
//scr/index.js
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import store from './states/store';
import { BrowserRouter } from 'react-router-dom';

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

Dengan membungkus Komponen App dengan BrowserRouter, kita dapat menerapkan routing pada App.js

2. Impor fungsi thunk asyncPreloadProcess dari isPreload/action.js dan asyncUnsetAuthUser dari authUser/action.js, Routes & route dari react router, serta fungsi seperti useEffect, useSelector & useDispatch.

```js
//scr/App.js
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { asyncPreloadProcess } from './states/isPreload/action';
import { asyncUnsetAuthUser } from './states/authUser/action';

function App() {
  const { authUser = null, isPreload = false } = useSelector(
    (states) => states
  );

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
      <>
        <main>
          <Routes>
            <Route path="/*" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
      </>
    );
  }
  /* Routing lain akan ditambahkan */
}

export default App;
```

Pada code di atas, kita menggambil state authUser dan isPreload menggunakan hook useSelector(). nilai dari authUser akan mengkondisikan Komponen apa yang akan di-render. Kita juga mengambil data authUser menggunakan asyncPreloadProcess di dalam fungsi useEffect. fungsi onSignOut akan digunakan untuk melakukan logout dari aplikasi. Untuk sekarang kita hanya akan melakukan routing dan menampilkan komponen LoginPage & RegisterPage saja.

Jalankan npm run start dan pastikan komponen Login muncul pada halaman serta komponen register jika link pada masing-masing komponen diklik.

## Fitur Threads

fitur selanjutnya yang akan kita buat yakni fitur menampilkan kumpulan threads, kita akan menggunakan halaman homePage untuk menampilkan data dari threads. Kita juga akan memberikan fitur posting untuk menambahkan data thread ke server.

### Membuat helper function threads

Kita akan menambahkan helper function getAllUsers, getAllThreads, createThread. Tambahkan code berikut pada api.js

```js
//utlis/api.js
const api = (() => {
  const BASE_URL = 'https://forum-api.dicoding.dev/v1';
  /* fungsi helper register & login disembunyikan */

  /* fungsi helper threads & detail thread */
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

  /* helper upvote, downvote thread & comment serta see Leaderboard menyusul */

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
  };
})();

export default api;
```

masih terdapat beberapa helper function yang akan kita tambahkan nanti yakni upvote, downvote thread & comment.

### Membuat fitur menampilkan threads & users

1. Buat folder dengan nama threads dan buat berkas dengan nama action.js

```js
//states/threads/action.js
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
    try {
      const thread = await api.createThread({ title, body, category });
      dispatch(addThread(thread));
    } catch (error) {
      alert(error.message);
    }
  };
}

export { ActionType, receiveThreads, addThread, asyncAddThread };
```

action creator receiveThreads akan kita gunakan pada fungsi thunk gabungan. fungsi asyncAddThread akan menerima data title, body , category yang nantinya akan dikirimkan ke API melalui fungsi helper api.createThread, data thread yang telah dikirimkan akan dibawa oleh action creator addThread.

2. Buat juga berkas reducer pada folder threads

```js
//threads/reducer.js
import { ActionType } from './action';

function threadsReducer(threads = [], action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_THREADS:
      return action.payload.threads;
    case ActionType.ADD_THREADS:
      return [action.payload.thread, ...threads];
    default:
      return threads;
  }
}

export default threadsReducer;
```

threadReducer akan mengembalikan data threads jika menerima action RECEIVE_THREADS, jika menerima action ADD_THREAD akan mengembalikan data thread, beserta state dari threads.
Selanjutnya kita akan membuat fungsi thunk untuk mengambil data users dan all threads. 3. Buat folder dengan nama shared di states dan buat berkas action.js

```js
//states/shared/action.js
import api from '../../utils/api';
import { receiveThreads } from '../threads/action';
import { receiveUsers } from '../users/action';

function asyncPopulateUsersAndThreads() {
  return async (dispatch) => {
    try {
      const users = await api.getAllUsers();
      const talks = await api.getAllThreads();

      dispatch(receiveUsers(users));
      dispatch(receiveThreads(threads));
    } catch (error) {
      alert(error.message);
    }
  };
}

export { asyncPopulateUsersAndThreads };
```

fungsi thunk ini akan kita gunakan pada halaman HomePage untuk mengambil data users dan threads.

3. Tambahkan juga threads ke store. Sehingga berkas store akan menjadi seperti berikut:

```js
//store.js
import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './users/reducer';
import authUserReducer from './authUser/reducer';
import isPreloadReducer from './isPreload/reducer';
import threadsReducer from './threads/reducer';

const store = configureStore({
  reducer: {
    users: usersReducer,
    authUser: authUserReducer,
    isPreload: isPreloadReducer,
    threads: threadsReducer,
  },
});

export default store;
```

### Membuat Komponen Threads

Kita akan membuat komponen threads yang akan menampilkan users dan data threads. Komponen yang akan kita buat yakni ThreadItem, ThreadList. ThreadItem akan menampilkan data thread dari berbagai user, threadList merupakan komponen yang menampilkan threadItem.
Untuk lebih memahami data yang akan kita gunakan kita perlu melihat struktur data dari masing-masing endpoint API.

### Membuat helper function postedAt

Kita akan membuat helper function untuk menampilkan lama waktu postingan pada folder utils buat berkas dengan nama index.js

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

export { postedAt };
```

### Membuat Komponen ThreadItem

Struktur data dari Threads yang akan kita gunakan pada ThreadItem adalah sebagai berikut:

```json
//threads
{
  "status": "success",
  "message": "ok",
  "data": {
    "threads": [
      {
        "id": "thread-1",
        "title": "Thread Pertama",
        "body": "Ini adalah thread pertama",
        "category": "General",
        "createdAt": "2021-06-21T07:00:00.000Z",
        "ownerId": "users-1",
        "upVotesBy": [],
        "downVotesBy": [],
        "totalComments": 0
      },
      {
        "id": "thread-2",
        "title": "Thread Kedua",
        "body": "Ini adalah thread kedua",
        "category": "General",
        "createdAt": "2021-06-21T07:00:00.000Z",
        "ownerId": "users-2",
        "upVotesBy": [],
        "downVotesBy": [],
        "totalComments": 0
      }
    ]
  }
}
```

data threads akan kita gunakan pada komponen ThreadItem, sehingga kita akan menampilkan category, title, body, upVotesBy, downVotesBy, createdAt, totalComments, id, ownerId.

```js
<div className="thread-item" role="button">
  <p className="thread-item__category">{category}</p>
  <article className="thread-item__info">
    <p>{title}</p>
    <p>{body}</p>
  </article>
  <div className="thread-item__detail">
    <p>{upVotesBy.length}</p>
    <p>{downVotesBy.length}</p>
    <p>{totalComments}</p>
    <p>{createdAt}</p>
    <p>{ownerId}</p>
  </div>
</div>
```

1. Buat berkas dengan nama ThreadItem pada folder src/components.

```js
//components/ThreadItem.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { postedAt } from '../utils';

//props dari API ditambah authUser dan fungsi toggleVote
//props upVotesBy, downVotesBy ditambahkan nanti untuk fitur vote
function ThreadItem({
  category,
  title,
  body,
  createdAt,
  totalComments,
  id,
  user,
}) {
  const navigate = useNavigate();

  /* digunakan untuk fitur vote
  const isUpVoted = upVotesBy.includes(authUser);
  const isDownVoted = downVotesBy.includes(authUser);

  const onVoteClick = (event) => {
    event.stopPropagation();
    vote(id);
  }; */

  const onThreadClick = () => {
    navigate(`/threads/${id}`);
  };

  const onThreadPress = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      navigate(`/threads/${id}`);
    }
  };
  /* toggle Vote akan dibuat menyusul, upVotesBy, downVotesBy akan dibuatkan fitur tombol klik */
  return (
    <div
      className="thread-item"
      role="button"
      tabIndex={0}
      onClick={onThreadClick}
      onKeyDown={onThreadPress}
    >
      <p className="thread-item__category">{category}</p>
      <article className="thread-item__info">
        <p>{title}</p>
        <p>{body}</p>
      </article>
      <div className="thread-item__detail">
        <p>{totalComments}</p>
        <p>{postedAt(createdAt)}</p>
        <p>{user.name}</p>
      </div>
    </div>
  );
}

export default ThreadItem;
```

Pada kode di atas, kita menggunakan useNavigate untuk menuju ke detail thread ketika element di klik ataupun di tekan enter/spasi. Komponen ThreadItem di atas akan diperbaharui nanti dengan fitur, upVote dan downVote serta toggle vote agar user dapat mem-vote thread.

### Membuat komponen ThreadList

1. Buat berkas dengan nama ThreadList pada folder src/components

```js
//components/ThreadList.js
import React from 'react';
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
```

Komponen ThreadList akan menerima props dari homepage berupa data threads.

### Membuat Halaman HomePage

1. Buat berkas dengan nama HomePage.js pada folder scr/pages

```js
//pages/HomePage.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ThreadList from '../components/ThreadList';
import { asyncPopulateUsersAndThreads } from '../states/shared/action';

function HomePage() {
  const {
    threads = [],
    users = [],
    authUser,
  } = useSelector((states) => states);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncPopulateUsersAndThreads());
  }, [dispatch]);

  /* Untuk Halaman create thread
  const onAddTalk = (text) => {    
    dispatch(asyncAddTalk({ text }));
  }; */

  /* Unutk tambahan fitur vote
  const onVote = (id) => {
    
    dispatch(asyncToogleVoteThread(id));
  }; */

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

## Mengupdate Komponen App - Homepage

Setelah membuat fitur menampilkan thread, kita perlu memperbaharui komponen App. Sehingga ketika pengguna berhasil login, maka halaman Homepage akan ditambahkan.

```js
//App.js
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { asyncPreloadProcess } from './states/isPreload/action';
import { asyncUnsetAuthUser } from './states/authUser/action';
import HomePage from './pages/HomePage';

function App() {
  const { authUser = null, isPreload = false } = useSelector(
    (states) => states
  );

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
      <>
        <main>
          <Routes>
            <Route path="/*" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
      </>
    );
  }
  /* Routing lain akan ditambahkan */
  return (
    <>
      <div className="app-container">
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
          <button onClick={() => onSignOut()}>Sign-Out</button>
        </main>
      </div>
    </>
  );
}

export default App;
```

Jalankan aplikasi dengan npm run start dan coba login untuk dapat melihat tampilan halaman homepage. Komponen App akan kita sempurnakan lagi seiring berkembangnya aplikasi.

## Fitur Detail Thread

Fitur detail Thread akan menampilkan rincian thread disertai komponen input untuk membuat komentar

### Membuat fitur Detail Thread

1. Buat folder dengan nama threadDetail di dalam src/states dan buat berkas action.js

```js
//threadDetail/action.js
import api from '../../utils/api';

const ActionType = {
  RECEIVE_THREAD_DETAIL: 'RECEIVE_THREAD_DETAIL',
  CLEAR_THREAD_DETAIL: 'CLEAR_THREAD_DETAIL',
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

function asyncReceiveThreadDetail(threadId) {
  return async (dispatch) => {
    dispatch(clearThreadDetail());
    try {
      const threadDetail = await api.getThreadDetail(threadId);
      dispatch(receiveThreadDetail(threadDetail));
    } catch (error) {
      alert(error.message);
    }
  };
}

export {
  ActionType,
  receiveTalkDetail,
  clearThreadDetail,
  asyncReceiveThreadDetail,
};
```

fungsi receiveThreadDetails akan membawa data threadDetail sebagai payload, clearThreadDetail akan menghapus detail thread. fungsi thunk asyncReceiveThreadDetail akan menjalankan proses asynchronous dan memanggil fungsi api.getThreadDetail, kemudian api.getThreadDetail akan mengembalikan data thread detail sesuai argumen id yang diberikan.

2. buat berkas dengan nama reducer dalam folder threadDetail

```js
//threadDetail/reducer.js
import { ActionType } from './action';

function threadDetailReducer(threadDetail = null, action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_THREAD_DETAIL:
      return action.payload.threadDetail;
    case ActionType.CLEAR_THREAD_DETAIL:
      return null;
    default:
      return threadDetail;
  }
}

export default threadDetailReducer;
```

3. Tambahkan threadDetailReducer tersebut pada berkas states/store.js

```js
//states/store.js
import { configureStore } from '@reduxjs/toolkit';
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
    threads: threadsReducer,
    threadDetail: threadDetailReducer,
  },
});

export default store;
```

Selanjutnya Kita akan membuat DetailPage yang terdiri komponen ThreadDetail, ThreadComment dan InputComment. Fitur Input Comment akan kita kerjakan nanti bersamaan dengan fitur create thread.

### Membuat Komponen ThreadDetail

Struktur data yang akan kita dapatkan dari threadDetail adalah seperti berikut:

```json
//struktur data threadDetail
{
  "status": "success",
  "message": "ok",
  "data": {
    "detailThread": {
      "id": "thread-1",
      "title": "Thread Pertama",
      "body": "Ini adalah thread pertama",
      "category": "General",
      "createdAt": "2021-06-21T07:00:00.000Z",
      "owner": {
        "id": "users-1",
        "name": "John Doe",
        "avatar": "https://generated-image-url.jpg"
      },
      "upVotesBy": [],
      "downVotesBy": [],
      "comments": [
        {
          "id": "comment-1",
          "content": "Ini adalah komentar pertama",
          "createdAt": "2021-06-21T07:00:00.000Z",
          "owner": {
            "id": "users-1",
            "name": "John Doe",
            "avatar": "https://generated-image-url.jpg"
          },
          "upVotesBy": [],
          "downVotesBy": []
        }
      ]
    }
  }
}
```

Struktur component pada ThreadDetail sebagai berikut:

```js
<div className="thread-detail">
  <article className="thread-detail__info">
    <p>#{category}</p>
    <h3>{title}</h3>
    <p>{body}</p>
  </article>
  <div className="thread-detail__detail">
    <p>
      <FaRegThumbsUp />
      <span>{upVotesBy.length}</span>
    </p>
    <p>
      <FaRegThumbsDown />
      <span>{downVotesBy.length}</span>
    </p>
    <p>Dibuat oleh: {owner.name}</p>
    <p>{postedAt(createdAt)}</p>
  </div>
</div>
```

Pada data threadDetail kita akan menampilkan data title, body, category, createdAt, upVotesBy, downVotesBy serta owner.name, owner.avatar. Sedangkan pada ThreadComment kita akan menampilkan data comments.length, dan hasil mapping comments seperti content, createdAt, upVotesBy, downVotesBy, owner.name, owner.avatar.

1. Buat berkas dengan nama ThreadDetail pada folder src/components

```js
//components/ThreadDetail.js
import React from 'react';
import { FaRegThumbsUp, FaRegThumbsDown } from 'react-icons/fa';
import { postedAt } from '../utils';

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
      <article className="thread-detail__info">
        <p>#{category}</p>
        <h3>{title}</h3>
        <p>{body}</p>
      </article>
      <div className="thread-detail__detail">
        <p>
          <FaRegThumbsUp />
          <span>{upVotesBy.length}</span>
        </p>
        <p>
          <FaRegThumbsDown />
          <span>{downVotesBy.length}</span>
        </p>
        <img src={owner.avatar} alt={owner.name} />
        <p>Dibuat oleh: {owner.name}</p>
        <p>{postedAt(createdAt)}</p>
      </div>
    </div>
  );
}

export default ThreadDetail;
```

2. Buat berkas dengan nama Comments di dalam folder components

```js
//components/Comments
import React from 'react';
import { FaRegThumbsUp, FaRegThumbsDown } from 'react-icons/fa';
import { postedAt } from '../utils';

function CommentItem({ content, createdAt, upVotesBy, downVotesBy, owner }) {
  return (
    <div className="comment-item">
      <div>
        <img src={owner.avatar} alt={owner.name} />
        <p>{owner.name}</p>
        <p>{postedAt(createdAt)}</p>
      </div>
      <p>{content}</p>
      <div className="comment-item__vote">
        <p>
          <FaRegThumbsUp />
          <span>{upVotesBy.length}</span>
        </p>
        <p>
          <FaRegThumbsDown />
          <span>{downVotesBy.length}</span>
        </p>
      </div>
    </div>
  );
}

export default CommentItem;
```

4. Buat berkas dengan nama CommentList pada folder components

```js
//components/CommentList.js
import React from 'react';
import CommentItem from './CommentItem';

function CommentList({ comments }) {
  return (
    <>
      <h4>{`Komentar (${comments.length})`}</h4>
      <div className="comment-list">
        {comments.map((comment) => (
          <CommentItem key={comment.id} {...comment} />
        ))}
      </div>
    </>
  );
}

export default CommentList;
```

### Membuat DetailPage

1. Buat berkas DetailPage.js pada folder src/pages

```js
//pages/DetailPage.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { asyncReceiveThreadDetail } from '../states/threadDetail/action';
import ThreadDetail from '../components/ThreadDetail';
import CommentList from '../components/CommentsList';

function DetailPage() {
  const { id } = useParams();
  const { threadDetail = null } = useSelector((states) => states);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncReceiveThreadDetail(id));
  }, [dispatch, id]);

  if (!threadDetail) {
    return null;
  }

  return (
    <section className="detail-page">
      <ThreadDetail {...threadDetail} />
      <CommentList comments={threadDetail.comments} />
    </section>
  );
}

export default DetailPage;
```

Setelah membuat DetailPage kita akan mengupdate kembali Komponen App.

## Mengupdate Komponen App - DetailPage

Kita akan menambahkan DetailPage pada Komponen App serta menambahkan routing untuk halaman tersebut.

```js
//App.js
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { asyncPreloadProcess } from './states/isPreload/action';
import { asyncUnsetAuthUser } from './states/authUser/action';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';

function App() {
  const { authUser = null, isPreload = false } = useSelector(
    (states) => states
  );

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
      <>
        <main>
          <Routes>
            <Route path="/*" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
      </>
    );
  }
  /* Routing lain akan ditambahkan */
  return (
    <>
      <div className="app-container">
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/threads/:id" element={<DetailPage />} />
          </Routes>
          <button onClick={() => onSignOut()}>Sign-Out</button>
        </main>
      </div>
    </>
  );
}

export default App;
```

Jalankan aplikasi menggunakan npm run start dan pastikan aplikasi dapat berjalan dengan baik. Aplikasi kita telah semakin berkembang. Kita dapat melakukan login, register, menampilkan halaman yang berisi data threads serta menampilkan detail thread ketika elemen tersebut diklik. Masih ada fitur yang akan kita kembangkan untuk menyempurnakan aplikasi yakni fitur create Thread dan create Comment.

## Fitur create Comment

Fitur create comment akan mengirimkan data berupa content ke API. Kita akan menambahkan helper function, menambahkan action creator, fungsi thunk create comment, serta memperbaharui reducer threadDetail.

### Membuat helper function create Comment

Pada berkas utils/api tambahkan helper function berikut:

```js
//utils/api.js
const api = (() => {
  const BASE_URL = 'https://forum-api.dicoding.dev/v1';

  /* fungsi lainnya disembunyikan */

  /* helper function create comment */
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

  /* helper upvote, downvote thread & comment serta see Leaderboard menyusul */

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
  };
})();

export default api;
```

fungsi createComment akan mengirimkan content ke body request berdasarkan url id yang diberikan.

### Memperbaharui action & reducer threadDetail

1. Tambahkan Action Type dan fungsi thunk addComment

```js
//threadDetail/action.js
import api from '../../utils/api';

const ActionType = {
  RECEIVE_THREAD_DETAIL: 'RECEIVE_THREAD_DETAIL',
  CLEAR_THREAD_DETAIL: 'CLEAR_THREAD_DETAIL',
  COMMENT_THREAD_DETAIL: 'COMMENT_THREAD_DETAIL',
};

/* fungsi action creator lainnya disembunyikan */

function addComment(comment) {
  return {
    type: ActionType.COMMENT_THREAD_DETAIL,
    payload: {
      comment,
    },
  };
}

/* fungsi thunk lainnya disembunyikan */

/* adding Comment */
function asyncAddComment({ id, content }) {
  return async (dispatch) => {
    try {
      const comment = await api.createComment({ id, content });
      dispatch(addComment(comment));
    } catch (error) {
      alert(error.message);
    }
  };
}

export {
  ActionType,
  receiveThreadDetail,
  clearThreadDetail,
  asyncReceiveThreadDetail,
  asyncAddComment,
};
```

2. Update juga reducer.js, kita akan menambahkan case untuk COMMENT_THREAD_DETAIL. COMMENT_THREAD_DETAIL akan memerintahkan reducer untuk mengembalikan threadDetail beserta comments yang telah diperbaharui.

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
      const { comment } = action.payload;
      return {
        ...threadDetail,
        comments: [...threadDetail.comments, comment],
      };
    default:
      return threadDetail;
  }
}

export default threadDetailReducer;
```

Dengan helper function, action dan reducer yang telah diperbaharui, kita selanjutnya akan membuat komponen CommentInput yang berfungsi untuk membuat commentar pada detail page.

### Membuat Komponen CommentInput

1. Buat berkas CommentInput.js pada folder src/components

```js
//components/CommentInput.js
import React, { useState } from 'react';

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
    <>
      <h3>Beri Komentar</h3>
      <div className="comment-input">
        <textarea
          type="text"
          placeholder="Apa Komentarmu terhadap topik di atas?"
          value={content}
          onChange={handleChange}
        />
        <button type="submit" onClick={addcomment}>
          Kirim
        </button>
      </div>
    </>
  );
}

export default CommentInput;
```

Komponen CommentInput akan menerima props berupa fungsi addComment yang akan membawa content ke parent Komponen. 2. Tambahkan CommentInput ke detailPage.

```js
//pages/detailPage.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  asyncAddComment,
  asyncReceiveThreadDetail,
} from '../states/threadDetail/action';
import ThreadDetail from '../components/ThreadDetail';
import CommentList from '../components/CommentsList';
import CommentInput from '../components/CommentInput';

function DetailPage() {
  const { id } = useParams();
  const { threadDetail = null } = useSelector((states) => states);

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

Pada DetailPage kita menambahkan fungsi onAddComment, fungsi ini akan membawa content dan id yang kemudian akan dikirimkan ke API melalui fungsi thunk asyncAddComment.
Jalankan aplikasi dan lakukan tambah komentar pada halaman detail dan pastikan tidak terdapat error.

--> Nanti

## Fitur create Thread

Kita akan menambahkan fitur membuat thread baru. Action dan reducer telah kita buat pada folder states/threads. Kita akan membuat ThreadInput yang akan di-render di dalam halaman InputPage.

### Membuat Komponen ThreadInput & InputPage

1. Pada folder components buat berkas dengan nama ThreadInput

```js
//components/ThreadInput.js
import React from 'react';
import useInput from '../hooks/useInput';
import { useNavigate } from 'react-router-dom';

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
```

2. Buat berkas AddThreadPage.js pada folder pages

```js
//pages/AddThreadPage.js
import React from 'react';
import { asyncAddThread } from '../states/threads/action';
import { useDispatch } from 'react-redux';
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

AddThreadPage belum dapat diakses karena kita belum membuat routingnya, kita akan membuat akses menambahkan thread melalui navigasi.

## Navigation

### Membuat Komponen Navigation

Kita akan membuat komponen navigasi halaman. Kita akan membuat akses menambahkan thread melalui komponen navigasi. Komponen Navigation akan terdiri dari:

- Tombol Link Untuk menuju halaman membuat thread baru
- Tombol Link Untuk menuju ke halaman leaderboard
- Tombol Untuk Sign out

Kita akan membuat Tombol Link untuk menuju ke halaman pembuatan thread dan Sign out terlebih dahulu. Halaman leaderboard akan kita buat nanti sebagai tambahan fitur pada aplikasi.

1. Buat berkas Navigation pada folder src/components

```js
//components/Navigation.js
import React from 'react';
import { Link } from 'react-router-dom';

import {
  FaRegPlusSquare,
  FaRegShareSquare,
  FaRegComments,
} from 'react-icons/fa';

function Navigation({ authUser, signOut }) {
  const { name, avatar } = authUser;

  return (
    <div className="navigation">
      <div className="navigation-profile">
        {/* <img src={avatar} alt={name} title={name} /> */}
        {/* <p>{name}</p> */}
      </div>
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
        <button type="button" onClick={signOut} title="Sign-Out">
          <FaRegShareSquare />
        </button>
      </nav>
    </div>
  );
}

export default Navigation;
```

2. Update App.js Menjadi seperti berikut:

```js
//App.js
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { asyncPreloadProcess } from './states/isPreload/action';
import { asyncUnsetAuthUser } from './states/authUser/action';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import Navigation from './components/Navigation';
import AddThreadPage from './pages/AddThreadPage';
import { MdDeveloperMode } from 'react-icons/md';

function App() {
  const { authUser = null, isPreload = false } = useSelector(
    (states) => states
  );

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
      <>
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
      </>
    );
  }
  /* Routing lain akan ditambahkan */
  return (
    <>
      <div className="app-container">
        <header className="app-header">
          <div className="app-logo">
            <MdDeveloperMode style={{ fontSize: '64px' }} />
            <h1>Forum App</h1>
          </div>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/threads/:id" element={<DetailPage />} />
            <Route path="/threads" element={<AddThreadPage />} />
          </Routes>
        </main>
        <footer>
          <Navigation authUser={authUser} signOut={onSignOut} />
        </footer>
      </div>
    </>
  );
}

export default App;
```

Pada Komponen App Kita menambahkan Komponen Navigation dengan props authUser dan signOut. props signOut akan membawa fungsi signOut ke child komponen.
Fitur Utama pada aplikasi telah berjalan dengan baik, jalankan aplikasi dan coba fitur-fitur inti seperti login, register, membuat thread baru, menambahkan komentar dan pastikan tidak terdapat error.

## Fitur Loading Bar

Aplikasi kita banyak terdapat proses asynchronous di dalamnya, kita akan membuat fitur loading bar yang dapat menampilkan proses pengambilan data pada aplikasi. Kita akan memanfaatkan fitur react-redux-loading-bar. Install library tersebut menggunakan command:

```
npm react-redux-loading-bar
```

Untuk menampilkan dan menghilangkan loading kita perlu mengimpor library tersebut seperti berikut:

```js
import { hideLoading, showLoading } from 'react-redux-loading-bar';

/* menggunakan showLoading & hideLoading */
function asyncSetAuthUser({ email, password }) {
  return async (dispatch) => {
    dispacth(showLoading());
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
```

Kita juga perlu menambahkan loadingbarReducer pada store.js

```js
//states/store.js
import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './users/reducer';
import authUserReducer from './authUser/reducer';
import isPreloadReducer from './isPreload/reducer';
import threadsReducer from './threads/reducer';
import threadDetailReducer from './threadDetail/reducer';
import { loadingBarReducer } from 'react-redux-loading-bar';

const store = configureStore({
  reducer: {
    users: usersReducer,
    authUser: authUserReducer,
    isPreload: isPreloadReducer,
    threads: threadsReducer,
    threadDetail: threadDetailReducer,
    loadingBar: loadingBarReducer,
  },
});

export default store;
```

kemudian kita perlu men-dispatch showLoading ketika awal proses fungsi thunk dan hideLoading pada akhir proses fungsi thunk.
Silahkan dispatch showLoading & hideLoading pada fungsi thunk yang terdapat pada berkas action di masing-masing folder state (authUser, isPreload, shared, threadDetail, threads, users)

### Membuat Komponen Loading

1. Buat berkas Loading.js pada folder components

```js
//components/Loading.js
import React from 'react';
import LoadingBar from 'react-redux-loading-bar';

function Loading() {
  return (
    <div className="loading">
      {/* @TODO: use react-redux-loading-bar to show loading bar */}
      <LoadingBar />
    </div>
  );
}

export default Loading;
```

### Menambahkan Komponen Loading ke App.js

1. Tambahkan Komponen Loading ke App.js

```js
//App.js
/* import lainnya disembunyikan */
import Loading from './components/Loading';

function App() {
  /* fungsi lainnya disembunyikan */

  if (authUser === null) {
    return (
      <>
        <header className="app-header">
          <div className="app-logo">
            <MdDeveloperMode style={{ fontSize: '64px' }} />
            <h1>Forum App</h1>
          </div>
        </header>
        <Loading />
        <main>
          <Routes>
            <Route path="/*" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
      </>
    );
  }
  /* Routing lain akan ditambahkan */
  return (
    <>
      <div className="app-container">
        <header className="app-header">
          <div className="app-logo">
            <MdDeveloperMode style={{ fontSize: '64px' }} />
            <h1>Forum App</h1>
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
          <Navigation authUser={authUser} signOut={onSignOut} />
        </footer>
      </div>
    </>
  );
}

export default App;
```

Fungsionalitas inti aplikasi telah selesai dibuat, jalankan aplikasi menggunakan npm run start dan pastikan tidak terdapat error.

<!-- react vite belum update -->

```json
    "devDependencies": {
    "eslint-config-airbnb": "^19.0.4",
    "eslint-plugin-import": "^2.28.1",
    "eslint-plugin-jsx-a11y": "^6.7.1",
  }
```

--> reducer testing ok
--> thunk function testing ok
-->> tulis scenario testing di setiap action.test & reducer.test OK
lanjut besok
-->> install react testing library dengan command
npm install @testing-library/react @testing-library/user-event @testing-library/jest-dom --save-dev
-->> buat 4 Pengujian React Component -> X cuma dua

-->> buat 2 stories component
install storybook

- npx storybook init

menjalankan storybook:

- npm run storybook

-->> coba postman utk test API vote

note: ada error ketika component testing -> solved pakai versi downgrade react testing versi "@testing-library/jest-dom": "^5.16.5"

--> styled component buat theme
command:
npm install styled-components styled-theming

## Membuat styled Container Component

1. buat folder styledComponents pada folder src dan buat berkas Container.jsx

```js
//styledComponents/Container.jsx
import styled from 'styled-components';

export const Container = styled.div`
  font-family: 'Open Sans', sans-serif;
`;
```

sumber: https://levelup.gitconnected.com/implementing-a-dark-theme-toggle-with-react-redux-and-styled-components-e637c4d41e2f

--> bug, toggle theme klu true harus diklik 2 kali setelah refresh jika mode dark
dikarenakan nilai yang disimpan oleh local storage adalah true, sedangkan nilai dari darkTheme state adalah false

## Optimized Forum App

Pada Pembahasan kali ini kita akan menerapkan optimisasi seperti penambahan fitur, eslint, automate testing serta deployment dengan CI/CD.
