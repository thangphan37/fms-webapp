import {
  SETTING_LOADING,
  SETTING_LOADED,
  ADD_TAG,
  UPDATE_TAG,
  DELETE_TAG,
  CHANGE_VALUE_TAG,
  IS_EDITTING,
  PROJECT_LOADED,
  PAGES_LOADED
} from '../actions/setting';


const initState = {
  isSettingLoading: true,
  isEditting: false,
  value: "",
  tags: [],
  project: "",
  pages: []
}

const settingReducer = (state = initState, action) => {
  switch (action.type) {
    case SETTING_LOADING:
      return {
        ...state,
        isSettingLoading: true
      }
    case SETTING_LOADED:
      return {
        ...state,
        isSettingLoading: false,
        tags: action.tags
      }
    case ADD_TAG:
      return {
        ...state,
        isSettingLoading: false,
        tags: state.tags.concat(action.newTag)
      }
    case UPDATE_TAG:
      return {
        ...state,
        isSettingLoading: false,
        tags: state.tags.map(t => (t._id == action.updatedTag._id) ? action.updatedTag : t)
      }
    case DELETE_TAG:
      return {
        ...state,
        isSettingLoading: false,
        tags: state.tags.filter(t => (t._id !== action.tag._id))
      }
    case CHANGE_VALUE_TAG:
      return {
        ...state,
        isSettingLoading: false,
        value: action.value
      }
    case IS_EDITTING:
      return {
        ...state,
        isEditting: true
      }
    case PROJECT_LOADED:
      return {
        ...state,
        isSettingLoading: false,
        project: action.project
      }
      case PAGES_LOADED:
        return {
          ...state,
          pages: action.pages
        }
    default:
      return state;
  }
}

export default settingReducer;
