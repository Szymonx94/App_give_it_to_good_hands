document.addEventListener("DOMContentLoaded", function() {
  /**
   * HomePage - Help section
   */
  class Help {
    constructor($el) {
      this.$el = $el;
      this.$buttonsContainer = $el.querySelector(".help--buttons");
      this.$slidesContainers = $el.querySelectorAll(".help--slides");
      this.currentSlide = this.$buttonsContainer.querySelector(".active").parentElement.dataset.id;
      this.init();
    }

    init() {
      this.events();
    }

    events() {
      /**
       * Slide buttons
       */
      this.$buttonsContainer.addEventListener("click", e => {
        if (e.target.classList.contains("btn")) {
          this.changeSlide(e);
        }
      });

      /**
       * Pagination buttons
       */
      this.$el.addEventListener("click", e => {
        if (e.target.classList.contains("btn") && e.target.parentElement.parentElement.classList.contains("help--slides-pagination")) {
          this.changePage(e);
        }
      });
    }

    changeSlide(e) {
      e.preventDefault();
      const $btn = e.target;

      // Buttons Active class change
      [...this.$buttonsContainer.children].forEach(btn => btn.firstElementChild.classList.remove("active"));
      $btn.classList.add("active");

      // Current slide
      this.currentSlide = $btn.parentElement.dataset.id;

      // Slides active class change
      this.$slidesContainers.forEach(el => {
        el.classList.remove("active");

        if (el.dataset.id === this.currentSlide) {
          el.classList.add("active");
        }
      });
    }

    /**
     * TODO: callback to page change event
     */
    changePage(e) {
      e.preventDefault();
      const page = e.target.dataset.page;

      console.log(page);
    }
  }
  const helpSection = document.querySelector(".help");
  if (helpSection !== null) {
    new Help(helpSection);
  }

  /**
   * Form Select
   */
  class FormSelect {
    constructor($el) {
      this.$el = $el;
      this.options = [...$el.children];
      this.init();
    }

    init() {
      this.createElements();
      this.addEvents();
      this.$el.parentElement.removeChild(this.$el);
    }

    createElements() {
      // Input for value
      this.valueInput = document.createElement("input");
      this.valueInput.type = "text";
      this.valueInput.name = this.$el.name;

      // Dropdown container
      this.dropdown = document.createElement("div");
      this.dropdown.classList.add("dropdown");

      // List container
      this.ul = document.createElement("ul");

      // All list options
      this.options.forEach((el, i) => {
        const li = document.createElement("li");
        li.dataset.value = el.value;
        li.innerText = el.innerText;

        if (i === 0) {
          // First clickable option
          this.current = document.createElement("div");
          this.current.innerText = el.innerText;
          this.dropdown.appendChild(this.current);
          this.valueInput.value = el.value;
          li.classList.add("selected");
        }

        this.ul.appendChild(li);
      });

      this.dropdown.appendChild(this.ul);
      this.dropdown.appendChild(this.valueInput);
      this.$el.parentElement.appendChild(this.dropdown);
    }

    addEvents() {
      this.dropdown.addEventListener("click", e => {
        const target = e.target;
        this.dropdown.classList.toggle("selecting");

        // Save new value only when clicked on li
        if (target.tagName === "LI") {
          this.valueInput.value = target.dataset.value;
          this.current.innerText = target.innerText;
        }
      });
    }
  }
  document.querySelectorAll(".form-group--dropdown select").forEach(el => {
    new FormSelect(el);
  });

  /**
   * Hide elements when clicked on document
   */
  document.addEventListener("click", function(e) {
    const target = e.target;
    const tagName = target.tagName;

    if (target.classList.contains("dropdown")) return false;

    if (tagName === "LI" && target.parentElement.parentElement.classList.contains("dropdown")) {
      return false;
    }

    if (tagName === "DIV" && target.parentElement.classList.contains("dropdown")) {
      return false;
    }

    document.querySelectorAll(".form-group--dropdown .dropdown").forEach(el => {
      el.classList.remove("selecting");
    });
  });

  /**
   * Switching between form steps
   */
  class FormSteps {
    constructor(form) {
      this.$form = form;
      this.$next = form.querySelectorAll(".next-step");
      this.$prev = form.querySelectorAll(".prev-step");
      this.$step = form.querySelector(".form--steps-counter span");
      this.currentStep = 1;

      this.$stepInstructions = form.querySelectorAll(".form--steps-instructions p");
      const $stepForms = form.querySelectorAll("form > div");
      this.slides = [...this.$stepInstructions, ...$stepForms];

      this.init();
    }

    /**
     * Init all methods
     */
    init() {
      this.events();
      this.updateForm();
    }

    /**
     * All events that are happening in form
     */
    events() {
      // Next step
      this.$next.forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault();
          this.currentStep++;
          this.updateForm();
        });
      });

      // Previous step
      this.$prev.forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault();
          this.currentStep--;
          this.updateForm();
        });
      });

      // Form submit
      this.$form.querySelector("form").addEventListener("submit", e => this.submit(e));
    }

    /**
     * Update form front-end
     * Show next or previous section etc.
     */
    updateForm() {
      this.$step.innerText = this.currentStep;

      // TODO: Validation

      this.slides.forEach(slide => {
        slide.classList.remove("active");

        if (slide.dataset.step == this.currentStep) {
          slide.classList.add("active");
        }
      });

      this.$stepInstructions[0].parentElement.parentElement.hidden = this.currentStep >= 6;
      this.$step.parentElement.hidden = this.currentStep >= 6;

      // TODO: get data from inputs and show them in summary
    }

    /**
     * Submit form
     *
     * TODO: validation, send data to server
     */
    submit(e) {
      e.preventDefault();
      this.currentStep++;
      this.updateForm();
    }
  }
  const form = document.querySelector(".form--steps");
  if (form !== null) {
    new FormSteps(form);
  }
});

window.addEventListener('DOMContentLoaded', function() {
  const categoryCheckboxes = document.querySelectorAll('input[name="categories"]');
  const organizationElements = document.getElementsByClassName('organization');

  let selectedCategories = [];

  categoryCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
      selectedCategories = Array.from(categoryCheckboxes)
        .filter(function(checkbox) {
          return checkbox.checked;
        })
        .map(function(checkbox) {
          return checkbox.value;
        });

      showFilteredOrganizations(selectedCategories);
    });
  });

  const showFilteredOrganizations = function(selectedCategories) {
    for (let i = 0; i < organizationElements.length; i++) {
      const organizationElement = organizationElements[i];
      const categoriesAttr = organizationElement.getAttribute('data-categories');
      const categories = categoriesAttr.split(',');

      if (
        selectedCategories.length === 0 ||
        selectedCategories.some(function(categoryId) {
          return categories.includes(categoryId);
        })
      ) {
        organizationElement.style.display = 'block';
      } else {
        organizationElement.style.display = 'none';
      }
    }
  };


    const categorySelect = document.getElementById('category-select');

    categorySelect.addEventListener('change', function() {
        const selectedCategoryId = parseInt(categorySelect.value);
        showFilteredOrganizations(selectedCategoryId);
    });

    const prevStepButton = document.querySelector('.prev-step');
    const nextStepButton = document.querySelector('.next-step');

    prevStepButton.addEventListener('click', function() {
        // Button back
        // ...
    });

    nextStepButton.addEventListener('click', function() {
        // button next
        // ...
    });
});

// steps 5


// Funkcja do wyświetlania podsumowania danych
function displaySummary() {
    // Pobranie wartości pól formularza
    let bags = document.querySelector('input[name="bags"]').value;
    let institution = document.querySelector('input[name="organization"]:checked').parentNode.querySelector('.title').innerText;
    let address = document.querySelector('input[name="address"]').value;
    let city = document.querySelector('input[name="city"]').value;
    let zipCode = document.querySelector('input[name="zip_code"]').value;
    let phoneNumber = document.querySelector('input[name="phone_number"]').value;
    let pickUpDate = document.querySelector('input[name="pick_up_date"]').value;
    let pickUpTime = document.querySelector('input[name="pick_up_time"]').value;
    let pickUpComment = document.querySelector('textarea[name="pick_up_comment"]').value;

    // Ustawienie wartości podsumowania
    document.getElementById('summary-quantity').innerText = bags + ' worki';
    document.getElementById('summary-institution').innerText = 'Dla fundacji "' + institution + '"';
    document.getElementById('summary-address').innerText = 'Ulica: ' + address;
    document.getElementById('summary-city').innerText = 'Miasto: ' + city;
    document.getElementById('summary-zip-code').innerText = 'Kod pocztowy: ' + zipCode;
    document.getElementById('summary-phone-number').innerText = 'Numer telefonu: ' + phoneNumber;
    document.getElementById('summary-pick-up-date').innerText = 'Data: ' + pickUpDate;
    document.getElementById('summary-pick-up-time').innerText = 'Godzina: ' + pickUpTime;
    document.getElementById('summary-pick-up-comment').innerText = 'Uwagi dla kuriera: ' + pickUpComment;
}

// Sprawdzenie, czy obecny krok to krok 5
let currentStep = document.querySelector('.form--steps-container .form--steps.active').getAttribute('data-step');
if (currentStep === '5') {
    // Wywołanie funkcji displaySummary() w kroku 5
    displaySummary();
}

function submit() {
  // Pobranie danych z kroku 5
  const bags = document.querySelector('input[name="bags"]').value;
  const categories = Array.from(document.querySelectorAll('input[name="categories"]:checked')).map(category => category.value);
  const institution = document.querySelector('input[name="organization"]:checked').value;
  const address = document.querySelector('input[name="address"]').value;
  const city = document.querySelector('input[name="city"]').value;
  const phoneNumber = document.querySelector('input[name="phone_number"]').value || ''; // Domyślna wartość pustego ciągu znaków, jeśli pole jest puste
  const zipCode = document.querySelector('input[name="zip_code"]').value;
  const pickUpDate = document.querySelector('input[name="pick_up_date"]').value;
  const pickUpTime = document.querySelector('input[name="pick_up_time"]').value;
  const pickUpComment = document.querySelector('textarea[name="pick_up_comment"]').value;

  // Zapisywanie danych w bazie danych za pomocą żądania POST
  fetch('/add-donation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').value
    },
    body: JSON.stringify({
      bags: bags,
      categories: categories,
      organization: institution,
      address: address,
      city: city,
      zip_code: zipCode,
      phone_number: phoneNumber,
      pick_up_date: pickUpDate,
      pick_up_time: pickUpTime,
      pick_up_comment: pickUpComment
    })
  })
    .then(response => {
      if (response.ok) {
        // Przekierowanie na stronę potwierdzenia
        window.location.href = '/form-confirmation';
      } else {
        // Obsługa błędu
        console.error('Błąd podczas zapisywania danych.');
      }
    })
    .catch(error => {
      console.error('Błąd podczas zapisywania danych:', error);
    });
}

// Wywołanie funkcji submit() po kliknięciu przycisku zapisu formularza
const submitButton = document.querySelector('button[type="submit"]');
submitButton.addEventListener('click', submit);