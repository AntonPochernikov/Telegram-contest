import React from 'react';
import './Preloader.css';

const Preloader = () => (
  <div className='preloader'>
    <div className='preloader__viewer' />
    <div className='preloader__scroller' />
    <div className='preloader__controls' />
  </div>
);

export default Preloader;
