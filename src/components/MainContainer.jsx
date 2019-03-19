import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import WorkSpace from './WorkSpace.jsx';

export default class MainContainer extends React.Component {
  static defaultProps = {
    mode: 'day',

    fetchState: 'initial',
  };

  componentDidMount() {
    this.props.fetchCharts();
  }

  render() {
    const {
      mode,
      fetchState,
      setDayMode,
      setNightMode,
    } = this.props;
    const switchBtnByMode = {
      day: {
        next: 'night',
        handler: () => setNightMode(),
        description: 'Switch to Night Mode',
      },
      night: {
        next: 'day',
        handler: () => setDayMode(),
        description: 'Switch to Day Mode',
      },
    };

    const containerClass = cn(
      'app',
      `app--mode-${mode}`,
    );

    return (
      <div className={containerClass}>
        <header className='header'>
          <h2 className='chart-name header__chart-name'>Charts</h2>
        </header>
        {fetchState === 'succeed' && <WorkSpace />}
        <footer className='footer'>
          <button
            className='switch-mode-btn footer__switch-mode-btn'
            onClick={switchBtnByMode[mode].handler}
          >
            {switchBtnByMode[mode].description}
          </button>
        </footer>
      </div>
    );
  }
}

MainContainer.propTypes = {
  mode: PropTypes.oneOf(['day', 'night']).isRequired,

  fetchState: PropTypes.oneOf(['initial', 'requested', 'succeed', 'failed']).isRequired,
};
