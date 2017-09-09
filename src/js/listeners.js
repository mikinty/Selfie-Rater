const snapButton = $('.snap');
const flash = $('.flash');

snapButton.on('click', () => {
  flash.addClass('click');
  setTimeout(() => {
    flash.removeClass('click');
  }, 200);
});