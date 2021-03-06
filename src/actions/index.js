import { createAction } from 'redux-actions';

export const setDayMode = createAction('DAY_MODE_SET');
export const setNightMode = createAction('NIGHT_MODE_SET');

export const fetchChartsRequest = createAction('CHARTS_FETCH_REQUEST');
export const fetchChartsSuccess = createAction('CHARTS_FETCH_SUCCESS');
export const fetchChartsFailure = createAction('CHARTS_FETCH_FAILURE');
export const fetchCharts = () => async (dispatch) => {
  const source = null;
  dispatch(fetchChartsRequest({ source }));
  try {
    const data = await import(/* webpackChunkName: "inputdata" */ '../data/chart_data.json');
    dispatch(fetchChartsSuccess({ charts: data['0'] }));
  } catch (e) {
    console.log(e);
    dispatch(fetchChartsFailure({ e }));
  }
};

export const setCurrentDateIndex = createAction('CURRENT_DATE_INDEX_SET');
export const resetCurrentDateIndex = createAction('CURRENT_DATE_INDEX_RESET');
export const setLineVisibility = createAction('LINE_VISIBILITY_SET');

export const setThumbPosition = createAction('THUMB_POSITION_SET');
export const setThumbWidth = createAction('THUMB_WIDTH_SET');
export const setThumbPositionWidth = createAction('THUMB_WIDTH_POSITION_SET');
