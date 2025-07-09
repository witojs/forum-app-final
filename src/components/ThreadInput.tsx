import React from 'react';
import { useNavigate } from 'react-router-dom';
import useInput from '../hooks/useInput';
import { ThreadInputProps } from '../types/redux';

function ThreadInput({ addThread }: ThreadInputProps): JSX.Element {
  const [title, onTitleChange] = useInput('');
  const [body, onBodyChange] = useInput('');
  const [category, onCategoryChange] = useInput('');
  const navigate = useNavigate();

  function addthread(): void {
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
        <textarea
          value={body}
          onChange={onBodyChange}
          required
        />
        <button type="button" onClick={addthread}>
          Buat
        </button>
      </form>
    </>
  );
}

export default ThreadInput;
