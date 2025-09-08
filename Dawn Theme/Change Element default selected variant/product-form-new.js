if (!customElements.get('product-form')) {
  customElements.define(
    'product-form',
    class ProductForm extends HTMLElement {
      constructor() {
        super();

        this.form = this.querySelector('form');
        this.variantIdInput.disabled = false;
        this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
        this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
        this.submitButton = this.querySelector('[type="submit"]');
        this.submitButtonText = this.submitButton?.querySelector('span');

        if (document.querySelector('cart-drawer')) {
          this.submitButton.setAttribute('aria-haspopup', 'dialog');
        }

        this.hideErrors = this.dataset.hideErrors === 'true';

        this.setupAddonQtyButtons(); // Added to support +/- buttons
      }

      setupAddonQtyButtons() {
        document.querySelectorAll('.qty-btn').forEach((btn) => {
          btn.addEventListener('click', () => {
            const input = btn.parentNode.querySelector('.qty-input');
            let val = parseInt(input.value, 10) || 0;
            const min = parseInt(input.min, 10) || 0;
            const max = parseInt(input.max, 10) || Infinity;

            if (btn.classList.contains('plus') && val < max) input.value = val + 1;
            if (btn.classList.contains('minus') && val > min) input.value = val - 1;
          });
        });
      }

      async onSubmitHandler(evt) {
        evt.preventDefault();
        if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

        this.handleErrorMessage();

        this.submitButton.setAttribute('aria-disabled', true);
        this.submitButton.classList.add('loading');
        this.querySelector('.loading__spinner')?.classList.remove('hidden');

        const items = [];

        // Get main product variant ID and quantity
        const mainVariantId = this.variantIdInput?.value;
        const mainQtyInput = this.form.querySelector('input[name="quantity"]');
        const mainQty = mainQtyInput ? parseInt(mainQtyInput.value, 10) : 1;

        if (mainVariantId && mainQty > 0) {
          items.push({
            id: parseInt(mainVariantId, 10),
            quantity: mainQty
          });
        }

        // Get addon products with qty > 0
        document.querySelectorAll('.addon-product .qty-input').forEach((input) => {
          const qty = parseInt(input.value, 10);
          const variantId = input.getAttribute('data-variant');
          if (qty > 0 && variantId) {
            items.push({
              id: parseInt(variantId, 10),
              quantity: qty
            });
          }
        });

        if (items.length === 0) {
          this.handleErrorMessage("Please select a product or add-on to add to cart.");
          this.resetButtonState();
          return;
        }

        try {
          const response = await fetch('/cart/add.js', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({ items })
          });

          const data = await response.json();

          if (data.status && data.message) {
            publish(PUB_SUB_EVENTS.cartError, {
              source: 'product-form',
              productVariantId: mainVariantId,
              errors: data.errors || data.description,
              message: data.message,
            });
            this.handleErrorMessage(data.message);
            this.toggleSoldOutMessage();
            this.error = true;
            return;
          }

          // Success
          this.error = false;

          if (!this.cart) {
            window.location = window.routes.cart_url || '/cart';
            return;
          }

          const startMarker = CartPerformance.createStartingMarker('add:wait-for-subscribers');

          publish(PUB_SUB_EVENTS.cartUpdate, {
            source: 'product-form',
            productVariantId: mainVariantId,
            cartData: data,
          }).then(() => {
            CartPerformance.measureFromMarker('add:wait-for-subscribers', startMarker);
          });

          const quickAddModal = this.closest('quick-add-modal');
          if (quickAddModal) {
            document.body.addEventListener(
              'modalClosed',
              () => {
                setTimeout(() => {
                  CartPerformance.measure("add:paint-updated-sections", () => {
                    this.cart.renderContents(data);
                  });
                });
              },
              { once: true }
            );
            quickAddModal.hide(true);
          } else {
            CartPerformance.measure("add:paint-updated-sections", () => {
              this.cart.renderContents(data);
            });
          }

        } catch (error) {
          console.error("Add to cart error:", error);
          this.handleErrorMessage("Something went wrong. Please try again.");
        } finally {
          this.resetButtonState();
          CartPerformance.measureFromEvent("add:user-action", evt);
        }
      }

      toggleSoldOutMessage() {
        const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
        if (!soldOutMessage) return;
        this.submitButton.setAttribute('aria-disabled', true);
        this.submitButtonText?.classList.add('hidden');
        soldOutMessage.classList.remove('hidden');
      }

      handleErrorMessage(errorMessage = false) {
        if (this.hideErrors) return;

        this.errorMessageWrapper =
          this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
        if (!this.errorMessageWrapper) return;

        this.errorMessage = this.errorMessageWrapper.querySelector('.product-form__error-message');
        this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

        if (errorMessage) {
          this.errorMessage.textContent = errorMessage;
        }
      }

      resetButtonState() {
        this.submitButton.classList.remove('loading');
        this.submitButton.removeAttribute('aria-disabled');
        this.querySelector('.loading__spinner')?.classList.add('hidden');

        if (this.cart && this.cart.classList.contains('is-empty')) {
          this.cart.classList.remove('is-empty');
        }
      }

      toggleSubmitButton(disable = true, text) {
        if (disable) {
          this.submitButton.setAttribute('disabled', 'disabled');
          if (text) this.submitButtonText.textContent = text;
        } else {
          this.submitButton.removeAttribute('disabled');
          this.submitButtonText.textContent = window.variantStrings.addToCart;
        }
      }

      get variantIdInput() {
        return this.form.querySelector('[name=id]');
      }
    }
  );
}
