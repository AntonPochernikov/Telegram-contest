import React from 'react';
import PropTypes from 'prop-types';
import './ChartScroller.css';

const leftMargin = 20;

export default class ChartScroller extends React.Component {
  static defaultProps = {
    lines: [],
    maxYPoint: 0,
    visibleMaxYPoint: 0,

    thumbPosition: 0,
    thumbWidth: 0,
  }

  constructor(props) {
    super(props);

    this.ref = {};
    this.props.lines.forEach(({ name }) => {
      this.ref[name] = React.createRef();
    });
    this.container = React.createRef();
    this.scrollThumb = React.createRef();
  }

  componentDidMount() {
    this.renderCanvas();
  }

  componentDidUpdate() {
    this.renderCanvas();
  }

  alignScrollThumb() {
    const { width } = this.container.current.getBoundingClientRect();
    const { thumbPosition, thumbWidth } = this.props;
    this.scrollThumb.current.style.width = `${width * thumbWidth}px`;
    this.scrollThumb.current.style.transform = `translateX(${thumbPosition * width}px)`;
  }

  handleThumbDown = () => {
    window.addEventListener('mousemove', this.handleThumbMove);
    window.addEventListener('mouseup', this.handleThumbUp);
  }

  handleThumbMove = (e) => {
    let nextThumbPosition;
    const { width } = this.container.current.getBoundingClientRect();
    const thumbWidth = width * this.props.thumbWidth;

    switch (true) {
      case (e.pageX - leftMargin - (thumbWidth / 2) < 0): {
        nextThumbPosition = 0;
        break;
      }
      case (e.pageX > width + leftMargin - (thumbWidth / 2)): {
        nextThumbPosition = (width - thumbWidth) / width;
        break;
      }
      default: {
        nextThumbPosition = (e.pageX - leftMargin - (thumbWidth / 2)) / width;
      }
    }
    this.props.setThumbPosition({ position: nextThumbPosition });
  }

  handleThumbUp = () => {
    window.removeEventListener('mousemove', this.handleThumbMove);
    window.removeEventListener('mouseup', this.handleThumbUp);
  }

  handleThumbDrag = (e) => {
    e.preventDefault();
    window.removeEventListener('mousemove', this.handleThumbMove);
    window.removeEventListener('mouseup', this.handleThumbUp);
  }

  renderCanvas() {
    const { width, height } = this.container.current.getBoundingClientRect();
    this.alignScrollThumb();

    // const { maxYPoint, visibleMaxYPoint } = this.props;
    const { visibleMaxYPoint } = this.props;
    const heightModifier = 50 / (visibleMaxYPoint * 1.05);

    this.props.lines.forEach(({ name, column, color }) => {
      const canvas = this.ref[name].current;

      const cols = column.length - 1;
      const step = 1 / cols * width;

      const ctx = canvas.getContext('2d');
      ctx.canvas.width = width;
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

  render() {
    const { lines } = this.props;
    return (
      <div className='chart-scroller' ref={this.container}>
        {lines.map(({ name }) => (
          <canvas
            ref={this.ref[name]}
            key={name}
            id={name}
            className='chart-scroller__line'
            width="100"
            height="200"
          />
        ))}
        <div
          className='chart-scroller__thumb'
          ref={this.scrollThumb}
          onMouseDown={this.handleThumbDown}
          onDrag={this.handleThumbDrag}
        />
      </div>
    );
  }
}

ChartScroller.propTypes = {
  lines: PropTypes.array.isRequired,
  maxYPoint: PropTypes.number.isRequired,
  visibleMaxYPoint: PropTypes.number.isRequired,

  thumbPosition: PropTypes.number.isRequired,
  thumbWidth: PropTypes.number.isRequired,
};
