import Parse from 'parse';
import localforage from 'localforage';
// export function camel (str) {
//   const camel = (str || '').replace(/-([^-])/g, g => g[1].toUpperCase());

//   return capitalize(camel);
// }

// export function camelActual (str) {
//   return (str || '').replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''));
// }

// export function kebab (str) {
//   return (str || '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
// }

// export function capitalize (str) {
//   str = str || '';

//   return `${str.substr(0, 1).toUpperCase()}${str.slice(1)}`;
// }

// export function findProduct (store, id) {
//   return store.state.store.products.find(p => p.id === id);
// }

// export function isOnSale (variants) {
//   return variants.some(variant => {
//     return parseFloat(variant.price) < parseFloat(variant.compareAtPrice);
//   });
// }

// export function randomNumber (min, max) {
//   return Math.floor(Math.random() * max) + min;
// }

// export function randomString (length = 5) {
//   let text = '';
//   const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

//   for (let i = 0; i < length; i++) {
//     text += possible.charAt(Math.floor(Math.random() * possible.length));
//   }

//   return text;
// }
const randomElement = (arr = []) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

const kebab =  (str) => {
  return (str || '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};

const toggleFullScreen = () => {
  let doc = window.document;
  let docEl = doc.documentElement;

  let requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
  let cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

  if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
    requestFullScreen.call(docEl);
  }
  else {
    cancelFullScreen.call(doc);
  }
};
const getCurrency = () => {
  return 'NGN';
};

const getCurrentUser = () => {
  return Parse.User.current();
};

const getCurrentBusiness = async () => {
  const businesses = await getCurrentUser().relation('businesses').query().find();
  const singleBusiness = businesses.length === 1;
  if (businesses.length === 0) {
    // user is not attached to any business
    return null;
  }

  if (singleBusiness) {
    return businesses[0];
  }
  const currentBusinessId = await localforage.getItem('current_business');
  if (currentBusinessId) {
    const business = businesses.find((business) => business.id === currentBusinessId);
    if (business) {
      return business;
    } else {
      // business not found
      return null;
    }
  } else {
    // choose first business
    const business = businesses[0];
    await localforage.setItem('current_business', business.id);
    return business;
  }
};

const toast = (message, success = true) => {
  const evt = new CustomEvent(success ? 'toast_success' : 'toast_failure', { detail: message });
  document.dispatchEvent(evt);
};
export default {
  randomElement,
  toggleFullScreen,
  kebab,
  getCurrentUser,
  getCurrentBusiness,
  getCurrency,
  getParameterByName,
  toast
};
