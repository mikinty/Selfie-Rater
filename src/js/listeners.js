const snapButton = $('.snap');
const flash = $('.flash');
const canvas = $('.canvas')[0];
const dlink = $('.download');
const video = $('#myVideo')[0];
const redo = $('.redo');
const download = $('.download');

snapButton.on('click', () => {
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
  var context = canvas.getContext('2d');
  const dX = 110;
  const dY = 80;
  context.drawImage(video, dX, 0, canvas.width + dX - 20, canvas.height + dY, 0, 0, canvas.width, canvas.height);
  dlink.attr('href', canvas.toDataURL('image/png'));
});