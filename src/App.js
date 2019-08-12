
import React from 'react';

import ConnectionAwareMedia from './components/ConnectionAwareMedia';
import ImageGallery from './components/ImageGallery';
import laptop from './assets/images/dennis-brendel-bSBJ7PYA3DU-unsplash.jpg';
import scooter from './assets/images/harley-davidson-XnhmpwEbv5I-unsplash.jpg';
import './App.css';

const galleryImages = [
  {
    src: laptop,
    alt: 'laptop'
  },
  {
    src: scooter,
    alt: 'scooter'
  }
];

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <ConnectionAwareMedia />
        <ImageGallery images={galleryImages} />
      </header>
    </div>
  );
};

export default App;
