// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';

import Business from '@/models/business';

import App from './App';
import Vuetify from 'vuetify';
import Parse from 'parse';
import router from './router';
import 'font-awesome/css/font-awesome.css';
import './theme/default.styl';
import VeeValidate from 'vee-validate';
import colors from 'vuetify/es5/util/colors';
import Truncate from 'lodash.truncate';

Parse.initialize('innstapay');
const liveUrl = 'https://api.innstapay.com/api';
const testUrl = 'https://api-test.innstapay.com/api';
const localUrl = 'http://localhost:4667/api';

const hostname = window.location.hostname;
console.log(hostname);
if (hostname === 'dashboard.innstapay.com') {
  Parse.serverURL = liveUrl;
  Parse.checkoutURL = 'https://checkout.innstapay.com/pay/';
} else if (hostname === 'dashboard-test.innstapay.com') {
  Parse.serverURL = testUrl;
  Parse.checkoutURL = 'https://checkout-test.innstapay.com/pay/';
} else {
  Parse.checkoutURL = 'https://checkout-test.innstapay.com/pay/';
  Parse.serverURL = testUrl;
}

Parse.Object.registerSubclass('Business', Business);


Vue.config.productionTip = false;
// Helpers
// Global filters
Vue.filter('truncate', Truncate);
Vue.use(VeeValidate, { fieldsBagName: 'formFields' });
Vue.use(Vuetify, {
  // theme: {
  //   primary: colors.indigo.base, // #E53935
  //   secondary: colors.indigo.lighten4, // #FFCDD2
  //   accent: colors.indigo.base // #3F51B5
  // },
  options: {
    themeVariations: ['primary', 'secondary', 'accent'],
    extra: {
      mainToolbar: {
        color: 'primary',
      },
      sideToolbar: {
      },
      sideNav: 'primary',
      mainNav: 'primary lighten-1',
      bodyBg: '',
    }
  }
});
// Bootstrap application components



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
