import React from 'react';
import ChartScroller from './ChartScroller.js';
import ChartControls from './ChartControls.js';
import './WorkSpace.css';

const WorkSpace = () => (
  <main className='workspace'>
    <div className='chart-view' />
    <ChartScroller />
    <ChartControls />
  </main>
);

export default WorkSpace;
