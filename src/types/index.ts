export * from './api';
export * from './redux';

// Common utility types
export type InputEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
export type FormEvent = React.FormEvent<HTMLFormElement>;
export type ButtonEvent = React.MouseEvent<HTMLButtonElement>;

// Hook types
export type UseInputReturn = [
  string,
  (event: InputEvent) => void,
  React.Dispatch<React.SetStateAction<string>>,
];

// Styled Components theme type
export interface Theme {
  backgroundColor: string;
  sectionColor: string;
  headlineColor: string;
  highlightColor: string;
  textColor: string;
  lineColor: string;
}

// Common component props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}
