import { createSelector } from 'reselect';
import _ from 'lodash';

const getCharts = state => state.domain.charts;
export const getVisibleLines = state => state.ui.visibleLines;

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

export const getXAxisColumn = createSelector(
  getPartitionByColumnType,
  coll => _
    .chain(coll)
    .head()
    .head()
    .value(),
);

export const getLineColumns = createSelector(
  getPartitionByColumnType,
  coll => _
    .chain(coll)
    .tail()
    .head()
    .value(),
);

export const getVisibleLineColumns = createSelector(
  getLineColumns,
  getVisibleLines,
  (columns, visibleLines) => _.filter(columns, ({ id }) => visibleLines.includes(id)),
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
