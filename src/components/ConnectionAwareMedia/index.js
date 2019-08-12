
import React from 'react';

import { useEffectiveConnectionType } from '../../utils/hooks';
import './connection-aware-media.css';
import laptop from '../../assets/images/dennis-brendel-bSBJ7PYA3DU-unsplash.jpg';
import scooter from '../../assets/images/harley-davidson-XnhmpwEbv5I-unsplash.jpg';

const ConnectionAwareMedia = () => {
  const { effectiveConnectionType } = useEffectiveConnectionType();

  console.log('[ConnectionAwareMedia] effectiveConnectionType => ', effectiveConnectionType);
  let media;
  switch (effectiveConnectionType) {
    case 'slow-2g':
      media = <img className='responsive' src='https://cdn.glitch.com/8d7fb7f0-a9be-4a8c-96c7-8af286af487e%2Fmin-res.jpg?v=1562842586912' alt='low resolution' />;
      break;
    case '2g':
      media = <img className='responsive' src='https://cdn.glitch.com/8d7fb7f0-a9be-4a8c-96c7-8af286af487e%2Fmedium-res.jpg?v=1562842587169' alt='medium resolution' />;
      break;
    case '3g':
      media = <img className='responsive' src='https://cdn.glitch.com/8d7fb7f0-a9be-4a8c-96c7-8af286af487e%2Fmax-res.jpg?v=1562842587982' alt='high resolution' />;
      break;
    case '4g':
      media = <video className='responsive' src='https://cdn.glitch.com/8d7fb7f0-a9be-4a8c-96c7-8af286af487e%2F4g-video.mp4?v=1562842601068' controls />;
      break;
    default:
      media = <video className='responsive' src='https://cdn.glitch.com/8d7fb7f0-a9be-4a8c-96c7-8af286af487e%2F4g-video.mp4?v=1562842601068' controls />;
      break;
  }

  return (
    <div className='root-frame'>
      <img className='responsive' src={laptop} alt='laptop' />
      {media}
      <img className='responsive' src={scooter} alt='scooter' />
    </div>
  );
};

export default ConnectionAwareMedia;
