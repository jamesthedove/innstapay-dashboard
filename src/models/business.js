/**
 * Created by James Falade on 21/08/2018.
 */
import Parse from 'parse';

class Business extends Parse.Object {

  constructor () {
    super('Business');
  }

  getPointer () {
    return {
      __type: 'Pointer',
      className: 'Business',
      objectId: this.id
    };
  }

  getStatus () {
    return this.get('status');
  }

  getName () {
    return this.get('name');
  }

  getAddress () {
    return this.get('address');
  }

  getEmail () {
    return this.get('email');
  }

  getSupportEmail () {
    return this.get('supportEmail');
  }

  getPhone () {
    return this.get('phone');
  }
  getWebsite () {
    return this.get('website');
  }
  getLogoUrl () {
    if (this.get('logo')) {
      return this.get('logo').url();
    }
    return null;
  }

  async getTransactions (skip = 0, limit = 10, status = 'successful') {
    console.log('skip');
    console.log(skip);
    const query = new Parse.Query('BusinessTransaction').equalTo('status', status).equalTo('business', this.getPointer()).descending('updatedAt').limit(limit);
    if (skip) {
      query.skip(skip);
    }
    return query.find();
  }

  async getTransaction (ref) {
    const referenceField = ref.indexOf('innstapay') > -1 ? 'ref' : 'bRef';
    return new Parse.Query('BusinessTransaction').equalTo(referenceField, ref).equalTo('business', this.getPointer()).first();
  }
  async getApiKey () {
    return new Parse.Query('ApiKey').equalTo('business', this.getPointer()).first();
  }

  async getBankAccount () {
    const bankAccount = await new Parse.Query('BusinessBank').equalTo('business', this.getPointer()).notEqualTo('closed', true).first();
    if (bankAccount) {
      const bank = await new Parse.Query('Bank').equalTo('code', bankAccount.get('bankCode')).first();
      bankAccount.bankName = bank.get('name');
      return bankAccount;
    }


  }

  async getIncome (from, to, getAll) {
    const query = new Parse.Query('BusinessBalanceUpdate').equalTo('business', this.getPointer()).descending('updatedAt').limit(1000);

    if (!getAll) {
      query.equalTo('action', 'credit');
    }
    if (from) {
      query.greaterThan('createdAt', from);
    }
    if (to) {
      query.lessThanOrEqualTo('createdAt', to);
    }
    return query.find();
  }
  async getBankTransfers () {
    return new Parse.Query('BusinessTransfer').include('bank').equalTo('business', this.getPointer()).descending('updatedAt').limit(100).find();
  }

  async getPaymentPages () {
    return new Parse.Query('BusinessPaymentPage').equalTo('business', this.getPointer()).descending('updatedAt').limit().find();
  }

  async getCustomers () {
    return new Parse.Query('BusinessCustomer').equalTo('business', this.getPointer()).descending('updatedAt').limit(10000).find();
  }
  async getCustomer (email) {
    return new Parse.Query('BusinessCustomer').equalTo('business', this.getPointer()).equalTo('email', email).first();
  }
  async getUsers () {
    return new Parse.Query('BusinessUser').include('publicUser').equalTo('business', this.getPointer()).find();
  }
  async getMetrics () {
    if (this.metrics) {
      return this.metrics;
    }
    const metricQuery = new Parse.Query('BusinessMetric').equalTo('business', this.getPointer());
    this.metrics = await metricQuery.first();
    const subscription = metricQuery.subscribe();

    subscription.on('update', (object) => {
      console.log('updated');
      if (this.onUpdated) {
        this.onUpdated('metrics', object);
      }
      this.metrics = object;
    });
    return this.metrics;
  }

  async getBalance () {
    const balanceObject = await new Parse.Query('BusinessBalance').equalTo('business', this.getPointer()).first();
    return balanceObject.get('usable_balance');
  }

  async getTodayIncome () {
    return Parse.Cloud.run('getBusinessTodayIncome', { business: this.id });
  }
}

export default Business;
