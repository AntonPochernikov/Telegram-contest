import { connect } from 'react-redux';
import ChartViewer from './ChartViewer.jsx';
import * as actionCreators from '../actions/index.js';
import * as select from '../selectors/index.js';

const mapStateToProps = state => ({
  lines: select.getVisibleLineColumns(state),
  dates: select.getChartDates(state),
  valueScales: select.getViewerValueScales(state),
  lineLength: select.getLineColumnLength(state),
  currentDate: state.ui.currentDate,
  currentDateInfo: select.getCurrentDateInfo(state),

  thumbPosition: state.ui.thumb.position,
  thumbWidth: state.ui.thumb.width,

  maxYPoint: select.getMaxLinesYPoint(state),
  viewerMaxYPoint: select.getViewerVisibleMaxLinesYPoint(state),
});

export default connect(
  mapStateToProps,
  actionCreators,
)(ChartViewer);
