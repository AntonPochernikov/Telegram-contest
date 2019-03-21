import React from 'react';
import './ChartControls.css';

const ChartControls = ({ lines, visibleLines, setLineVisibility }) => {
  const handleCheckboxClick = id => () => {
    setLineVisibility({ lineId: id });
  };

  return (
    <ul className='chart-controls'>
      {lines.map(({ id, name, color }) => {
        const checked = visibleLines.includes(id);
        const checkBoxStyle = {
          borderColor: color,
          backgroundColor: checked ? color : 'transparent',
        };
        return (
          <li className='chart-control' key={id}>
            <input
              className='chart-control__checkbox'
              id={`chart-control-${id}`}
              type='checkbox'
              checked={checked}
              onChange={handleCheckboxClick(id)}
            />
            <label
              className='chart-control__label'
              htmlFor={`chart-control-${id}`}
            >
              <div className='chart-control__label-checkbox' style={checkBoxStyle} />
              {name}
            </label>
          </li>
        );
      })}
    </ul>
  );
};

export default ChartControls;
