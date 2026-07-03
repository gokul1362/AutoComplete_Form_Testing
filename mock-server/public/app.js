(function () {
  const input = document.getElementById('input-field');
  const list = document.getElementById('suggestions-list');
  const items = Array.from(list.querySelectorAll('li'));
  const nextButton = document.getElementById('next-button');
  const errorMessage = document.getElementById('error-message');
  const successContainer = document.getElementById('success-container');

  const ALL_SUGGESTIONS = items.map((li) => li.dataset.value);
  let matchMode = 'prefix';
  let selectedValue = null;
  const startDate = new Date().toISOString();

  // Load the Admin-configured match mode (FR-02 vs FR-03).
  fetch('/api/config')
    .then((r) => r.json())
    .then((cfg) => {
      matchMode = cfg.matchMode || 'prefix';
    })
    .catch(() => {
      matchMode = 'prefix';
    });

  function visibleSuggestions() {
    return items.filter((li) => !li.hidden).map((li) => li.dataset.value);
  }

  function filterSuggestions(typed) {
    const term = typed.trim().toLowerCase();
    items.forEach((li) => {
      const value = li.dataset.value.toLowerCase();
      let matches;
      if (term === '') {
        matches = true;
      } else if (matchMode === 'anywhere') {
        matches = value.includes(term); // FR-03
      } else {
        matches = value.startsWith(term); // FR-02 (default)
      }
      li.hidden = !matches;
    });
  }

  function selectSuggestion(value) {
    input.value = value;
    selectedValue = value;
    hideMessages();
    filterSuggestions(value);
  }

  function hideMessages() {
    errorMessage.classList.remove('visible');
    successContainer.classList.remove('visible');
  }

  function showError() {
    errorMessage.classList.add('visible');
    successContainer.classList.remove('visible');
  }

  function showSuccess() {
    successContainer.classList.add('visible');
    errorMessage.classList.remove('visible');
  }

  input.addEventListener('input', () => {
    selectedValue = null;
    hideMessages();
    filterSuggestions(input.value);
  });

  items.forEach((li) => {
    li.addEventListener('click', () => selectSuggestion(li.dataset.value));
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        selectSuggestion(li.dataset.value);
      }
    });
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitForm();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      input.value = '';
      selectedValue = null;
      hideMessages();
      filterSuggestions('');
    }
  });

  nextButton.addEventListener('click', submitForm);

  async function submitForm() {
    const text = input.value.trim();
    const isValidSelection = ALL_SUGGESTIONS.includes(text);
    const endDate = new Date().toISOString();

    if (!isValidSelection) {
      showError();
      return;
    }

    const payload = {
      start_date: startDate,
      end_date: endDate,
      locale: navigator.language || 'en-US',
      text: text,
      suggestion_list: visibleSuggestions().join(', '),
      completed: true,
    };

    try {
      const res = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.status === 200) {
        showSuccess();
      } else {
        showError();
      }
    } catch (err) {
      showError();
    }
  }
})();
