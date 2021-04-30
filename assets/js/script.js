window.onload = function() {
  // ACCORDION FUNCTION
  // GET THE MAIN ELEMENT
  const getAccordionWrap = document.getElementsByClassName('accordion_menu');
  [...getAccordionWrap].forEach((el) => {
    // GET EACH CHILD
    const liEl = el.childNodes;
    for (let i = 0; i < liEl.length; i++) {
      liEl[i].addEventListener('click', function (e) {
        const classList = this.classList;
        if (classList.contains('active')) {
          this.classList.remove('active');
        } else {
          [...document.getElementsByClassName('active')].forEach((el) => {
            el.classList.remove('active');
          })
          this.classList.add('active');
        }
      });
    }
  });

  // MOBILE MENU
  const hamburgerMenu = document.getElementById('mobileMenu');

  hamburgerMenu.addEventListener('click', function (e) {
    const classList = this.parentElement.classList;
    const body = document.getElementsByTagName("body")[0];
    console.log('test', body);
    if (classList.contains('open')) {
      this.parentElement.classList.remove('open');
      body.classList.remove('blockScroll');
    } else {
      this.parentElement.classList.add('open');
      body.classList.add('blockScroll');
    }
  });

};
