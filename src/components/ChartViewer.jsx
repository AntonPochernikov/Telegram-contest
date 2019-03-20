import React from 'react';
import PropTypes from 'prop-types';
import { format as formatDate } from 'date-fns';
import _ from 'lodash';
import './ChartViewer.css';

export default class ChartViewer extends React.Component {
  static defaultProps = {
    lines: [],
    maxYPoint: 0,
    visibleMaxYPoint: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
    };

    this.ref = {};
    this.props.lines.forEach(({ name }) => {
      this.ref[name] = React.createRef();
    });
    this.container = React.createRef();
    this.dates = React.createRef();
  }

  componentDidMount() {
    this.renderChartLines();
    this.setState({
      mounted: true,
    });
  }

  componentDidUpdate() {
    this.renderChartLines();
  }

  renderChartLines() {
    const { width, height } = this.container.current.getBoundingClientRect();
    const { thumbWidth, thumbPosition } = this.props;
    const containerWidth = width / thumbWidth;
    this.container.current.style.width = containerWidth;

    const { visibleMaxYPoint } = this.props;
    const heightModifier = height / (visibleMaxYPoint * 1.05);

    this.props.lines.forEach(({ name, column, color }) => {
      const canvas = this.ref[name].current;
      canvas.style.transform = `translateX(${-containerWidth * thumbPosition}px)`;

      const cols = column.length - 1;
      const step = 1 / cols * containerWidth;

      const ctx = canvas.getContext('2d');
      ctx.canvas.width = containerWidth;
      ctx.canvas.height = height;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(0, height);
      let x = 0;

      column.forEach((y, i) => {
        if (i === 0) {
          ctx.moveTo(x, height - (y * heightModifier));
          return;
        }
        x += step;
        ctx.lineTo(x, height - (y * heightModifier));
        ctx.moveTo(x, height - (y * heightModifier));
      });

      ctx.stroke();
      ctx.closePath();
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
    const dates = this.props.xAxis.column;
    const filteredDates = dates
      .slice(0, dates.length - 1)
      .filter((date, i) => i % Math.floor(dates.length / datesCount) === 0)
      .concat(_.last(dates));
    return filteredDates.map(date => (
      <li className='chart-viewer__date' key={date}>{formatDate(date, 'MMM DD')}</li>
    ));
  }

  render() {
    const { lines } = this.props;
    return (
      <div className='chart-viewer'>
        <div className='chart-viewer__lines' ref={this.container}>
          {lines.map(({ name }) => (
            <canvas
              ref={this.ref[name]}
              key={name}
              id={name}
              className='chart-viewer__line'
              width="100"
              height="200"
            />
          ))}
        </div>
        <ul className='chart-viewer__dates' ref={this.dates}>
          {this.renderDates()}
        </ul>
      </div>
    );
  }
}

ChartViewer.propTypes = {
  lines: PropTypes.array.isRequired,
  maxYPoint: PropTypes.number.isRequired,
  visibleMaxYPoint: PropTypes.number.isRequired,
};
