import { connect } from 'react-redux';
import ChartControls from './ChartControls.jsx';
import * as actionCreators from '../actions/index.js';
import * as select from '../selectors/index.js';

const mapStateToProps = state => ({
  lines: select.getLineColumns(state),
  visibleLines: state.ui.visibleLines,
});

export default connect(
  mapStateToProps,
  actionCreators,
)(ChartControls);
