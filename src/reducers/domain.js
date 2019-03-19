import { handleActions } from 'redux-actions';
import * as action from '../actions/index.js';

const init = {
  charts: {},
};

export default handleActions({
  [action.fetchChartsSuccess]: (state, { payload: { charts } }) => ({
    charts,
  }),
}, init);
