import { createSelector } from 'reselect';
import _ from 'lodash';

const emptyObj = {};

export const getCharts = state => state.domain.charts;
export const getVisibleLines = state => state.ui.visibleLines;
export const getThumbParams = state => state.ui.thumb;
export const getCurrentDate = state => state.ui.currentDate;

export const getJoinedChartData = createSelector(
  getCharts,
  ({
    columns,
    types,
    names,
    colors,
  }) => Object.keys(types).map((key) => {
    const column = _
      .chain(columns)
      .find(([head]) => head === key)
      .tail()
      .value();
    const name = names[key] || null;
    const color = colors[key] || null;
    return {
      id: key,
      type: types[key],
      column,
      name,
      color,
    };
  }),
);

export const getPartitionByColumnType = createSelector(
  getJoinedChartData,
  chart => _.partition(chart, ({ type }) => type === 'x'),
);

export const getChartDates = createSelector(
  getPartitionByColumnType,
  coll => _
    .chain(coll)
    .head()
    .head()
    .value()
    .column,
);

export const getLineColumns = createSelector(
  getPartitionByColumnType,
  coll => _
    .chain(coll)
    .tail()
    .head()
    .value(),
);

export const getLineColumnLength = createSelector(
  getLineColumns,
  lines => _.head(lines).column.length,
);

export const getVisibleLineColumns = createSelector(
  getLineColumns,
  getVisibleLines,
  (columns, visibleLines) => _.filter(columns, ({ id }) => visibleLines.includes(id)),
);

export const getCurrentDateInfo = createSelector(
  getVisibleLineColumns,
  getChartDates,
  getCurrentDate,
  (cols, dates, index) => {
    if (index === null) {
      return emptyObj;
    }
    const date = dates[index];
    const lines = cols.map(({ name, color, column }) => ({ name, color, value: column[index] }));
    return { date, lines };
  },
);

export const getMaxLinesYPoint = createSelector(
  getLineColumns,
  lines => Math.max(..._
    .chain(lines)
    .map(({ column }) => column)
    .flatten()
    .value()),
);

export const getVisibleMaxLinesYPoint = createSelector(
  getVisibleLineColumns,
  lines => Math.max(..._
    .chain(lines)
    .map(({ column }) => column)
    .flatten()
    .value()),
);

export const getViewerLineColumns = createSelector(
  getVisibleLineColumns,
  getThumbParams,
  (lines, { position, width }) => lines
    .map((line) => {
      const { column } = line;
      const colLength = column.length;
      const lower = Math.ceil(colLength * position);
      const upper = lower + Math.floor(colLength * width);
      return { ...line, column: column.slice(lower, upper) };
    }),
);

export const getViewerVisibleMaxLinesYPoint = createSelector(
  getViewerLineColumns,
  lines => Math.max(..._
    .chain(lines)
    .map(({ column }) => column)
    .flatten()
    .value()),
);

export const getViewerValueScales = createSelector(
  getViewerVisibleMaxLinesYPoint,
  (max) => {
    const last = 0.9 * max;
    const step = last / 5;
    const boilerPlateScales = [1, 2, 3, 4, 5, 6];

    return boilerPlateScales.map((item, i) => Math.round(i * step));
  },
);
