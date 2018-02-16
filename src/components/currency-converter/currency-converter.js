const currentDocument = (document._currentScript || document.currentScript).ownerDocument;


class CurrencyConverter extends HTMLElement {
  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: 'open' });

    // Select the template and clone it. Finally attach the cloned node to the shadowDOM's root.
    // Current document needs to be defined to get DOM access to imported HTML
    const template = currentDocument.querySelector('#currency-converter-template');
    const instance = template.content.cloneNode(true);
    shadowRoot.appendChild(instance);
    this._setApiUrl(this.getAttribute('currency-list'));
     // Fetch the data for requested currencies
    fetch(this._apiUrl)
      .then((response) => response.json())
      .then((data) => {
        this._render(JSON.parse(data));
      })
      .catch((error) => {
        console.error(error);
      });
  }
  _setApiUrl(currencies) {
    if (currencies) {
      this._apiUrl = `https://api.fixer.io/latest?symbols=${currencies}`;
    } else {
      this._apiUrl = 'https://api.fixer.io/latest';
    }
  }
 
  _render(data) {
    let sourceCurrencyEl = this.shadowRoot.querySelector('#sourceCurrency');
    let targetCurrencyEl = this.shadowRoot.querySelector('#targetCurrency');
    if (data.rates) {
      Object.keys(data.rates).forEach((currency,index) => {
        sourceCurrencyEl.appendChild(`<option value="${currency}">${currency}</option>`);
        targetCurrencyEl.appendChild(`<option value="${currency}">${currency}</option>`);
      });
    }
  }
    
  }
}
window.customElements.define('hd-currency-converter', CurrencyConverter);