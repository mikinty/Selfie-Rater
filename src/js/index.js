// import stylesheets
require('../css/main.scss');

// button listeners
require('./listeners');

/* global tracking */
require('tracking/build/data/face-min');

const RATING_EXPIRY = 3000;
const BACKEND_URL = 'http://18.220.71.37/rateme';
const DETECTION_COLOR = '#a64ceb';

tracking.ObjectTracker.prototype.track = function (pixels, width, height) {
  var self = this;
  var classifiers = this.getClassifiers();

  if (!classifiers) {
    throw new Error('Object classifier not specified, try `new tracking.ObjectTracker("face")`.');
  }

  var results = [];

  classifiers.forEach(function(classifier) {
    results = results.concat(tracking.ViolaJones.detect(pixels, width, height, self.getInitialScale(), self.getScaleFactor(), self.getStepSize(), self.getEdgesDensity(), classifier));
  });

  this.emit('track', {
    data: results,
    pixels: pixels,
    width: width,
    height: height,
  });
};

const faceTracker = new tracking.ObjectTracker('face');
faceTracker.setInitialScale(4);
faceTracker.setStepSize(2);
faceTracker.setEdgesDensity(0.1);

const canvas = document.getElementById('face');
const context = canvas.getContext('2d');

let last_face_ts = 0;

faceTracker.on('track', function(event) {
  // Clear rectangles
  context.clearRect(0, 0, canvas.width, canvas.height);

  // No face(s) found
  if (event.data.length === 0) {
    if (Date.now() - last_face_ts > RATING_EXPIRY) {
      // Reset rating
      document.getElementById('ratingNum').innerHTML = '--';
    }
  }
  // Face(s) found
  else {
    last_face_ts = Date.now();

    event.data.forEach((rect) => {
      // Send for scoring
      $.ajax({
        url: BACKEND_URL,
        type: 'POST',
        data: JSON.stringify({
          pixels: Array.from(event.pixels),
          width: event.width,
          height: event.height,
        }),
        contentType: 'application/json',
        dataType: 'json',
      }).done((response) => {
        // Update UI
        console.log(response);
        document.getElementById('ratingNum').innerHTML = response.rating.toFixed(2);
      });

      // Draw face detection
      context.strokeStyle = DETECTION_COLOR;
      context.strokeRect(rect.x, rect.y, rect.width, rect.height);
      context.font = '11px Helvetica';
      context.fillStyle = '#fff';
      context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
      context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
    });
  }
});

tracking.track('#myVideo', faceTracker, {camera: true});
