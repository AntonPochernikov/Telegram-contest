import React from 'react';
import PropTypes from 'prop-types';
import './ChartScroller.css';

const margin = 30;
const thumbThreshold = 0.2;

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
    this.renderChartLines();
  }

  componentDidUpdate() {
    this.renderChartLines();
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
    const thumbPosition = width * this.props.thumbPosition;
    const mousePosition = e.pageX;
    if (!this.mouseOnThumbPosition) {
      this.mouseOnThumbPosition = mousePosition - margin - thumbPosition;
    }
    const spaceLeft = thumbWidth - this.mouseOnThumbPosition;

    switch (true) {
      // out of left bound case
      case (mousePosition - margin - this.mouseOnThumbPosition < 0): {
        nextThumbPosition = 0;
        break;
      }
      // out of right bound case
      case (mousePosition > width + margin - spaceLeft): {
        nextThumbPosition = (width - thumbWidth) / width;
        break;
      }
      default: {
        nextThumbPosition = (mousePosition - margin - this.mouseOnThumbPosition) / width;
      }
    }
    this.props.setThumbPosition({ position: nextThumbPosition });
  }

  handleThumbUp = () => {
    this.mouseOnThumbPosition = null;
    window.removeEventListener('mousemove', this.handleThumbMove);
    window.removeEventListener('mouseup', this.handleThumbUp);
  }

  handleThumbDrag = (e) => {
    e.preventDefault();
  }

  handleThumbLeftResizerDown = (e) => {
    e.stopPropagation();
    window.addEventListener('mousemove', this.handleLeftResizeMove);
    window.addEventListener('mouseup', this.handleLeftResizeUp);
    return false;
  }

  handleLeftResizeMove = (e) => {
    const mousePosition = e.pageX;
    const { width } = this.container.current.getBoundingClientRect();
    const thumbPosition = this.props.thumbPosition * width;
    const thumbWidth = this.props.thumbWidth * width;
    const thumbPositionRight = thumbPosition + thumbWidth;
    let nextThumbWidth;
    let nextThumbPosition;

    switch (true) {
      // out of left bound case
      case (mousePosition - margin < 0): {
        nextThumbPosition = 0;
        nextThumbWidth = (thumbWidth - nextThumbPosition * width + thumbPosition) / width;
        break;
      }
      // thumb thiner than threshold case
      case ((thumbWidth + thumbPosition + margin - mousePosition) < thumbThreshold * width): {
        nextThumbWidth = thumbThreshold;
        nextThumbPosition = (thumbPositionRight - thumbThreshold * width) / width;
        break;
      }
      default: {
        nextThumbPosition = (mousePosition - margin) / width;
        nextThumbWidth = (thumbWidth - nextThumbPosition * width + thumbPosition) / width;
      }
    }
    this.props.setThumbPositionWidth({ position: nextThumbPosition, width: nextThumbWidth });
  }

  handleLeftResizeUp = () => {
    window.removeEventListener('mousemove', this.handleLeftResizeMove);
    window.removeEventListener('mouseup', this.handleLeftResizeUp);
  }

  handleThumbRightResizerDown = (e) => {
    e.stopPropagation();
    window.addEventListener('mousemove', this.handleRightResizeMove);
    window.addEventListener('mouseup', this.handleRightResizeUp);
    return false;
  }

  handleRightResizeMove = (e) => {
    const mousePosition = e.pageX;
    const { width } = this.container.current.getBoundingClientRect();
    const thumbPosition = this.props.thumbPosition * width;
    let nextThumbWidth;
    switch (true) {
      // thumb thiner than threshold case
      case (mousePosition - margin < thumbPosition + thumbThreshold * width): {
        nextThumbWidth = thumbThreshold;
        break;
      }
      // out of right bound case
      case (mousePosition > width + margin): {
        nextThumbWidth = (width - thumbPosition) / width;
        break;
      }
      default: {
        nextThumbWidth = (mousePosition - thumbPosition - margin) / width;
      }
    }
    this.props.setThumbWidth({ width: nextThumbWidth });
  }

  handleRightResizeUp = () => {
    window.removeEventListener('mousemove', this.handleRightResizeMove);
    window.removeEventListener('mouseup', this.handleRightResizeUp);
  }


  renderChartLines() {
    const { width, height } = this.container.current.getBoundingClientRect();
    this.alignScrollThumb();

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
    const { lines, thumbPosition, thumbWidth } = this.props;
    const overlayWidthLeft = thumbPosition * 100;
    const overlayWidthRight = 100 - thumbPosition * 100 - thumbWidth * 100;
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
          className='chart-scroller__overlay chart-scroller__overlay--left'
          style={{ width: `${overlayWidthLeft}%` }}
        />
        <div
          className='chart-scroller__overlay chart-scroller__overlay--right'
          style={{ width: `${overlayWidthRight}%` }}
        />
        <div
          className='chart-scroller__thumb'
          ref={this.scrollThumb}
          onMouseDown={this.handleThumbDown}
          onDragStart={this.handleThumbDrag}
          tabIndex={0}
        >
          <div className='chart-scroller__thumb-border chart-scroller__thumb-border--top' />
          <div className='chart-scroller__thumb-border chart-scroller__thumb-border--bottom' />
          <div
            className='chart-scroller__thumb-resizer chart-scroller__thumb-resizer--left'
            onMouseDown={this.handleThumbLeftResizerDown}
          />
          <div
            className='chart-scroller__thumb-resizer chart-scroller__thumb-resizer--right'
            onMouseDown={this.handleThumbRightResizerDown}
          />
        </div>
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
