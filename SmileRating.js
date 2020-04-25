class SmileRating extends HTMLElement {

  // Declare the class properties at the top of the class


  // Setup property with getter and setter for greater control
  _value = null;
  get value() {
    return this._value;
  }

  set value(v) {
    this._value = parseInt(v);

    if ((this._value < -2) || (this.value > 2)) {
      console.warn('[SmileRating] Value should be between -2 and 2');
    }
    if (this._value < -2) this._value = -2;
    if (this._value > 2) this._value = 2;

    this._updateClasses();

    // Notify that we have changed
    this.dispatchEvent(new CustomEvent('change'));
  }


  // _ denotes private (not to be accessed outside this code)
  _shadow = null;


  /**
   * Retrieve the list of emojis
   */
  get _buttons() {
    // Convert from Element list to array so we can loop
    return Array.from(this._shadow.querySelectorAll('li'));
  }


  connectedCallback() {
    // Set the inner html (template) when the component is put/inserted
    this._shadow = this.attachShadow({
      mode: 'closed' // Can I access inside the shadow dom with JS (open = yes)
    });

    // Assign the initial HTML template
    this._shadow.innerHTML = `
      <style>
        :host {
          user-select: none;
        }
        li {
          display: inline-block;
          opacity: 0.4;
          cursor: pointer;
          transition: transform 0.2s;
        }
        li:hover {
          opacity: 0.6;
        }
        li.active {
          opacity: 1;
        }
        li:hover, li.active {
          transform: scale(1.1);
        }

      </style>
      <ul>
        <li data-value="-2">😡</li>
        <li data-value="-1">☹️</li>
        <li data-value="0">😐</li>
        <li data-value="1">😀</li>
        <li data-value="2">😁</li>
      </ul>
    `;

    // Setup all event listeners etc

    // Register click event listener for all buttons
    this._buttons.forEach(li => {
      // When we click on an emoji...
      li.addEventListener('click', () => {
        // When we click on an emoji, grab the 'data-value' attribute, and assign
        // as the value of the component
        this.value = parseInt(li.getAttribute('data-value'));
      })
    })
  }


  // Add or remove "active" class on ALL buttons depending on the "data-value"
  _updateClasses() {
    // Loop over all the buttons/emojis
    this._buttons.forEach(li => {
      // If the CURRENT li/emoji has the right value...
      const v = parseInt(li.getAttribute('data-value'))
      // Add the class 'active'
      if (this.value === v) li.classList.add('active');
      // Otherwise remove it
      else li.classList.remove('active');
    })
  }

}


// Register the custom element
window.customElements.define(
  'smile-rating', // Remember the dash!
  SmileRating
);
