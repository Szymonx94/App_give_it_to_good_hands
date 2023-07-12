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


function goToStep(step) {
    document.querySelectorAll('[data-step]').forEach(function (element) {
        element.style.display = 'none';
    });

    document.querySelector('[data-step="' + step + '"]').style.display = 'block';
}


function updateSummary() {
  const bagsInput = document.querySelector("input[name='bags']");
  const addressInput = document.querySelector("input[name='address']");
  const cityInput = document.querySelector("input[name='city']");
  const postcodeInput = document.querySelector("input[name='postcode']");
  const phoneInput = document.querySelector("input[name='phone']");
  const dateInput = document.querySelector("input[name='data']");
  const timeInput = document.querySelector("input[name='time']");
  const commentInput = document.querySelector("textarea[name='more_info']");

  // Pobierz wartości z pól formularza
  const bagsValue = bagsInput.value;
  const addressValue = addressInput.value;
  const cityValue = cityInput.value;
  const postcodeValue = postcodeInput.value;
  const phoneValue = phoneInput.value;
  const dateValue = dateInput.value;
  const timeValue = timeInput.value;
  const commentValue = commentInput.value;

  // Pobierz zaznaczone kategorie z formularza
  const selectedCategories = Array.from(document.querySelectorAll("input[name='categories']:checked"))
    .map(input => input.nextSibling.textContent.trim())
    .join(", ");

  // Pobierz wybraną organizację z formularza
  const selectedInstitution = document.querySelector("input[name='organization']:checked");
  const institutionName = selectedInstitution ? selectedInstitution.nextSibling.querySelector(".title").textContent : "";

  // Uaktualnij podsumowanie
  document.getElementById("summary-quantity").textContent = `Oddajesz: ${selectedCategories}`;
  document.getElementById("summary-institution").textContent = `Wybrana organizacja: ${institutionName}`;
  document.getElementById("summary-address-display").textContent = `Adres odbioru: ${addressValue}`;
  document.getElementById("summary-city-display").textContent = `Miasto: ${cityValue}`;
  document.getElementById("summary-zip-code-display").textContent = `Kod pocztowy: ${postcodeValue}`;
  document.getElementById("summary-phone-number-display").textContent = `Numer telefonu: ${phoneValue}`;
  document.getElementById("summary-pick-up-date-display").textContent = `Data odbioru: ${dateValue}`;
  document.getElementById("summary-pick-up-time-display").textContent = `Godzina odbioru: ${timeValue}`;
  document.getElementById("summary-pick-up-comment-display").textContent = `Uwagi dla kuriera: ${commentValue}`;


    goToStep(5);
}

