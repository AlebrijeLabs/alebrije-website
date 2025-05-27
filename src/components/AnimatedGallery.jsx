import React from 'react';
import './AnimatedGallery.css';

const alebrijeImages = [
  'Frog-Hummingbird.png',
  'Eagle-Lizard.png',
  'Wolf-Fish.png',
  'Fox-Butterfly.png',
  'Owl-Serpent.png',
  'Dragon-Jaguar.png',
  'Turtle-Bat.png',
  'Snake-Quetzal.png',
  'Horse-Phoenix.png',
  'Cat-Chameleon.png',
  'Sheet-Coyote.png',
  'Crab-Dragonfly.png'
];

function AnimatedGallery({ side }) {
  // Split images into two groups
  const images = side === 'left' 
    ? alebrijeImages.slice(0, 6)
    : alebrijeImages.slice(6);

  return (
    <div className={`alebrije-gallery ${side}`}>
      {images.map((image, index) => (
        <div 
          key={image} 
          className="alebrije-item"
          style={{
            '--delay': `${index * 0.4}s`,
            '--direction': side === 'left' ? 'right' : 'left'
          }}
        >
          <img 
            src={`/images/${image}`} 
            alt={`Alebrije ${image.split('.')[0]}`}
            className="alebrije-image"
          />
        </div>
      ))}
    </div>
  );
}

export default AnimatedGallery; 