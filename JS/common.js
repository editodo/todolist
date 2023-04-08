$(function(){
  const editodoWrap = document.querySelector('.editodo_wrap');
  const theme = sessionStorage.getItem('theme');
  const color = sessionStorage.getItem('color');
  const mode = sessionStorage.getItem('mode');

  //옵션 선택
  $('.slick_list').slick({
    slide: 'li',
    arrows: false,
    variableWidth: true,
    infinite: false,
    focusOnSelect: true,
    swipeToSlide: true
  });

  //하루일기 이모지 
  $('.sticker_emoji').slick({
    slide: 'li',
    arrows: false,
    variableWidth: true,
    infinite: false,
    focusOnSelect: true,
    swipeToSlide: true,
  });

  $('.sticker_emoji').on('afterChange', function(){
    $('.slick-slide').removeClass('on');
    $(this).find('.slick-current').addClass('on');
  });

  //옵션 & 테마 적용 
  editodoWrap.classList.add('palette_default'); // 디폴트 컬러 적용
  editodoWrap.classList.add(mode, theme, color); // 선택된 옵션 적용


}); //End