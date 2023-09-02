/* eslint-disable react/prop-types */
import React from 'react';
import { Link } from 'react-router-dom';
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

const NavBarLinkDiv = styled.div`
  background-color: ${backgroundColor};
  color: ${textColor};
  text-decoration: none;
`;

function NavBarLink({ children, to }) {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <NavBarLinkDiv>{children}</NavBarLinkDiv>
    </Link>
  );
}

export default NavBarLink;
