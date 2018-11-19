<template>
    <v-dialog persistent v-model="dialog" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">Create Payment Page</span>
                <v-spacer></v-spacer>
                <v-btn icon @click="close">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-alert outline color="error" icon="warning" :value="error">
                    {{error}}
                </v-alert>
                <template v-if="completedMessage">
                        <v-flex class="text-xs-center">
                            <v-icon color="green" x-large>check</v-icon>
                            <h3>{{completedMessage}}</h3>
                            <a target="_blank" :href="pageUrl">{{pageUrl}}</a>
                        </v-flex>

                </template>
                <v-container v-else grid-list-md>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-text-field :hint="hintText" v-model="name" maxlength="20" label="Name (No spaces)"></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field v-model="amount" label="Amount (NGN)"></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field v-model="description" label="Description"></v-text-field>
                        </v-flex>

                        <v-flex xs12 class="text-xs-center">
                            <v-btn :loading="loading" @click="create" color="success" depressed="">Create Page</v-btn>
                        </v-flex>

                    </v-layout>
                </v-container>
            </v-card-text>
        </v-card>
    </v-dialog>

</template>

<script>
import Parse from 'parse';
import Vue from 'vue';
import Util from '@/util';
export default {
  name: 'new-payment-page',
  data: () => ({
    banks: [],
    name: '',
    amount: '',
    description: '',
    businessId: '',
    dialog: true,
    pageUrl: '',
    completedMessage: '',
    loading: false,
    error: ''
  }),
  computed: {
    hintText () {
      if (this.name) {
        this.pageUrl = Parse.checkoutURL + this.name;
        return `Your page will be at ${this.pageUrl}`;
      }
    }
  },
  watch: {
    amount: function (newValue) {
      const result = newValue.replace(/\D/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      Vue.nextTick(() => {
        this.amount = result;
      });
    }
  },
  async mounted () {
    this.businessId = (await Util.getCurrentBusiness()).id;
  },
  methods: {
    close () {
      this.$emit('done');
    },
    async getAccountName () {
      try {
        const bankCode = (this.bankObjects.find((bankObject) => bankObject.get('name') === this.bank)).get('code');
        this.bankCode = bankCode;
        this.accountName = await Parse.Cloud.run('bankAccountNameLookup', { accountNo: this.accountNo, bankCode: bankCode });
      }
      catch (e) {
        this.reset();
      }

    },
    async create () {
      if (this.name && this.description) {
        this.loading = true;
        const amount = parseFloat(this.amount.replace(/,/g, ''));
        try {
          this.completedMessage = await Parse.Cloud.run('createPaymentPage', {
            path: this.name,
            amount: amount, notes: this.description, businessId: this.businessId
          });
        }
        catch (e) {
          this.loading = false;
          this.error = e.message;
        }

      }
    }
  },

};
</script>
