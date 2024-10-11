class CartDrawer extends HTMLElement {
    constructor() {
      super();
  
      this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
      this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
      this.setHeaderCartIconAccessibility();
    }
  
    setHeaderCartIconAccessibility() {
      const cartLink = document.querySelector('#cart-icon-bubble');
      if (!cartLink) return;
  
      cartLink.setAttribute('role', 'button');
      cartLink.setAttribute('aria-haspopup', 'dialog');
      cartLink.addEventListener('click', (event) => {
        event.preventDefault();
        this.open(cartLink);
      });
      cartLink.addEventListener('keydown', (event) => {
        if (event.code.toUpperCase() === 'SPACE') {
          event.preventDefault();
          this.open(cartLink);
        }
      });
    }
  
    open(triggeredBy) {
      if (triggeredBy) this.setActiveElement(triggeredBy);
      const cartDrawerNote = this.querySelector('[id^="Details-"] summary');
      if (cartDrawerNote && !cartDrawerNote.hasAttribute('role')) this.setSummaryAccessibility(cartDrawerNote);
      // Your jQuery code goes here
      setTimeout(() => {
        this.classList.add('animate', 'active');
  
        $(document).ready(function() {
           setTimeout(() => {
          var $slider = $('.main-cart-pair-perfect .slider');
          var $progressBar = $('.main-cart-pair-perfect .progress');
          var $progressBarLabel = $( '.main-cart-pair-perfect .slider__label' );
          
          $slider.on('beforeChange', function(event, slick, currentSlide, nextSlide) {   
            var calc = ( (nextSlide) / (slick.slideCount-1) ) * 100;
            
            $progressBar
              .css('background-size', calc + '% 100%')
              .attr('aria-valuenow', calc );
            
            $progressBarLabel.text( calc + '% completed' );
          });
          setTimeout(function(){
            $('.main-cart-pair-perfect').css('opacity', '1');
          },1000);
          $slider.slick({
            slidesToShow: 3.2,
            speed: 400,
            responsive: [
          {
              breakpoint: 768, 
              settings: {
                  slidesToShow: 1
              }
          }
          ]
          }); 
  
  
       jQuery(document).ready(function(){
          jQuery('.back-to-cart').click(function(){
            jQuery('.main-cart-free-returns').slideToggle();
            jQuery('.bg-main-cart-free-returns').removeClass('active');
          });
          jQuery('.free-returns-btns').click(function(){
            jQuery('.main-cart-free-returns').slideToggle();
            jQuery('.bg-main-cart-free-returns').addClass('active');
          });
        }); 
             
             }, 1000); 
  
          
          });  
  
   function toggleFreeReturns() {
        var popup = document.querySelector('.main-free-return-popup');
        var bg = document.querySelector('.bg-color-main-return');
        var body = document.body;
  
        popup.classList.toggle('active');
        bg.classList.toggle('active');
        body.classList.toggle('overflow-hidden');
      }
  
      function closePopup() {
        var popup = document.querySelector('.main-free-return-popup');
        var bg = document.querySelector('.bg-color-main-return');
        var body = document.body;
  
        popup.classList.remove('active');
        bg.classList.remove('active');
        body.classList.remove('overflow-hidden');
      }
  
      function toggleAccordion(element) {
        element.classList.toggle('active');
        var closestDiv = element.closest('div');
        closestDiv.classList.toggle('active');
      }
  
        
        });
  
      this.addEventListener(
        'transitionend',
        () => {
          const containerToTrapFocusOn = this.classList.contains('is-empty')
            ? this.querySelector('.drawer__inner-empty')
            : document.getElementById('CartDrawer');
          const focusElement = this.querySelector('.drawer__inner') || this.querySelector('.drawer__close');
          trapFocus(containerToTrapFocusOn, focusElement);
        },
        { once: true }
      );
  
      document.body.classList.add('overflow-hidden');
    }
  
    close() {
      this.classList.remove('active');
      removeTrapFocus(this.activeElement);
      document.body.classList.remove('overflow-hidden');
    }
  
    setSummaryAccessibility(cartDrawerNote) {
      cartDrawerNote.setAttribute('role', 'button');
      cartDrawerNote.setAttribute('aria-expanded', 'false');
  
      if (cartDrawerNote.nextElementSibling.getAttribute('id')) {
        cartDrawerNote.setAttribute('aria-controls', cartDrawerNote.nextElementSibling.id);
      }
  
      cartDrawerNote.addEventListener('click', (event) => {
        event.currentTarget.setAttribute('aria-expanded', !event.currentTarget.closest('details').hasAttribute('open'));
      });
  
      cartDrawerNote.parentElement.addEventListener('keyup', onKeyUpEscape);
    }
  
    renderContents(parsedState) {
      this.querySelector('.drawer__inner').classList.contains('is-empty') &&
        this.querySelector('.drawer__inner').classList.remove('is-empty');
      this.productId = parsedState.id;
      this.getSectionsToRender().forEach((section) => {
        const sectionElement = section.selector
          ? document.querySelector(section.selector)
          : document.getElementById(section.id);
  
        if (!sectionElement) return;
        sectionElement.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
      });
  
      setTimeout(() => {
        this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
        this.open();
      });
    }
  
    getSectionInnerHTML(html, selector = '.shopify-section') {
      return new DOMParser().parseFromString(html, 'text/html').querySelector(selector).innerHTML;
    }
  
    getSectionsToRender() {
      return [
        {
          id: 'cart-drawer',
          selector: '#CartDrawer',
        },
        {
          id: 'cart-icon-bubble',
        },
      ];
    }
  
    getSectionDOM(html, selector = '.shopify-section') {
      return new DOMParser().parseFromString(html, 'text/html').querySelector(selector);
    }
  
    setActiveElement(element) {
      this.activeElement = element;
    }
  }
  
  customElements.define('cart-drawer', CartDrawer);
  
  class CartDrawerItems extends CartItems {
    getSectionsToRender() {
      return [
        {
          id: 'CartDrawer',
          section: 'cart-drawer',
          selector: '.drawer__inner',
        },
        {
          id: 'cart-icon-bubble',
          section: 'cart-icon-bubble',
          selector: '.shopify-section',
        },
      ];
    }
  }
  
  customElements.define('cart-drawer-items', CartDrawerItems);
  
  