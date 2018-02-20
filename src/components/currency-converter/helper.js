export class Helper {
  constructor() {
    this._currencyApiUrl = 'https://api.fixer.io/latest';
  }
  // To check if element has provided className
  hasClass(element, className) {
    return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1;
  }
  
  // To validate decimal number with maximun 4 digits after point.
  validateAmount(value) {
    let exp = new RegExp('[0-9]\d{0,9}(\.\d{1,3})?%?$');
    return exp.test(value);
  }

  //Fetches latest exchange rates. TODO: Implement caching , use localStorage to store data untill refresh time(once a day as specified
  // at api reference. 
  getCurrenciesLatestRates() {
    return fetch(this._currencyApiUrl)
    .then((response) => response.json());
  }
}
