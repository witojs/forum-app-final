import { ToggleDarkThemeAction, AppThunk } from '../../types/redux';

const ActionType = {
  TOGGLE_DARKTHEME: 'TOGGLE_DARKTHEME' as const,
};

function toggleDarkTheme(): ToggleDarkThemeAction {
  return {
    type: ActionType.TOGGLE_DARKTHEME,
  };
}

function toggleDarkThemeThunk(): AppThunk {
  return (dispatch, getState) => {
    dispatch(toggleDarkTheme());
    const { darkTheme } = getState();
    localStorage.setItem('theme', JSON.stringify(darkTheme));
  };
}

export { ActionType, toggleDarkTheme, toggleDarkThemeThunk };
