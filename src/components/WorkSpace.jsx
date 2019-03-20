import React from 'react';
import ChartViewer from './ChartViewer.js';
import ChartScroller from './ChartScroller.js';
import ChartControls from './ChartControls.js';
import './WorkSpace.css';

const WorkSpace = () => (
  <main className='workspace'>
    <ChartViewer />
    <ChartScroller />
    <ChartControls />
  </main>
);

export default WorkSpace;
