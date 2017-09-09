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

  // animation
  snapButton.addClass('inactive');
  redo.addClass('active');
  download.addClass('active');

  // download photo
  dlink.attr('href', snapCurrentFrame());
};

let highestRating = -1;
let bestSnap = '';
let bestSnapId = 0;

const snapBest = () => {
  // In setTimeout so as not to block thread
  bestSnapId = setTimeout(() => {
    const currRating = parseFloat(rating.text());
    console.log(currRating, highestRating);
    if (currRating > highestRating) {
      highestRating = currRating;
      bestSnap = snapCurrentFrame();
    }

    snapBest();
  }, 100);
};

let holdTimeoutId = 0;
let heldDown = false;
snapButton
  .mousedown(() => {
    console.log('Down...');

    // To be called in the future if no mouseup in time
    holdTimeoutId = setTimeout(() => {
      console.log('Held down!');
      heldDown = true;
      snapBest();
    }, 500);
  })
  .mouseup(() => {
    console.log('...Up');

    // Only execute if not held down
    if (!heldDown) {
      // Cancels any hold down callback
      clearTimeout(holdTimeoutId);

      console.log('Not held down!');
      snapSingle();
    }
    // End of holding down
    else {
      console.log('Held down end!');
      clearTimeout(bestSnapId);
      console.log(highestRating);

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

  // animation
  snapButton.removeClass('inactive');
  redo.removeClass('active');
  download.removeClass('active');
});
