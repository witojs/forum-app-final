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
  width: 100%;
  background-color: ${backgroundColor};
  color: ${textColor};
`;
