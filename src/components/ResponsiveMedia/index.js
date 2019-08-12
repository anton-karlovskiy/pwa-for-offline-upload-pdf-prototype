
import React from 'react';

import './responsive-media.css';

const ResponsiveMedia = ({ image, video, alt, ...rest }) => {
  let media = null;
  if (image) {
    media = <img className='responsive' alt={alt} { ...rest } />;
  } else if (video) {
    media = <video className='responsive' { ...rest } />;
  }

  return media;
};

export default ResponsiveMedia;
