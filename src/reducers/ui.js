import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import _ from 'lodash';
import * as action from '../actions/index.js';

const mode = handleActions({
  [action.setDayMode]: () => 'day',
  [action.setNightMode]: () => 'night',
}, 'day');

const thumbInit = {
  position: 0,
  width: 0.2,
};

const visibleLines = handleActions({
  [action.fetchChartsSuccess]: (state, { payload: { charts } }) => Object
    .keys(charts.types)
    .filter(type => charts.types[type] === 'line'),
  [action.setLineVisibility]: (state, { payload: { lineId } }) => {
    if (!state.includes(lineId)) {
      return [...state, lineId];
    }
    if (state.length === 1) {
      return state;
    }
    return _.without(state, lineId);
  },
}, []);

const thumb = handleActions({
  [action.setThumbPosition]: (state, { payload: { position } }) => ({
    ...state,
    position,
  }),
  [action.setThumbWidth]: (state, { payload: { width } }) => ({
    ...state,
    width,
  }),
  [action.setThumbPositionWidth]: (state, { payload: { position, width } }) => ({
    position,
    width,
  }),
}, thumbInit);

const currentDate = handleActions({
  [action.setCurrentDateIndex]: (state, { payload: { index } }) => (state === index ? null : index),
  [action.resetCurrentDateIndex]: () => null,
}, null);


export default combineReducers({
  mode,
  thumb,
  visibleLines,
  currentDate,
});
