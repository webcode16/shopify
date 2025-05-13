// start 

const fieldsetsABC = ['step_form_one', 'step_form_two', 'step_form_third', 'step_form_fir', 'step_form_five', 'step_form_six'];
const fieldsetsXYZ = ['xyz_step1', 'xyz_step2', 'xyz_step3', 'xyz_step4', 'xyz_step5', 'xyz_step6', 'xyz_step7', 'xyz_step8'];

// Show the correct fieldset and hide others
function showFieldset(fieldsets, index) {
  fieldsets.forEach((id, i) => {
    const fieldset = document.getElementById(id);
    if (fieldset) {
      fieldset.classList.toggle('active', i === index);
    }
  });
}

// Reset fieldsets for a form
function resetFieldsets(fieldsets) {
  fieldsets.forEach(id => {
    const fieldset = document.getElementById(id);
    if (fieldset) {
      fieldset.classList.remove('active');
    }
  });
}

// Main form toggle function
function showForm(form, btn) {
  const abcForm = document.getElementById('form-abc');
  const xyzForm = document.getElementById('form-xyz');

  if (form === 'abc') {
    abcForm.style.display = 'block';
    xyzForm.style.display = 'none';
    resetFieldsets(fieldsetsXYZ); // reset xyz
    showFieldset(fieldsetsABC, 0); // start abc at step 1
  } else if (form === 'xyz') {
    abcForm.style.display = 'none';
    xyzForm.style.display = 'block';
    resetFieldsets(fieldsetsABC); // reset abc
    showFieldset(fieldsetsXYZ, 0); // start xyz at step 1
  }

  // Hide result blocks
  document.querySelectorAll('#result').forEach(el => el.style.display = 'none');
  document.querySelectorAll('#result-error').forEach(el => el.style.display = 'none');

  // Update button active states
  const buttons = document.querySelectorAll('.toggle-btn');
  buttons.forEach(button => button.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

// Initialize fieldset navigation
function initFormNavigation(fieldsets, formType) {
  fieldsets.forEach((id, index) => {
    const radios = document.querySelectorAll(`#${id} input[type="radio"]`);
    radios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (index + 1 < fieldsets.length) {
          showFieldset(fieldsets, index + 1);
        }
      });
    });
  });
}

// Init on load
document.addEventListener('DOMContentLoaded', () => {
  initFormNavigation(fieldsetsABC, 'abc');
  initFormNavigation(fieldsetsXYZ, 'xyz');
  // showForm('xyz'); // Default to XYZ
});



// end
function calculateResults() {

  const resultsText = {
        red: `<strong>Stored in the Jaw, Head & Throat</strong><br>
You may carry unspoken truths, suppressed anger, or fear around expressing your needs. Tension in the jaw, grinding, and headaches often signal a body that wants to speak<br>—but doesn't feel safe to.`,
        orange: `<strong>Stored in the Chest & Heart</strong><br>
Your body holds the weight of grief, anxiety, or heartbreak. A tight chest or fast heartbeat suggests your system is stuck in a protective mode<br>—guarding your heart.`,
        blue: `<strong>Stored in the Gut</strong><br>
Your gut is your second brain, and it’s picking up everything. You may carry a history of anxiety, insecurity, or emotional unpredictability. Digestive issues are often a sign your system feels unsafe.`,
        yellow: `<strong>Stored in the Shoulders & Upper Back</strong><br>
You carry the weight of the world. Whether it's responsibility, caretaking, or protecting others, your upper body may be bracing out of habit. It’s time to let some of it go.`,
        purple: `<strong>Stored in the Hips & Lower Back</strong><br>
This is where deep emotional memory lives—grief, heartbreak, past relationships, even unprocessed trauma. If this is you, your system may be protecting something tender that’s ready to be released.`,
        black: `<strong>Stored in the Nervous System (Freeze/Shutdown)</strong><br>
You may feel disconnected, numb, or chronically tired. This is a freeze response—your body has gone into protective shutdown. You don’t need to force your way out. You need gentleness, warmth, and time.`
      };

      
      // Object to count color selections
      const colors = {
        red: 0,
        orange: 0,
        blue: 0,
        yellow: 0,
        purple: 0,
        black: 0
      };

      // Get the selected radio button from each question
      const q1Selection = document.querySelector('input[name="q1"]:checked');
      const q2Selection = document.querySelector('input[name="q2"]:checked');
      const q3Selection = document.querySelector('input[name="q3"]:checked');
      const q4Selection = document.querySelector('input[name="q4"]:checked');
      const q5Selection = document.querySelector('input[name="q5"]:checked');

      // Check if any question is unanswered
      if (!q1Selection || !q2Selection || !q3Selection || !q4Selection || !q5Selection) {
          document.querySelector('#result-error .result-text').innerHTML = '<p class="eror">Please answer all questions.</p>';
          document.getElementById('result-error').style.display = "block";
        return;
      }

      // Tally the selected colors
      [q1Selection, q2Selection, q3Selection, q4Selection, q5Selection].forEach(selection => {
        colors[selection.value]++;
      });

      // Determine the color with the highest count
      let maxCount = 0;
      let selectedColor = '';
      for (const [color, count] of Object.entries(colors)) {
        if (count > maxCount) {
          maxCount = count;
          selectedColor = color;
        }
      }
     window.scrollTo({ top: 0, behavior: 'smooth' });
     document.getElementById('surveyForm').style.display = "none";
      document.getElementById('result').style.display = "block";
      document.querySelector('#result .result-text').innerHTML = resultsText[selectedColor] || 'No result available.';
      document.getElementById('result-error').style.display = "none";
      window._klOnsite = window._klOnsite || [];
      window._klOnsite.push(['openForm', 'UfhY47']);
}


document.getElementById('form-reset').addEventListener("click", (event) => {
    document.getElementById('surveyForm').style.display = "block";
    document.getElementById("surveyForm").reset();
    document.getElementById('result').style.display = "none";
});


function calculateXYZResults() {
  const form = document.getElementById('surveyForm-two');
  const answers = new FormData(form);
  const scores = { red: 0, yellow: 0, blue: 0, green: 0 };

  // Check if all questions are answered (assuming 5 questions)
  const totalQuestions = 5;
  if ([...answers.values()].length < totalQuestions) {
    document.querySelector('#form-xyz #result-error .result-text').innerHTML = '<p class="eror">Please answer all questions.</p>';
    document.querySelector('#form-xyz #result-error').style.display = "block";
    return;
  }

  // Count scores
  for (const [_, value] of answers.entries()) {
    if (scores[value] !== undefined) scores[value]++;
  }

  // Find the top color
  let topColor = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  let message = '';

  switch (topColor) {
    case 'red':
      message = `<strong>🔴 Fight or Flight</strong><br><br>You’re in high alert mode. Your body is geared up to respond, protect, and act—but it may be stuck in overdrive. 
      You’re constantly on, and it’s likely draining your energy, sleep, and peace.<br><br>Your next step? Learning how to discharge stored tension and reconnect to calm.`;
      break;
    case 'yellow':
      message = `<strong>🟡 Survival Mode</strong><br><br>You’re doing everything—keeping the peace, staying busy, and powering through. But underneath, your system is running on empty.
      You’re stuck in survival mode, always “on” but rarely grounded.<br><br>What you need is to <strong>slow down, reconnect, and remember you matter too.</strong>`;
      break;
    case 'blue':
      message = `<strong>🔵 Freeze (Shutdown)</strong><br><br>Your system is in <strong>shutdown mode</strong>, conserving energy and pulling inward. You may feel emotionally flat, physically exhausted, 
      or disconnected. You don’t need to push—you need <strong>gentle, consistent support</strong> that reminds your body it’s safe to feel again.<br><br>`;
      break;
    case 'green':
      message = `<strong>🟢 Regulation</strong><br><br>You’re in a <strong>state of balance</strong>—able to respond to life with presence, flexibility, and connection. This doesn’t mean life is stress-free,
      but your nervous system is resilient and adaptable.<br><br>Keep nourishing this state with the practices that work for you.`;
      break;
  }

  // Show result and hide the form
  form.style.display = "none";
  document.querySelector('#form-xyz #result').style.display = 'block';
  document.getElementById('xyz-result-text').innerHTML = message;
  document.querySelector('#form-xyz #result-error').style.display = "none"; // Hide error if previously shown
}
