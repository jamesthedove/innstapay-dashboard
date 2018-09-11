<template>
    <v-dialog persistent v-model="dialog" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">Add Bank Account</span>
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
                        </v-flex>

                </template>
                <v-container v-else grid-list-md>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-select :disabled="!!accountName" label="Bank" :items="banks" :loading="banks.length ===0" v-model="bank"></v-select>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field v-model="accountNo" :disabled="!bank || accountNo.length === 10" label="Account Number" required></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field v-model="accountName" :loading="accountNo.length === 10 && !accountName" label="Account Name" disabled></v-text-field>
                        </v-flex>

                        <a @click="reset">Reset</a>

                        <v-flex xs12 class="text-xs-center">
                            <v-btn :loading="loading" @click="add" color="success" depressed="">Add Bank Account</v-btn>
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
  name: 'add-bank-account',
  data: () => ({
    banks: [],
    accountNo: '',
    accountName: '',
    bankObjects: [],
    bank: null,
    businessId: '',
    dialog: true,
    completedMessage: '',
    loading: false,
    error: ''
  }),
  watch: {
    accountNo (value) {
      if (value.length === 10) {
        this.getAccountName();
      }
    }
  },
  async mounted () {
    this.businessId = (await Util.getCurrentBusiness()).id;
    this.bankObjects = await new Parse.Query('Bank').equalTo('country', 'NG').ascending('name').find();
    this.banks = this.bankObjects.map((bankObject) => bankObject.get('name'));
  },
  methods: {
    reset () {
      this.accountNo = '';
      this.accountName = '';
      this.bank = null;
      this.bankCode = null;
      this.error = '';
    },
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
    async add () {
      if (this.accountNo && this.accountName && this.bankCode) {
        this.loading = true;
        try {
          this.completedMessage = await Parse.Cloud.run('addBusinessBankAccount', {
            no: this.accountNo, name: this.accountName,
            bankCode: this.bankCode, businessId: this.businessId
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