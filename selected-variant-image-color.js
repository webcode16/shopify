document.addEventListener("DOMContentLoaded", function () {

  function showSelectedColor(color) {
    document.querySelectorAll('.product__media-list li').forEach(li => {
      li.style.display = 'none';
    });

    const datamediaColor = document.querySelector(
      `.product__media-list li[data-media-xr="${color}"]`
    );

    if (datamediaColor) {
      datamediaColor.style.display = 'block';
    }
  }

  // Event listener for radio button changes
  document.body.addEventListener('change', function (e) {
    if (e.target && e.target.matches('input[name^="Color-2"]')) {
      const selectedColor = e.target.value;
      showSelectedColor(selectedColor);
      console.log(selectedColor);
    }
  });

  // Handle initially checked radio button
  const checkedRadio = document.querySelector('input[name^="Color-2"]:checked');
  if (checkedRadio) {
    const selectedColor = checkedRadio.value;
    showSelectedColor(selectedColor);
    console.log('Initially checked:', selectedColor);
  }

});
