(function() {

  const STICKERBOX_VARIANT_ID = 45134919401651;
  const PAPER_REFILL_VARIANT_ID = 45065990504627;
  const DISCOUNT_TITLE_TO_REMOVE = "FREE3PACK";

  function showItemLoader(element) {
    const item = element.closest('.cart-item[data-line-discount="stickerbox"]');
    if (!item) return;
    const loader = item.querySelector('.loading-overlay');
    if (loader) loader.classList.remove('hidden');
  }

  function hideItemLoader(element) {
    const item = element.closest('.cart-item[data-line-discount="stickerbox"]');
    if (!item) return;
    const loader = item.querySelector('.loading-overlay');
    if (loader) loader.classList.add('hidden');
  }

  async function addToCartAndRefresh(form, openCartDrawer = false) {
    const variantId = form.querySelector('[name="id"]').value;
    if (variantId == STICKERBOX_VARIANT_ID) {
      const qtyInput = form.querySelector('[name="quantity"]');
      const stickerboxQty = qtyInput ? parseInt(qtyInput.value) : 1;

      try {
        await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: STICKERBOX_VARIANT_ID, quantity: stickerboxQty })
        });

        await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: PAPER_REFILL_VARIANT_ID, quantity: stickerboxQty })
        });

        await updateCartDrawer();
         if (openCartDrawer) {
          document.querySelector('.wt-cart__trigger')?.click();
        }
      } catch (error) {
        console.error('Error adding products:', error);
      }
    }
  }

  async function updateCartDrawer() {
    try {
      const cart = await fetch('/cart.js').then(r => r.json());

      const bubble = document.querySelector('#cart-icon-bubble span');
      if (bubble) bubble.textContent = cart.item_count;

      document.querySelector('.main-hidden-cart-counter')?.classList.add('hidden-cart-counter');
      

      const html = await fetch('/?section_id=cart-drawer').then(r => r.text());
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const newDrawer = doc.querySelector('#CartDrawer');
      const currentDrawer = document.querySelector('#CartDrawer');
      if (newDrawer && currentDrawer) currentDrawer.innerHTML = newDrawer.innerHTML;

      document.querySelector('cart-drawer')?.classList.add('is-open');
      document.dispatchEvent(new CustomEvent("cart:updated"));

    } catch (error) {
      console.error('Error updating cart drawer:', error);
    }
  }

  async function removeItemsWithDiscountTitle(discountTitle) {
    try {
      const cart = await fetch('/cart.js').then(r => r.json());

      const itemsToRemove = cart.items.filter(item => {
        const hasDiscount = item.discounts?.some(d => d.title === discountTitle)
          || item.line_level_discount_allocations?.some(d => d.discount_application?.title === discountTitle);
        return hasDiscount;
      });

      if (itemsToRemove.length === 0) return;

      const updates = {};
      itemsToRemove.forEach(item => updates[item.key] = 0);

      await fetch('/cart/update.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });

      await updateCartDrawer();

    } catch (err) {
      console.error('Error removing discounted items:', err);
    }
  }

  document.addEventListener("submit", function(e) {
    const form = e.target;
    if (form.classList.contains("main-sticker-form")) {
      e.preventDefault();
      e.stopImmediatePropagation();
      e.stopPropagation();
      addToCartAndRefresh(form, true);
    }
  }, true);

  document.addEventListener('click', function(e) {
    const trigger = e.target.closest(".plus-cart-btn");
    if (!trigger) return;
    showItemLoader(trigger);
    const wrapper = trigger.closest("quantity-counter");
    if (!wrapper) return console.error("No quantity-counter wrapper found");
    const input = wrapper.querySelector(".js-counter-quantity");
    if (!input) return console.error("No quantity input found");
    const variantId = input.dataset.quantityVariantId;
    const quantity = 1;

    addToCartAndRefresh({
      querySelector: (selector) => {
        if (selector === '[name="id"]') return { value: variantId };
        if (selector === '[name="quantity"]') return { value: quantity };
        return null;
      }
    });
  });


  document.addEventListener('click', async function(e) {
    if (!e.target.classList.contains('remove-sticker-products')) return;

    showItemLoader(e.target);
    try {
      await removeItemsWithDiscountTitle(DISCOUNT_TITLE_TO_REMOVE);
    } finally {
      hideItemLoader(e.target);
    }
  });


 document.addEventListener("click", async function (e) {
  const minus = e.target.closest(".minus-cart-btn");
  showItemLoader(e.target);
  if (!minus) return;

  const cart = await fetch("/cart.js").then(r => r.json());

  const freeItems = cart.items.filter(i =>
    i.discounts?.some(d => d.title === "FREE3PACK")
  );

  if (freeItems.length === 0) {
    console.warn("No FREE3PACK items found");
    return;
  }

  

  const updates = {};

  freeItems.forEach(item => {
    const newQty = Math.max(item.quantity - 1, 0);
    updates[item.key] = newQty;
  });

  

  await fetch("/cart/update.js", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ updates })
  });
  
  await updateCartDrawer();
});


})();





