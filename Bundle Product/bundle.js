document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.main_bundle_product_tab .title ul li');
    const contentItems = document.querySelectorAll('.main_bundle_product_tab .content .main_product_grid .under-product-grid');
    var bPacks = document.querySelectorAll('ul.under-inner-all-bundles.packs>li');
    var bPlus = document.querySelectorAll('ul.under-inner-all-bundles.plus>li>div');
    const benefitsButton = document.querySelector('.btn-benefits');
    tabs.forEach(tab => {
    tab.addEventListener('click', function () {
        tabs.forEach(t => t.classList.remove('active'));
        contentItems.forEach(content => content.classList.remove('active'));
        tab.classList.add('active');
        const tabName = tab.getAttribute('data-title-name');
        const matchingContent = document.querySelectorAll(`.under-product-grid[data-content-name="${tabName}"]`);
        matchingContent.forEach(content => content.classList.add('active'));
      });
    });
    const firstTab = tabs[0];
    if (firstTab) {
      firstTab.click();
    }
  
const productGridAddButton = document.querySelector('.product-grid-add');
bPacks.forEach(bpack => {
  bpack.addEventListener('click', function() {
  const totalEightCount = document.querySelectorAll('.pack-plus-img.active').length;
    bPacks.forEach(item => item.classList.remove('active'));
    bpack.classList.add('active');
    const selectedPack = bpack.textContent.trim();
    let dataCount = 4; // Default to 4 if something goes wrong
    if (selectedPack === "6 PACK") {
      dataCount = 6;
    } else if (selectedPack === "8 PACK") {
      dataCount = 8;
    }
    if(dataCount < totalEightCount){
        this.classList.add('derive-btn-disbaled');
        alert('Remove some items from your bundle before reducing its size');
        document.querySelector('button#subscribe-now-btns').disabled = true;
    }
    if(dataCount > totalEightCount){
      document.querySelector('button#subscribe-now-btns').disabled = true;
      document.querySelectorAll('.product-grid-add').forEach(button => {
           button.disabled = false;
      });
      document.querySelectorAll('.plus').forEach(button => {
           button.disabled = false;
      });
    }
    if(dataCount == totalEightCount){
      document.querySelector('button#subscribe-now-btns').disabled = false;
      document.querySelectorAll('.product-grid-add').forEach(button => {
           button.disabled = true;
      });
      document.querySelectorAll('.plus').forEach(button => {
           button.disabled = true;
      });
    }
    productGridAddButton.setAttribute('data-count', dataCount);
    console.log('Selected pack:', selectedPack);
    console.log('Updated data-count:', dataCount);
    console.log('eight', totalEightCount)
  });
});
productGridAddButton.addEventListener('click', function() {
  const dataCount = parseInt(productGridAddButton.getAttribute('data-count'), 10);
  console.log('Pack count on Add button:', dataCount);
});


  
  
   bPacks.forEach(function (pack, index) {
    pack.addEventListener('click', function() {
      
   
    // Remove 'active' class from all bPacks first
    bPacks.forEach(function(pack) {
      pack.classList.remove('active');
    });
      const fourPlus = document.querySelector('.four-plus');
      const sixPlus = document.querySelector('.six-plus');
      const eightPlus = document.querySelector('.eight-plus');
  
    // Add 'active' class to clicked pack
    if (pack.classList.contains('four-packs')) {
      pack.classList.add('active');
      // Remove 'active' from all bPlus first
      bPlus.forEach(function(plus) {
        plus.classList.remove('active');
      });
      fourPlus.classList.add('active');
      sixPlus.classList.remove('active');
      eightPlus.classList.remove('active');
      
    } else if (pack.classList.contains('six-packs')) {
      pack.classList.add('active');
      fourPlus.classList.add('active');
      sixPlus.classList.add('active');
      eightPlus.classList.remove('active');
      
    } else if (pack.classList.contains('eight-packs')) {
      pack.classList.add('active');
      fourPlus.classList.add('active');
      sixPlus.classList.add('active');
      eightPlus.classList.add('active');
    }
  });
});

    // count
    const totalCountBundle = document.querySelectorAll('ul.under-inner-all-bundles.packs li');
    // const countOutOf = document.querySelector('.subscribe-count');
    const countOutOfTotal = document.querySelector('.build-count-out-of-total');
    const countProductAddButtons = document.querySelectorAll('.product-grid-add');
    totalCountBundle.forEach(bundle => {
        bundle.addEventListener('click', function() {
            const packCount = parseInt(bundle.textContent.split(' ')[0]);
            countProductAddButtons.forEach(button => {
            button.setAttribute('data-count', packCount);
        });
            // countOutOf.textContent = packCount;
            countOutOfTotal.textContent = `/${packCount}`;
        });
    });
    // ******** one-time and subscription checked **********
      const radioButtons = document.querySelectorAll('input[type="radio"][name="subscription_app"]');
      const subscribeAndSaveTexts = document.querySelectorAll('.main-subscribe-and-save .subscribe-and-save');
      const oneTimeTexts = document.querySelectorAll('.main-subscribe-and-save .one-time');
      radioButtons.forEach(radio => {
          radio.addEventListener('change', function() {
              radioButtons.forEach(r => {
                  r.closest('li').classList.remove('active');
              });
              if (radio.checked) {
                  radio.closest('li').classList.add('active');
              }
              const labelId = radio.id;
              if (labelId === 'subscribe-and-save') {
                  subscribeAndSaveTexts.forEach(text => {
                      text.classList.add('active');
                  });
              } else {
                  subscribeAndSaveTexts.forEach(text => {
                      text.classList.remove('active');
                  });
              }
              if (labelId === 'one-time') {
                  oneTimeTexts.forEach(text => {
                      text.classList.add('active');
                  });
              } else {
                  oneTimeTexts.forEach(text => {
                      text.classList.remove('active');
                  });
              }
          });
      });
      radioButtons[0].click();

      benefitsButton.addEventListener('click', function() {
            benefitsButton.classList.toggle('active');
        });


// ********** modal ***********
var modal = document.getElementById("productModal");
var modalImage = document.getElementById("modalImage");
var modalTitle = document.getElementById("modalTitle");
var modalDescription = document.getElementById("modalDescription");
var productDataElements = document.querySelectorAll('.display-product-data');
productDataElements.forEach(function(element) {
  element.addEventListener('click', function() {
    var imageSrc = element.closest('.under-product-grid').getAttribute('data-image');
    var title = element.closest('.under-product-grid').getAttribute('data-title');
    var description = element.closest('.under-product-grid').getAttribute('data-description');
    modalImage.src = imageSrc;
    modalTitle.textContent = title;
    modalDescription.textContent = description; // You can add more dynamic description here if needed
    modal.style.display = "block";
  });
});
var spanModel = document.getElementsByClassName("close")[0];
spanModel.onclick = function() {
  modal.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
// ********* subscribe now button *************
document.getElementById('subscribe-now-btns').addEventListener('click', function() {
    const activeVariants = document.querySelectorAll('.product-variant-id.active');
    const bundleProductName = "Bundle Product"; // Replace with dynamic name if necessary
    const items = Array.from(activeVariants).map(variantElement => {
        const variantId = variantElement.value; // Get the variant ID
        const quantity = parseInt(variantElement.getAttribute('quantity') || '1'); // Get the quantity, default to 1
        const sellingPlanId = variantElement.getAttribute('sellingplanid'); // Get the selling plan ID
        const item = {
            id: variantId,
            quantity: quantity,
            properties: {
                bundle_name: bundleProductName // Product name for the bundle
            }
        };
        if (sellingPlanId) {
            item.selling_plan = parseInt(sellingPlanId);
        }
        return item;
    });
    fetch('/cart/add.js', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: items })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // window.location.href = '/cart'; // Optional: redirect to cart page
      document.querySelectorAll('.add-to-cart').forEach(function(element) {
              element.classList.remove('adding');
          });
          document.querySelectorAll('cart-drawer').forEach(function(element) {
              element.classList.remove('is-empty');
        });
      fetch(location.href)
          .then(response => response.text())
          .then(data => {
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = data;
              const updatedCartDrawer = tempDiv.querySelector('#CartDrawer');
              if (updatedCartDrawer) {
                  document.querySelector('.cart-drawer').innerHTML = updatedCartDrawer.innerHTML;
              }
          });
      document.querySelector('a#cart-icon-bubble').click();
      document.querySelector('.header__icon--cart').click();
      fetch(location.href)
          .then(response => response.text())
          .then(data => {
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = data;
              const updatedCartIcon = tempDiv.querySelector('.header__icon--cart');
              if (updatedCartIcon) {
                  document.querySelector('.header__icon--cart').innerHTML = updatedCartIcon.innerHTML;
              }
          });
// end

      
    })
    .catch(error => {
        // Handle any errors during the process
        console.error('Error adding products to cart:', error);
        alert('There was an error adding the products to your cart. Please try again.');
    });
});

  
});


// *************** product grid *******************
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.product-grid-add').forEach(button => {
        button.addEventListener('click', function () {
            this.style.display = 'none';
            const dataId = this.getAttribute('data-id');
            const dataCount = parseInt(this.getAttribute('data-count'), 10);
            const dataPrice = parseFloat(this.getAttribute('data-price').replace('$', ''));
            const quantityInput = this.closest('.under-product-grid').querySelector('.quantity-input');
            const quantityShowHide = this.closest('.under-product-grid').querySelector('.quantity-container');  
            quantityShowHide.style.display = 'flex';
            let quantity = parseInt(quantityInput.value) || 0;

            if (quantity === 0) {
                quantity = 1;
                quantityInput.value = quantity;
            }

            updateProductSelection(dataId, dataCount, dataPrice, quantity);
            updateHiddenInputQuantity(dataId, quantity);

            // After update, check if buttons need to be enabled or disabled
            toggleButtonsState();
        });
    });

    document.querySelectorAll('.quantity-container .plus').forEach(button => {
        button.addEventListener('click', function () {
            const productGrid = this.closest('.under-product-grid');
            const dataId = productGrid.querySelector('.product-grid-add').getAttribute('data-id');
            const dataCount = parseInt(productGrid.querySelector('.product-grid-add').getAttribute('data-count'), 10);
            const dataPrice = parseFloat(productGrid.querySelector('.product-grid-add').getAttribute('data-price').replace('$', ''));
            const quantityInput = productGrid.querySelector('.quantity-input');

            let quantity = parseInt(quantityInput.value) || 0;
            quantity++; // Increase quantity
            quantityInput.value = quantity;

            updateProductSelection(dataId, dataCount, dataPrice, quantity);
            updateHiddenInputQuantity(dataId, quantity);

            // After update, check if buttons need to be enabled or disabled
            toggleButtonsState();
        });
    });

    document.querySelectorAll('.quantity-container .minus').forEach(button => {
        button.addEventListener('click', function () {
            const productGrid = this.closest('.under-product-grid');
            const productGridAddBtn = productGrid.querySelector('.product-grid-add');
            const dataId = productGrid.querySelector('.product-grid-add').getAttribute('data-id');
            const dataCount = parseInt(productGrid.querySelector('.product-grid-add').getAttribute('data-count'), 10);
            const dataPrice = parseFloat(productGrid.querySelector('.product-grid-add').getAttribute('data-price').replace('$', ''));
            const quantityInput = productGrid.querySelector('.quantity-input');
            const quantityShowHide = this.parentElement;
            let quantity = parseInt(quantityInput.value) || 0;
            const totalEightCount = document.querySelectorAll('.pack-plus-img.active').length;
          
            if (quantity > 0) {
                quantity--; // Decrease quantity
                quantityInput.value = quantity;
                updateProductSelection(dataId, dataCount, dataPrice, quantity, true);
                updateHiddenInputQuantity(dataId, quantity);
            }
            if (quantity == 0) {
                quantityShowHide.style.display = "none";
                productGridAddBtn.style.display = "block";
            }

            // After update, check if buttons need to be enabled or disabled
            toggleButtonsState();
        });
    });

    function updateProductSelection(dataId, dataCount, dataPrice, quantity, isRemoving = false) {
        if (!isNaN(dataCount)) {
            if (!isRemoving) {
                const availablePackPlusImg = findAvailableIndex(dataCount);
                if (availablePackPlusImg) {
                    const productImages = availablePackPlusImg.querySelectorAll('.product_image');
                    productImages.forEach(image => {
                        if (image.getAttribute('data-id') === dataId) {
                            image.classList.add('active');
                            image.parentElement.classList.add('active');
                            const svg = availablePackPlusImg.querySelector('svg');
                            if (svg) svg.classList.add('hidden');
                        }
                    });

                    // Add active class to subscribeNowBtns
                    const subscribeNowBtns = document.querySelectorAll('.product-variant-id');
                    subscribeNowBtns.forEach(button => {
                        if (button.value === dataId) {
                            button.classList.add('active');
                        }
                    });
                }
                updateTotalPrice(dataPrice);
            } else {
                const lastActiveImage = findLastActiveImage(dataId);
                if (lastActiveImage) {
                    lastActiveImage.classList.remove('active');
                    lastActiveImage.parentElement.classList.remove('active');
                    const parentPackPlusImg = lastActiveImage.closest('.pack-plus-img');
                    const svg = parentPackPlusImg.querySelector('svg');
                    if (svg) svg.classList.remove('hidden');
                }
                updateTotalPrice(-dataPrice);
            }
            updateActiveCount(dataCount);
        }
    }

    function updateHiddenInputQuantity(dataId, quantity) {
        const hiddenInputs = document.querySelectorAll('.product-variant-id');
        hiddenInputs.forEach(input => {
            if (input.value === dataId) {
                input.setAttribute('quantity', quantity); // Update the quantity attribute
                if (quantity > 0) {
                    input.classList.add('active'); // Add active class if quantity is > 0
                } else {
                    input.classList.remove('active'); // Remove active class if quantity is 0
                }
            }
        });

        // const subscribeCountElement = document.querySelector('.subscribe-count');
        // if (subscribeCountElement) {
        //     const activeProducts = document.querySelectorAll('.product-variant-id.active');
        //     subscribeCountElement.textContent = activeProducts.length;
        // }
    }

    function toggleButtonsState() {
        // Loop through all product-grid-add buttons
        document.querySelectorAll('.product-grid-add').forEach(button => {
            const dataId = button.getAttribute('data-id');
            const dataCount = parseInt(button.getAttribute('data-count'), 10);
            const activeImages = document.querySelectorAll(`.product_image[data-id="${dataId}"].active`).length;
            // console.log(activeImages);
            // Disable the button if active images are equal to data-count
            if (activeImages >= dataCount) {
                button.disabled = true;
                // button.style.display = 'none'; // Hide button
            } else {
                button.disabled = false;
                // button.style.display = 'block'; // Show button
            }       
        });

        // Similarly, handle the 'plus' buttons
        document.querySelectorAll('.quantity-container .plus').forEach(button => {
            const productGrid = button.closest('.under-product-grid');
            const dataId = productGrid.querySelector('.product-grid-add').getAttribute('data-id');
            const dataCount = parseInt(productGrid.querySelector('.product-grid-add').getAttribute('data-count'), 10);
            const activeImages = document.querySelectorAll(`.product_image[data-id="${dataId}"].active`).length;
            const totalEightCount = document.querySelectorAll('.pack-plus-img.active').length;
            console.log(totalEightCount);
            // Disable the plus button if active images are equal to data-count
            if (activeImages >= dataCount) {
                button.disabled = true;
            } else {
                button.disabled = false;
                document.querySelector('button#subscribe-now-btns').disabled = true;
            }
            if(totalEightCount === dataCount){
                document.querySelector('button#subscribe-now-btns').disabled = false;
                document.querySelectorAll('.product-grid-add').forEach(button => {
                   button.disabled = true;
                 });
                 document.querySelectorAll('.plus').forEach(button => {
                   button.disabled = true;
                  });
            }else{
               document.querySelectorAll('.product-grid-add').forEach(button => {
                   button.disabled = false;
                });
                document.querySelectorAll('.plus').forEach(button => {
                   button.disabled = false;
                });
            }
        });
    }

    function findAvailableIndex(count) {
        for (let index = 1; index <= count; index++) {
            const packPlusImg = document.querySelector(`.pack-plus-img[data-index="${index}"]`);
            const activeImage = packPlusImg.querySelector('.product_image.active');
            if (!activeImage) return packPlusImg;
        }
        return null;
    }

    function findLastActiveImage(dataId) {
        const activeImages = document.querySelectorAll(`.product_image[data-id="${dataId}"].active`);
        return activeImages.length > 0 ? activeImages[activeImages.length - 1] : null;
    }

    function updateActiveCount(count) {
        let activeCount = 0;
        for (let index = 1; index <= count; index++) {
            const packPlusImg = document.querySelector(`.pack-plus-img[data-index="${index}"]`);
            activeCount += packPlusImg.querySelectorAll('.product_image.active').length;
        }
        const countElement = document.querySelector('.build-count-out-of');
        if (countElement) countElement.textContent = activeCount;
    }

    function updateTotalPrice(priceChange) {
        let totalPrice = parseFloat(document.querySelector('.bundle_total_price').textContent.replace('$', '')) || 0;
        totalPrice += priceChange;
        totalPrice = Math.max(0, totalPrice);
        const priceElement = document.querySelector('.bundle_total_price');
        if (priceElement) priceElement.textContent = `$${totalPrice.toFixed(2)}`;
    }
    
});


// ********** Enter subscription **********
document.addEventListener("DOMContentLoaded", function() {
  const weeksList = document.querySelectorAll('.under-inner-all-bundles.weeks-count li');
  const sellingPlans = document.querySelectorAll('.selling-plan-all span');
  const hiddenInputs = document.querySelectorAll('#subscribe-now-btns input[type="hidden"]');
  const subscriptionOptions = document.querySelectorAll('.under-inner-all-bundles.sub-non-sub input#one-time');
  const subscriptionOptionsClick = document.getElementById('one-time');
  const subscribeAndSaveButton = document.getElementById('subscribe-and-save');
  const firstLii = document.querySelector('.under-inner-all-bundles.weeks-count li');
  subscribeAndSaveButton.addEventListener('click', function() {
    firstLii.click();
    document.querySelector('#subscribe-now-btns span').textContent = 'Subscribe Now';
  });
   setTimeout(function() {
    subscriptionOptionsClick.click();
    }, 1000);
  subscriptionOptions.forEach(option => {
    option.addEventListener('click', function () {
      document.querySelector('#subscribe-now-btns span').textContent = 'Add to Cart';
      hiddenInputs.forEach(input => {
        input.removeAttribute('sellingplanid'); // Corrected: remove 'sellingplanid' attribute
      });
    });
  });
  weeksList.forEach((button, index) => {
    button.addEventListener('click', function () {
      weeksList.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      const selectedSellingPlan = sellingPlans[index];
      const sellingPlanId = selectedSellingPlan.getAttribute('data-selling-plan-ids');
      hiddenInputs.forEach(input => {
        input.setAttribute('sellingplanid', sellingPlanId);
      });
      console.log('Selected Selling Plan ID:', sellingPlanId);
    });
  });
});


