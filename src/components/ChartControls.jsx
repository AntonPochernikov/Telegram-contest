import React from 'react';

const ChartControls = ({ lines, visibleLines, setLineVisibility }) => {
  const handleCheckboxClick = id => () => {
    setLineVisibility({ lineId: id });
  };

  return (
    <ul className='chart-controls'>
      {lines.map(({ id, name }) => (
        <li className='chart-control' key={id}>
          <label className='chart-control__label' htmlFor={`chart-control-${id}`}>{name}</label>
          <input
            className='chart-control__checkbox'
            id={`chart-control-${id}`}
            type='checkbox'
            checked={visibleLines.includes(id)}
            onChange={handleCheckboxClick(id)}
          />
        </li>
      ))}
    </ul>
  );
};

export default ChartControls;
