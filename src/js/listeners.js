const snapButton = $('.snap');
const flash = $('.flash');
const canvas = $('.canvas')[0]; // the actual canvas DOM element
const dlink = $('.download');
const video = $('#myVideo')[0];
const redo = $('.redo');
const download = $('.download');

var context = canvas.getContext('2d');

const takeSnapshot = () => {
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
  console.log(video.width, video.height, canvas.width, canvas.height);
  const dX = 110;
  const dY = 80;
  context.drawImage(video, dX, 0, canvas.width + dX - 20, canvas.height + dY, 0, 0, canvas.width, canvas.height);
  dlink.attr('href', canvas.toDataURL('image/png'));
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
    }, 500);
  })
  .mouseup(() => {
    console.log('...Up');

    // Cancels any hold down callback
    clearTimeout(holdTimeoutId);

    // Only execute if not held down
    if (!heldDown) {
      console.log('Not held down!');
      takeSnapshot();
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
