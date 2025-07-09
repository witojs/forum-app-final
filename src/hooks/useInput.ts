import { useState } from 'react';
import { InputEvent, UseInputReturn } from '../types';

function useInput(defaultValue: string = ''): UseInputReturn {
  const [value, setValue] = useState<string>(defaultValue);

  function handleValueChange(event: InputEvent): void {
    setValue(event.target.value);
  }

  return [value, handleValueChange, setValue];
}

export default useInput;
