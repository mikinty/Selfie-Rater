// import stylesheets
require('../css/main.scss');

// button listeners
require('./listeners');

/* global tracking */

const SelfieTracker = () => {
  SelfieTracker.base(this, 'constructor');
};

tracking.inherits(SelfieTracker, tracking.Tracker);

// Per frame processing
SelfieTracker.prototype.track = function(pixel, width, height) {
  // ML scoring here
  $.ajax({
    url: 'http://18.220.71.37/rateme',
    type: 'POST',
    data: JSON.stringify({
      pixels: Array.from(pixel),
      width: width,
      height: height,
    }),
    contentType: 'application/json',
    dataType: 'json',
  }).done((response) => {
    this.emit('track', response);
  });
};

const selfieTracker = new SelfieTracker();

selfieTracker.on('track', function(event) {
  // Update scores in UI
  // console.log(event);
});

const trackerTask = tracking.track('#myVideo', selfieTracker, {camera: true});
setTimeout(() => trackerTask.stop(), 10000);
