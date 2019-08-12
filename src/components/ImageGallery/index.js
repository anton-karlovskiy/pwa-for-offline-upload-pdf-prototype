
import React from 'react';

import ResponsiveMedia from '../ResponsiveMedia';
import './image-gallery.css';

// cache name 'images' based on CacheFirst strategy
const ImageGallery = ({ images }) => (
  <div className='image-gallery'>
    { images.map(image => (
      <div key={image.src}><ResponsiveMedia src={image.src} alt={image.alt} image /></div>
    )) }
  </div>
);

export default ImageGallery;
