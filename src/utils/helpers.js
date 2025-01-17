// Frameworks
import { v4 as uuidv4 } from 'uuid';
import { ethers } from 'ethers';

const Helpers = {};

Helpers.now = () => {
  return (new Date()).getTime();
};

Helpers.isDate = (date) => {
  return (new Date(date) !== 'Invalid Date') && !isNaN(new Date(date));
};

Helpers.uuid = () => {
  return uuidv4();
};

Helpers.sleep = (delay = 0) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

Helpers.hideInitialLoading = (delay = 1200) => {
  setTimeout(() => {
    const style = document.createElement('style');
    style.innerHTML = '#dapp-root::before,#dapp-root::after {display: none !important;}';
    const ref = document.querySelector('#dapp-root');
    ref && ref.parentNode.insertBefore(style, ref);
  }, delay);
};

Helpers.getQueryString = (location, key) => {
  const urlParams = new URLSearchParams(location?.search?.replace('?', ''));
  return urlParams.get(key);
};

// Update URL with new Query String values without changing route
Helpers.updateQueryString = (key, value, routeTitle = 'Home') => {
  const oldParams = new URLSearchParams(location.search.replace('?', ''));
  oldParams.set(key, value);
  const newParams = oldParams.toString();
  window.history.replaceState(null, routeTitle, `${location.origin}${location.pathname}?${newParams}`);
};

Helpers.isSameAddress = (addressA, addressB) => {
  return _.toLower(addressA) === _.toLower(addressB);
};

Helpers.bigIntToStr = (bigIntValue) => {
  return ethers.BigNumber.from(bigIntValue).toString();
};

Helpers.getShortText = ({ text, length = 4, separator = '...', prefix = '' }) => {
  if (text.length <= length * 2) {
    return text;
  }
  return _.join(
    [
      ..._.slice(text, 0, length + prefix.length),
      separator,
      ..._.slice(text, -length),
    ],
    '',
  );
};

Helpers.getFriendlyAddress = ({ address, digits = 6, separator = ' ... ', prefix = '0x' }) => {
  return Helpers.getShortText({ text: address, length: digits, separator, prefix });
};

Helpers.formatCurrency = (amount) => {
  const dollarUSLocale = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  return dollarUSLocale.format(amount);
};

Helpers.formatTimestamp = (timestamp, locale = 'en-US') => {
  return (new Date(timestamp * 1000)).toLocaleString(locale, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export { Helpers };
