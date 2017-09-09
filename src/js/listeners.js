const snapWrapper = $('.snap-wrapper');
const snapButton = $('.snap');
const flash = $('.flash');
const canvas = $('.canvas')[0]; // the actual canvas DOM element
const hCanvas = $('.hidden-canvas')[0]; // the actual canvas DOM element
const dlink = $('.download');
const video = $('#myVideo')[0];
const redo = $('.redo');
const download = $('.download');
const rating = $('#ratingNum');

var context = canvas.getContext('2d');
const hContext = hCanvas.getContext('2d');

const snapCurrentFrame = (hidden = false) => {
  console.log(video.width, video.height, canvas.width, canvas.height);
  const dX = 110;
  const dY = 80;
  let ctx = context;
  let cvs = canvas;
  if (hidden) {
    ctx = hContext;
    cvs = hCanvas;
  }

  ctx.drawImage(video, dX, 0, cvs.width + dX - 20, cvs.height + dY, 0, 0, cvs.width, cvs.height);

  return cvs.toDataURL('image/png');
};

const snapSingle = () => {
  // flash animation
  flash.addClass('click');
  setTimeout(() => {
    flash.removeClass('click');
  }, 200);

  rating.addClass('freeze');

  // animation
  snapButton.addClass('inactive');
  redo.addClass('active');
  download.addClass('active');

  // download photo
  dlink.attr('href', snapCurrentFrame());
};

let highestRating = 0;
let bestSnap = '';
let bestSnapId = 0;

const snapBest = () => {
  // In setTimeout so as not to block thread
  bestSnapId = setTimeout(() => {
    const currRating = parseFloat(rating.text());
    console.log(currRating, highestRating);
    if (currRating >= highestRating) {
      highestRating = currRating;
      bestSnap = snapCurrentFrame(true); // hidden canvas
    }
    snapBest();
  }, 100);
};

let holdTimeoutId = 0;
let heldDown = false;
snapButton
  .mousedown(() => {
    // To be called in the future if no mouseup in time
    holdTimeoutId = setTimeout(() => {
      // canvas appears while button is held down
      hCanvas.style.display = 'block'; 
      snapWrapper.addClass('pressed');
      heldDown = true;
      snapBest();
    }, 500);
  })
  .mouseup(() => {
    hCanvas.style.display = 'none';
    snapWrapper.removeClass('pressed');
    // Only execute if not held down
    if (!heldDown) {
      // Cancels any hold down callback
      clearTimeout(holdTimeoutId);

      snapSingle();
    }
    // End of holding down
    else {
      clearTimeout(bestSnapId);
      rating.text(highestRating);
      console.log(highestRating);

      // Draw best snap onto the main canvas
      const img = new Image();
      img.onload = () => context.drawImage(img, 0, 0);
      img.src = bestSnap;

      rating.addClass('freeze');

      // animation
      snapButton.addClass('inactive');
      redo.addClass('active');
      download.addClass('active');

      // download photo
      dlink.attr('href', bestSnap);
    }
    heldDown = false;
  });

// redo button
redo.on('click', () => {
  context.clearRect(0, 0, canvas.width, canvas.height);

  rating.removeClass('freeze');

  // animation
  snapButton.removeClass('inactive');
  redo.removeClass('active');
  download.removeClass('active');
});
