import React from 'react';
import PropTypes from 'prop-types';
import { format as formatDate } from 'date-fns';
import _ from 'lodash';
import './ChartViewer.css';

const margin = 30;

export default class ChartViewer extends React.Component {
  static defaultProps = {
    lines: [],
    dates: [],
    valueScales: [],
    lineLength: 0,
    currentDate: null,
    currentDateInfo: {},

    thumbPosition: 0,
    thumbWidth: 0.2,

    maxYPoint: 0,
    viewerMaxYPoint: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
      isScalling: false,
    };

    this.ref = {};
    this.props.lines.forEach(({ name }) => {
      this.ref[name] = React.createRef();
    });
    this.container = React.createRef();
    this.dates = React.createRef();
  }

  componentDidMount() {
    this.maxYPoint = this.props.viewerMaxYPoint;
    this.renderChartLines(this.maxYPoint);

    this.setState({
      mounted: true,
    });
  }

  componentDidUpdate() {
    if (!this.state.isScalling) {
      this.performChartScaling();
    }
  }

  performChartScaling() {
    if (this.maxYPoint > this.props.viewerMaxYPoint) {
      this.setState({
        isScalling: true,
      });
      const start = this.maxYPoint;
      const end = this.props.viewerMaxYPoint;
      const diff = start - end;
      const step = Math.ceil(diff / 20);
      for (let i = 0; i <= diff; i += step) {
        setTimeout(
          () => {
            if (i > (diff - step)) {
              this.maxYPoint = end;
              this.renderChartLines(this.maxYPoint);
              this.setState({
                isScalling: false,
              });
              return;
            }

            this.maxYPoint -= step;
            this.renderChartLines(this.maxYPoint);
          },
          i * 2,
        );
      }
      return;
    }

    if (this.maxYPoint < this.props.viewerMaxYPoint) {
      this.setState({
        isScalling: true,
      });
      const start = this.props.viewerMaxYPoint;
      const end = this.maxYPoint;
      const diff = start - end;
      const step = Math.ceil(diff / 20);
      for (let i = 0; i <= diff; i += step) {
        setTimeout(
          () => {
            if (i > (diff - step)) {
              this.maxYPoint = start;
              this.renderChartLines(this.maxYPoint);
              this.setState({
                isScalling: false,
              });
              return;
            }

            this.maxYPoint += step;
            this.renderChartLines(this.maxYPoint);
          },
          i * 2,
        );
      }
      return;
    }

    this.renderChartLines(this.maxYPoint);
  }

  // select date
  handleLineClick = (e) => {
    e.stopPropagation();
    const { width } = this.container.current.getBoundingClientRect();
    const { thumbWidth, thumbPosition, lineLength } = this.props;

    const containerWidth = width / thumbWidth;
    const currentPoint = containerWidth * thumbPosition + e.pageX - margin;
    const currentPercent = currentPoint / containerWidth;
    const currentIndex = Math.round((lineLength - 1) * currentPercent);

    this.props.setCurrentDateIndex({ index: currentIndex });
  }

  handleDateInfoClick = () => {
    this.props.resetCurrentDateIndex();
  }

  renderChartLines(maxYPoint) {
    const { width, height } = this.container.current.getBoundingClientRect();
    const { thumbWidth, thumbPosition, currentDate } = this.props;
    const containerWidth = width / thumbWidth;
    this.container.current.style.width = containerWidth;
    const heightModifier = height / (maxYPoint * 1.05);

    // draw chart lines
    this.props.lines.forEach(({ name, column, color }) => {
      const canvas = this.ref[name].current;
      canvas.style.transform = `translateX(${-containerWidth * thumbPosition}px)`;

      const cols = column.length - 1;
      const step = 1 / cols * containerWidth;

      const ctx = canvas.getContext('2d');
      ctx.canvas.width = containerWidth;
      ctx.canvas.height = height;
      ctx.strokeStyle = color;
      ctx.fillStyle = 'white';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(0, height);
      let x = 0;

      column.forEach((value, i) => {
        const y = height - (value * heightModifier);
        if (i !== 0) {
          ctx.lineTo(x, y);
        }
        ctx.moveTo(x, y);
        x += step;
      });

      ctx.stroke();
      ctx.closePath();

      // highlight selected date with circle
      if (currentDate !== null) {
        ctx.beginPath();
        x = currentDate * step;
        const y = height - (column[currentDate] * heightModifier);
        const radius = 5;
        ctx.moveTo(x + radius, y);
        ctx.arc(x, y, radius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.strokeStyle = '#e5e5e5';
        ctx.lineWidth = 1;
        ctx.moveTo(x, height);
        ctx.lineTo(x, 0);
        ctx.stroke();
        ctx.closePath();
      }
    });
  }

  renderDates() {
    if (this.container.current === null) {
      return null;
    }
    const { width } = this.container.current.getBoundingClientRect();
    const { thumbWidth, thumbPosition } = this.props;
    const containerWidth = width / thumbWidth;
    this.dates.current.style.width = `${containerWidth}px`;
    this.dates.current.style.transform = `translateX(${-containerWidth * thumbPosition}px)`;
    const datesCount = 1 / thumbWidth * 5;
    const { dates } = this.props;
    const filteredDates = dates
      .slice(0, dates.length - 1)
      .filter((date, i) => i % Math.floor(dates.length / datesCount) === 0)
      .concat(_.last(dates));
    return filteredDates.map(date => (
      <li className='chart-viewer__date' key={date}>{formatDate(date, 'MMM DD')}</li>
    ));
  }

  getPosition = (shift, thumbWidth, containerWidth, leftMargin) => {
    if (leftMargin < 60 && shift === leftMargin) {
      return { left: 60 };
    }
    if (shift + 60 >= containerWidth) {
      return { right: -60 };
    }
    return { left: leftMargin };
  }

  renderCurrentDateInfo() {
    const { currentDate, currentDateInfo, lineLength } = this.props;
    if (currentDate === null) {
      return null;
    }

    const { date, lines } = currentDateInfo;
    const { width } = this.container.current.getBoundingClientRect();
    const { thumbWidth, thumbPosition } = this.props;

    const containerWidth = width / thumbWidth;
    const scrollShift = containerWidth * thumbPosition;
    const leftShift = currentDate / (lineLength - 1) * containerWidth;
    const leftPosition = leftShift - scrollShift;

    const infoStyle = {
      ...this.getPosition(leftShift, width, containerWidth, leftPosition),
      transform: 'translateX(-50%)',
    };

    return (
      <div
        className='chart-viewer__current-info current-info'
        style={infoStyle}
        onClick={this.handleDateInfoClick}
      >
        <div className='current-info__date'>
          {formatDate(date, 'ddd, MMM DD')}
        </div>
        <ul className='current-info__lines'>
          {lines.map(({ name, value, color }) => (
            <li key={name} className='current-info__line' style={{ color }}>
              <p className='current-info__line-value'>{value}</p>
              <p className='current-info__line-name'>{name}</p>
            </li>
          ))}
        </ul>

      </div>
    );
  }

  render() {
    const { lines, valueScales } = this.props;
    return (
      <div className='chart-viewer'>
        <div className='chart-viewer__lines' ref={this.container}>
          <ul className='chart-viewer__value-scales'>
            {valueScales.map((value, i) => (
              <li
                key={value}
                className='chart-viewer__value-scale'
                style={{ bottom: `${i * 18}%` }}
              >
                {value}
              </li>
            ))}
          </ul>
          {lines.map(({ name }) => (
            <canvas
              ref={this.ref[name]}
              key={name}
              id={name}
              className='chart-viewer__line'
              onClick={this.handleLineClick}
              width="100"
              height="200"
            />
          ))}
        </div>
        <ul className='chart-viewer__dates' ref={this.dates}>
          {this.renderDates()}
        </ul>
        {this.renderCurrentDateInfo()}
      </div>
    );
  }
}

ChartViewer.propTypes = {
  lines: PropTypes.array.isRequired,
  dates: PropTypes.array.isRequired,
  valueScales: PropTypes.array.isRequired,
  lineLength: PropTypes.number.isRequired,
  currentDate: PropTypes.number,
  currentDateInfo: PropTypes.object.isRequired,

  thumbPosition: PropTypes.number.isRequired,
  thumbWidth: PropTypes.number.isRequired,

  maxYPoint: PropTypes.number.isRequired,
  viewerMaxYPoint: PropTypes.number.isRequired,
};
