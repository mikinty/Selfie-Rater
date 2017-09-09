const snapButton = $('.snap');
const flash = $('.flash');
const canvas = $('.canvas')[0];
const dlink = $('.download');
const video = $('#myVideo')[0];

snapButton.on('click', () => {
  // flash animation
  flash.addClass('click');
  setTimeout(() => {
    flash.removeClass('click');
  }, 200);

  // download photo
  console.log(video.width, video.height, canvas.width, canvas.height);
  var context = canvas.getContext('2d');
  const dX = 110;
  const dY = 80;
  context.drawImage(video, dX, 0, canvas.width + dX - 20, canvas.height + dY, 0, 0, canvas.width, canvas.height);
  var a = canvas.toDataURL('image/png');
  dlink.attr('href', a);
});