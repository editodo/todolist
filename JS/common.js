$(function(){
  const editodoWrap = document.querySelector('.editodo_wrap');
  const theme = sessionStorage.getItem('theme');
  const color = sessionStorage.getItem('color');
  const mode = sessionStorage.getItem('mode');


  // 옵션 선택 
  var mySwiper = new Swiper('.swiper-container.option', {
    slidesPerView: 'auto',
    freeMode: true,
    loop: false,
    roundLengths: true
  })
  //하루일기 - 스티커 
  var mySwiper = new Swiper('.swiper-container.emoji', {
    slidesPerView: 'auto',
    freeMode: true,
    loop: false,
    roundLengths: true,
  })


  //옵션 & 테마 적용 
  editodoWrap.classList.add('lightmode', 'style_simple', 'palette_simple'); // 디폴트 컬러 적용
  editodoWrap.classList.add(mode, theme, color); // 선택된 옵션 적용

  //날짜 출력
  const init = {
    monList: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    dayList: ['일', '월', '화', '수', '목', '금', '토'],
    today: new Date(),
    monForChange: new Date().getMonth(),
    activeDate: new Date(),
    getFirstDay: (yy, mm) => new Date(yy, mm, 1),
    getLastDay: (yy, mm) => new Date(yy, mm + 1, 0),
    nextMonth: function () {
      let d = new Date();
      d.setDate(1);
      d.setMonth(++this.monForChange);
      this.activeDate = d;
      return d;
    },
    prevMonth: function () {
      let d = new Date();
      d.setDate(1);
      d.setMonth(--this.monForChange);
      this.activeDate = d;
      return d;
    },
    addZero: (num) => (num < 10) ? '0' + num : num,
    activeDTag: null,
    getIndex: function (node) {
      let index = 0;
      while (node = node.previousElementSibling) {
        index++;
      }
      return index;
    }
  };
  
  const $calBody = document.querySelector('.todolist_table');
  const $btnNext = document.querySelector('.btn_arrow.next');
  const $btnPrev = document.querySelector('.btn_arrow.prev');
  const dailydiary = document.querySelector('.daily-diary');
  
  /**
   * @param {number} date
   * @param {number} dayIn
  */

  /**
   * @param {date} fullDate
   */
  function loadYYMM (fullDate) {
    let yy = fullDate.getFullYear();
    let mm = fullDate.getMonth();
    let firstDay = init.getFirstDay(yy, mm);
    let lastDay = init.getLastDay(yy, mm);
    let markToday;  // for marking today date
    let week = ['일', '월', '화', '수', '목', '금', '토']; 
    let markWeek = week[new Date().getDay()];
    
    if (mm === init.today.getMonth() && yy === init.today.getFullYear()) {
      markToday = init.today.getDate();
    }


    document.querySelector('.date_now .month').textContent = init.monList[mm];
    document.querySelector('.date_now .year').textContent = yy;
    document.querySelector('.date_now .week').textContent = week[markWeek];

  }

  loadYYMM(init.today);
  
  $btnNext.addEventListener('click', () => loadYYMM(init.nextMonth()));
  $btnPrev.addEventListener('click', () => loadYYMM(init.prevMonth()));
  

}); //End