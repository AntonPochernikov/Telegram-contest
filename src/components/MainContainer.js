import { connect } from 'react-redux';
import MainContainer from './MainContainer.jsx';
import * as actionCreators from '../actions/index.js';

const mapStateToProps = state => ({
  mode: state.ui.mode,

  fetchState: state.app.chartsFetch.state,
});

export default connect(
  mapStateToProps,
  actionCreators,
)(MainContainer);
