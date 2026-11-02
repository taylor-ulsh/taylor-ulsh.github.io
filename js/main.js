(function () {
  var root = document.documentElement;

  // --- Language toggle ---
  // The first choice is made by the small script in index.html's <head>.
  var descriptions = {
    da: 'Taylor Ulsh: personlig hjemmeside med projekter, lab-notesbog og kontakt.',
    en: 'Taylor Ulsh: personal website with projects, a lab notebook and contact details.'
  };
  var buttons = document.querySelectorAll('[data-set-lang]');
  var description = document.querySelector('meta[name="description"]');

  function applyLang(lang) {
    root.lang = lang;
    description.content = descriptions[lang];
    buttons.forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.setLang === lang));
    });
  }

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      applyLang(button.dataset.setLang);
      try { localStorage.setItem('lang', button.dataset.setLang); } catch (e) {}
    });
  });

  applyLang(root.lang);

  // --- SQL window: "Run" replays the animation ---
  var sqlWindow = document.getElementById('sql-window');

  document.getElementById('sql-run').addEventListener('click', function () {
    sqlWindow.classList.remove('play');
    void sqlWindow.offsetWidth; // Makes the browser notice the removal, so the animation restarts.
    sqlWindow.classList.add('play');
  });

  // --- Contact form: sends in the background and shows the result on the page ---
  var form = document.getElementById('contact-form');
  var submit = form.querySelector('button[type="submit"]');
  var states = form.querySelectorAll('[data-state]');

  function showState(name) {
    states.forEach(function (state) {
      state.hidden = state.dataset.state !== name;
    });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    showState('sending');
    submit.disabled = true;

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    }).then(function (response) {
      if (!response.ok) throw new Error('Status ' + response.status);
      form.reset();
      showState('sent');
    }).catch(function () {
      showState('error');
    }).finally(function () {
      submit.disabled = false;
    });
  });
})();
