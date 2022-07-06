import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from '@react-native-async-storage/async-storage';

// slices
import userInfoReducer from './slices/userInfo';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};
const userInfoPersistConfig = {
  key: 'userInfo',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['subdomain'],
};
const rootReducer = combineReducers({
  userInfo: persistReducer(userInfoPersistConfig, userInfoReducer),
});

export { rootPersistConfig, rootReducer };
