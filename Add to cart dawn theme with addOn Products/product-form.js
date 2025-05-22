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
          this.submitButtonText = this.submitButton.querySelector('span');
  
          if (document.querySelector('cart-drawer')) {
            this.submitButton.setAttribute('aria-haspopup', 'dialog');
          }
  
          this.hideErrors = this.dataset.hideErrors === 'true';
  
          // ✅ Initialize extra fields click handler
          this.initExtraFields();
        }
  
  
  
    
        initExtraFields() {
          const extraFields = this.querySelectorAll('.extra-fields');
          extraFields.forEach((field) => {
            field.addEventListener('click', () => {
              field.classList.toggle('selected');
  
              // Toggle checkmark visibility
              field.querySelectorAll('.right-tick').forEach((tick) => {
                tick.classList.toggle('not-is-default');
                tick.classList.toggle('is-it-default');
              });
            });
          });
        }
  
        async onSubmitHandler(evt) {
          evt.preventDefault();
          if (this.submitButton.getAttribute('aria-disabled') === 'true') return;
  
          this.handleErrorMessage();
  
          this.submitButton.setAttribute('aria-disabled', true);
          this.submitButton.classList.add('loading');
          this.querySelector('.loading__spinner').classList.remove('hidden');
  
          const config = fetchConfig('javascript');
          config.headers['X-Requested-With'] = 'XMLHttpRequest';
          delete config.headers['Content-Type'];
  
          const formData = new FormData(this.form);
          if (this.cart) {
            formData.append(
              'sections',
              this.cart.getSectionsToRender().map((section) => section.id)
            );
            formData.append('sections_url', window.location.pathname);
            this.cart.setActiveElement(document.activeElement);
          }
          config.body = formData;
  
          try {
            const response = await fetch(`${routes.cart_add_url}`, config).then((res) => res.json());
  
            if (response.status) {
              publish(PUB_SUB_EVENTS.cartError, {
                source: 'product-form',
                productVariantId: formData.get('id'),
                errors: response.errors || response.description,
                message: response.message,
              });
              this.handleErrorMessage(response.description);
  
              const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
              if (!soldOutMessage) return;
              this.submitButton.setAttribute('aria-disabled', true);
              this.submitButtonText.classList.add('hidden');
              soldOutMessage.classList.remove('hidden');
              this.error = true;
              return;
            }
  
            // ✅ Add selected extras dynamically
            const selectedExtras = document.body.querySelectorAll('.extra-fields.active');
            for (const extra of selectedExtras) {
              const variantId = extra.dataset.toVariantIds;
              if (!variantId) continue;
              
              const addonData = new FormData();
              addonData.append('id', variantId);
              addonData.append('quantity', 1);
  
              await fetch(`${routes.cart_add_url}`, {
                method: 'POST',
                headers: {
                  'X-Requested-With': 'XMLHttpRequest',
                },
                body: addonData,
              });
            }
  
            if (!this.cart) {
              window.location = window.routes.cart_url;
              return;
            }
  
            const startMarker = CartPerformance.createStartingMarker('add:wait-for-subscribers');
            if (!this.error)
              publish(PUB_SUB_EVENTS.cartUpdate, {
                source: 'product-form',
                productVariantId: formData.get('id'),
                cartData: response,
              }).then(() => {
                CartPerformance.measureFromMarker('add:wait-for-subscribers', startMarker);
              });
  
            this.error = false;
            const quickAddModal = this.closest('quick-add-modal');
            if (quickAddModal) {
              document.body.addEventListener(
                'modalClosed',
                () => {
                  setTimeout(() => {
                    CartPerformance.measure("add:paint-updated-sections", () => {
                      this.cart.renderContents(response);
                    });
                  }, 0);
                },
                { once: true }
              );
              quickAddModal.hide(true);
            } else {
              CartPerformance.measure("add:paint-updated-sections", () => {
                this.cart.renderContents(response);
              });
            }
          } catch (e) {
            console.error(e);
          } finally {
            this.submitButton.classList.remove('loading');
            if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
            if (!this.error) this.submitButton.removeAttribute('aria-disabled');
            this.querySelector('.loading__spinner').classList.add('hidden');
  
            CartPerformance.measureFromEvent("add:user-action", evt);
          }
        }
  
        handleErrorMessage(errorMessage = false) {
          if (this.hideErrors) return;
  
          this.errorMessageWrapper =
            this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
          if (!this.errorMessageWrapper) return;
          this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');
  
          this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);
  
          if (errorMessage) {
            this.errorMessage.textContent = errorMessage;
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
  
  
  