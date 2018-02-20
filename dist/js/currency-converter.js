// import Helper from "./helper";

//Should be placed in a separate file - helper.js
class Helper {
  constructor() {
    this._currencyApiUrl = 'https://api.fixer.io/latest';
  }
  // To check if element has a given className
  hasClass(element, className) {
    return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1;
  }
  // To remove given class from the element
  removeClass(errElement, className) {
    if (this.hasClass(errElement, className)) {
      errElement.className = errElement.className.replace(className, '');
    }
  }
// To add class to the element
  addClass(errElement, className) {
    if (!this.hasClass(errElement, className)) {
      errElement.className = errElement.className + ' ' + className;
    }
  }
  // To validate decimal number with maximum 4 digits after point.
  validateAmount(value) {
    let exp = new RegExp('[0-9]\d{0,9}(\.\d{1,3})?%?$');
    return exp.test(value);
  }

  //Fetches latest exchange rates. TODO: Implement caching , use localStorage to store data until refresh time(once a day as specified
  // at api reference. 
  getCurrenciesLatestRates() {
    return fetch(this._currencyApiUrl)
    .then((response) => response.json());
  }
  // Create option object and add it to given select element
  renderSelectElement(text, value, $element, defaultValue) {
    let $option = document.createElement("option");
    $option.innerHTML = text;
    $option.value = value;
    if (value === defaultValue) {
      $option.selected = true;
    }
    $element.appendChild($option);
  }
}

// Contains implementation for currency converter web component
class CurrencyConverter extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._sourceValue = 0.00;
    this._targetValue = 0.00;
    this._sourceCurrencyObj = null;
    this._targetCurrencyObj = null;
    this._currenciesRange = 'USD,EUR,CAD';
    this._helper = new Helper();
  }
  //This event called when element is added to the DOM.
  connectedCallback() {
    //Set reference to component elements, set attributes and define event handlers
    this._init();
    // Fetch the data for requested currencies
    this._helper.getCurrenciesLatestRates()
      .then((data) => {
        if (data && data.rates) {
          this._currencyData = data;
          this._render();
          this._setCurrentExchangeRate();
        }
      })
      .catch((error) => {
        this._removeClass(this._apiErrorElement, 'hide');
        console.error(error);
      });
  }
  _attachTemplate() {
    const currentDocument = (document._currentScript || document.currentScript).ownerDocument;
    // Select the template and clone it. Finally attach the cloned node to the shadowDOM's root.
    // Current document needs to be defined to get DOM access to imported HTML
    const template = currentDocument.querySelector('#currency-converter-template');
    const instance = template.content.cloneNode(true);
    this._shadowRoot.appendChild(instance);
  }

  _setDomElementsReference() {
    this._$sourceAmount = this._shadowRoot.querySelector('#sourceAmount');
    this._$targetAmount = this._shadowRoot.querySelector('#targetAmount');
    this._$sourceCurrency = this._shadowRoot.querySelector('#sourceCurrency');
    this._$targetCurrency = this._shadowRoot.querySelector('#targetCurrency');
    this._$disclaimer = this._shadowRoot.querySelector('.disclaimer');
    this._$disclaimerContainer = this._shadowRoot.querySelector('.disclaimerContainer');
    this._apiErrorElement = this._shadowRoot.querySelector('#apiError');
    this._sourceAmountErrorElement = this._shadowRoot.querySelector('#sourceAmountError');
  }

  // Adding event listeners to some of the elements in the template
  _addEventListeners() {
    this._$sourceAmount.addEventListener('keyup', (event) => {
      this._sourceAmountChangeEventHandler(event);
    });
    this._$sourceCurrency.addEventListener('change', (event) => {
      this._currencyChangeEventHandler(event);
    });
    this._$targetCurrency.addEventListener('change', (event) => {
      this._currencyChangeEventHandler(event);
    });
    this._$disclaimer.addEventListener('click', (event) => {
      this._toggleDisclaimer(event);
    });
  }

  _init() {
    this._attachTemplate();
    this._setDomElementsReference();
    this._addEventListeners();
    // get component attributes 
    this._sourceCurrencyValue = this.getAttribute('source');
    this._targetCurrencyValue = this.getAttribute('target');
    this._currenciesRange = this.getAttribute('currencies') || this._currenciesRange;
  }

  // Set calculated amount to the target field
  _setTargetAmount(sourceAmount) {
    this._$targetAmount.value = (sourceAmount * this._currentExchangeRate).toFixed(2);
  }

  // setting up event handler on every source amount change
  _sourceAmountChangeEventHandler(event) {
    if (this._helper.validateAmount(event.target.value)) {
      // show error validation message
      this._helper.addClass(this._sourceAmountErrorElement, 'hide');
      this._setTargetAmount(event.target.value);
    } else {
      this._setTargetAmount(0);
      // hide error validation message
      this._helper.removeClass(this._sourceAmountErrorElement, 'hide');
    }
  }

  // setting up event hnadler on every currency change
  _currencyChangeEventHandler(event) {
    if (this._helper.validateAmount(this._$sourceAmount.value)) {
      // update current exchange rate on currency change
      this._setCurrentExchangeRate();
      // set rate value to be displayed in disclaimer  
      this._$disclaimerContainer.querySelector('#rate').innerHTML =  this._currentExchangeRate;
      // calculate target amount 
      this._setTargetAmount(this._$sourceAmount.value);
    } else {
      this._setTargetAmount(0);
    }
  }

  _toggleDisclaimer(event) {
    let className = 'hide';
    if (this._helper.hasClass(this._$disclaimerContainer, className)) {
      this._$disclaimerContainer.className = this._$disclaimerContainer.className.replace(className, '');
      this._$disclaimerContainer.querySelector('#rate').innerHTML =  this._currentExchangeRate;
      this._$disclaimerContainer.querySelector('#date').innerHTML =  this._currencyData.date;
    } else {
      this._$disclaimerContainer.className = this._$disclaimerContainer.className + ' ' + className;
    }
  }
  
   // Renders source and target currency select elements
  _render() {
    this._currenciesRange.split(',').forEach((currency, index) => {
      this._helper.renderSelectElement(currency, currency, this._$sourceCurrency, this._sourceCurrencyValue);
      this._helper.renderSelectElement(currency, currency, this._$targetCurrency, this._targetCurrencyValue);
    });
  }

  // Sets current exchange rate. Base rate is considered as EUR (default).
  _setCurrentExchangeRate() {
    if (this._currencyData && this._currencyData.rates) {
      let fromCurrency = this._$sourceCurrency.options[this._$sourceCurrency.selectedIndex].value;
      let toCurrency = this._$targetCurrency.options[this._$targetCurrency.selectedIndex].value;
      let fromEuroBaseRate = (fromCurrency === 'EUR') ? 1.0000 : parseFloat(this._currencyData.rates[fromCurrency]);
      let toEuroBaseRate = (toCurrency === 'EUR') ? 1.0000 : parseFloat(this._currencyData.rates[toCurrency]);
      this._currentExchangeRate = (toEuroBaseRate / fromEuroBaseRate).toFixed(4);
    } else {
      this._currentExchangeRate = 0;
    }
  }
}
window.customElements.define('hd-currency-converter', CurrencyConverter);