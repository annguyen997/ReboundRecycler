import React from 'react';
import Map from './map';
import {Loader, LoaderOptions} from 'google-maps';

function MyMap() {

  const options: LoaderOptions = {/* todo */};
  const loader = new Loader(null, options);

  loader.load().then(function (google) {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8,
      });
  });

  return (
    <div className="nothin">
      <p>oop</p>
    </div>
  );
}

export default MyMap;
