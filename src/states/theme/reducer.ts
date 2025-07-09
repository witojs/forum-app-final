import { ThemeAction } from '../../types/redux';
import { ActionType } from './action';

function themeReducer(action: ThemeAction, darkTheme: boolean = false): boolean {
  switch (action.type) {
    case ActionType.TOGGLE_DARKTHEME:
      return !darkTheme;
    default:
      return darkTheme;
  }
}

export default themeReducer;
