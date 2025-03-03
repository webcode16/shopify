document.addEventListener('DOMContentLoaded', function () {
    const singleRadiobtns = document.querySelector('.single_subscription_app input[name="subscription_app"]');
    singleRadiobtns.click(); 
    sessionStorage.setItem('clickedRadio', 'true'); 
  });
  const hiddenInput = document.querySelector('.selected-selling-plan-id');
  const originalValue = hiddenInput ? hiddenInput.value : ''; 
  document.querySelectorAll('input[name="subscription_app"]').forEach((input) => {
    input.addEventListener('change', function() {
      const parentDiv = this.closest('div');
      document.querySelectorAll('.main_subscription_app > div').forEach((parent) => {
        parent.classList.remove('checked');
      });
      parentDiv.classList.add('checked');
      if (this.closest('.single_subscription_app') && this.checked) {
        const squantityValue = document.querySelector('.quantity__input');
        const sthisValue = this.value;
        if (squantityValue) {
          squantityValue.value = sthisValue;
          squantityValue.dispatchEvent(new Event('input'));  
        } else {
          console.error("quantity__input element not found.");
        }
        if (hiddenInput) {
          hiddenInput.value = ''; 
        }
      }
      else if (this.closest('.bundle_subscription_app') && this.checked) {
        if (this.checked){
          const defaultCheckedbtn = document.querySelector('.default_bulk_bundle');
          const defaultBundleSave = document.querySelectorAll('.under_bundle_save [name="subscription_bulk_quantity"]');
          let hasActive = false;
          defaultBundleSave.forEach(function(defaultbundle) {
          if (defaultbundle.parentElement.classList.contains('active')){
              hasActive = true;
          }
          });
          if(!hasActive){
              defaultCheckedbtn.click();
           }  
        }
        if (hiddenInput) {
          hiddenInput.value = originalValue; 
        }
      }
    });
  });
  document.querySelectorAll('.single_subscription_app input[name="subscription_app"]').forEach(input => {
      input.addEventListener('click', function() {
          const radioButtons = document.querySelectorAll('input[name="subscription_bulk_quantity"]');
          radioButtons.forEach(radio => {
              radio.checked = false;
              radio.parentElement.classList.remove('active');
          });
      });
  });
  document.querySelectorAll('.under_bundle_save [name="subscription_bulk_quantity"]').forEach((input) => {
    input.addEventListener('change', function() {
      const singleRadiobtns = document.querySelectorAll('.single_subscription_app input[name="subscription_app"]');
      const bundleRadiobtns = document.querySelectorAll('.bundle_subscription_app input[name="subscription_app"]');
      const thisValue = input.value;
      const quantityValue = document.querySelector('.quantity__input');
      const thisparentClass = document.querySelectorAll('.main_subscription_app .under_bundle_save .under_bundle_save_content p');
      thisparentClass.forEach(function(element) {
        element.classList.remove('active');
      });
      input.parentElement.classList.add('active');
      if (quantityValue) {
        quantityValue.value = thisValue;
        quantityValue.dispatchEvent(new Event('input'));  
      } else {
        console.error("quantity__input element not found.");
      }
      singleRadiobtns.forEach(radio => {
        radio.classList.remove('checked');
        radio.checked = false;
        radio.parentElement.classList.remove('checked');
      });
      bundleRadiobtns.forEach(radio => {
        radio.checked = false;
        radio.parentElement.classList.add('checked');
        radio.click();
      });
    });
  });