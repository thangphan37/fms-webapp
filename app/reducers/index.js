import * as redux from 'redux';
import auth from './auth';
import project from './project';
import post from './post';
import dashboard from './dashboard/index';
import setting from './setting/setting';

const reducers = redux.combineReducers({
  auth,
  project,
  post,
  dashboard,
  setting
});

export default reducers;
