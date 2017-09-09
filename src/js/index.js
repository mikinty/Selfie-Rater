// import stylesheets
require('../css/main.scss');

// button listeners
require('./listeners');

/* global tracking */
require('tracking/build/data/face-min');

tracking.ObjectTracker.prototype.track = function(pixels, width, height) {
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

faceTracker.on('track', function(event) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  event.data.forEach((rect) => {
    console.log(event);

    // Send for scoring
    $.ajax({
      url: 'http://18.220.71.37/rateme',
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
      document.getElementById("ratingNum").innerHTML = response.rating;
    });

    // Draw face detection
    context.strokeStyle = '#a64ceb';
    context.strokeRect(rect.x, rect.y, rect.width, rect.height);
    context.font = '11px Helvetica';
    context.fillStyle = '#fff';
    context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
    context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
  });
});

const faceTask = tracking.track('#myVideo', faceTracker, {camera: true});
setTimeout(() => {
  faceTask.stop();
  console.log('Stopped task!');
}, 30000);
