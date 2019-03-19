import { connect } from 'react-redux';
import ChartScroller from './ChartScroller.jsx';
import * as actionCreators from '../actions/index.js';
import * as select from '../selectors/index.js';

const mapStateToProps = state => ({
  lines: select.getVisibleLineColumns(state),
  maxYPoint: select.getMaxLinesYPoint(state),
  visibleMaxYPoint: select.getVisibleMaxLinesYPoint(state),

  thumbPosition: state.ui.thumb.position,
  thumbWidth: state.ui.thumb.width,
});

export default connect(
  mapStateToProps,
  actionCreators,
)(ChartScroller);
