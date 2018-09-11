<template>
    <v-card flat>
        <v-card-text>

            <v-layout wrap>

                <v-flex xs12>
                    <p>How should you be paid?</p>
                </v-flex>
                <v-flex x12>
                    <v-radio-group v-model="settlements" :mandatory="false">
                        <v-radio label="Next day settlements" value="auto"></v-radio>
                        <v-radio label="Manual Settlements" value="manual"></v-radio>
                    </v-radio-group>
                </v-flex>


                <v-flex xs12>
                    <v-switch v-model="transactionEmails" label="Send Transactional emails"></v-switch>
                </v-flex>
                <v-flex xs12>
                    <v-switch v-model="transactionEmailsCustomers" label="Send Transaction receipts to customers"></v-switch>
                </v-flex>
                <v-flex xs12 class="text-xs-center">
                    <v-btn @click="update" :loading="loading" color="success" flat>Save Changes</v-btn>
                </v-flex>
            </v-layout>
        </v-card-text>
    </v-card>
</template>

<script>
import Parse from 'parse';
import moment from 'moment';
import Util from '@/util';
export default {
  name: 'business-preferences',
  data () {
    return {
      transactionEmails: true,
      transactionEmailsCustomers: true,
      settlements: 'auto',
      loading: false,
      business: null

    };
  },
  async mounted () {
    const business = await Util.getCurrentBusiness();
    this.business = business;
    this.transactionEmails = business.get('sendTransactionEmails');
    this.transactionEmailsCustomers = business.get('sendCustomersTransactionEmails');
    this.settlements = business.get('settlements');
  },
  methods: {
    async update () {
      this.loading = true;
      try {
        const response = await Parse.Cloud.run('updateBusinessProfile',
          { businessId: this.business.id, updatePreferences: true, settlements: this.settlements, sendTransactionEmails: this.transactionEmails, sendCustomersTransactionEmails: this.transactionEmailsCustomers });
        Util.toast(response);
      } catch (e) {
        Util.toast(e.message, false);
      }
      finally {
        this.loading = false;
      }
    }
  },
};
</script>
