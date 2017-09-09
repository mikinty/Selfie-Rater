/* global tracking */

const SelfieTracker = () => {
  SelfieTracker.base(this, 'constructor');
};

tracking.inherits(SelfieTracker, tracking.Tracker);

// Per frame processing
SelfieTracker.prototype.track = function(pixel, width, height) {
  // ML scoring here

  this.emit('track', {
    // stuff to be passed as 'event'
    data: [1, 2, 3], // Arbitrary for now
  });
};

const selfieTracker = new SelfieTracker();

selfieTracker.on('track', function(event) {
  // Update scores in UI
  console.log(event);
});

tracking.track('#myVideo', selfieTracker, {camera: true});
