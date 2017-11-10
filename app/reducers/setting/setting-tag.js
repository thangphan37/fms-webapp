import {
  ADD_TAG,
  UPDATE_TAG,
  DELETE_TAG,
  CHANGE_VALUE_TAG,
  SETTING_LOADED,
  TAG_LOADED
} from '../../actions/setting/setting-tag';

const initState = {
  value: "",
  tags: []
}

const settingTag = (state = initState, action) => {
  switch (action.type) {
    case TAG_LOADED:
      return {
        ...state,
        tags: action.tags
      }
    case ADD_TAG:
      return {
        ...state,
        tags: state.tags.concat(action.newTag)
      }
    case UPDATE_TAG:
      return {
        ...state,
        tags: state.tags.map(t => (t._id == action.updatedTag._id) ? action.updatedTag : t)
      }
    case DELETE_TAG:
      return {
        ...state,
        tags: state.tags.filter(t => (t._id !== action.tag._id))
      }
    case CHANGE_VALUE_TAG:
      return {
        ...state,
        value: action.value
      }
    default:
      return state;
  }
}

export default settingTag;