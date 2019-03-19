import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import * as action from '../actions/index.js';

const fetchInit = {
  state: 'initial',
  source: null,
  errMessage: '',
};
const chartsFetch = handleActions({
  [action.fetchChartsRequest]: (state, { payload: { source } }) => ({
    state: 'requested',
    source,
    errMessage: '',
  }),
  [action.fetchChartsSuccess]: () => ({
    state: 'succeed',
    source: null,
    errMessage: '',
  }),
  [action.fetchChartsFailure]: (state, { payload: { e } }) => ({
    state: 'failed',
    source: null,
    errMessage: e.message,
  }),
}, fetchInit);

export default combineReducers({
  chartsFetch,
});
