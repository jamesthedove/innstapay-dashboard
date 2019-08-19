<template>
    <v-dialog persistent v-model="dialog" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">Fund Account</span>
                <v-spacer></v-spacer>
                <v-btn icon @click="close">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <template v-if="completedMessage">
                    <v-flex class="text-xs-center">
                        <v-icon color="green" x-large>check</v-icon>
                        <h3>{{completedMessage}}</h3>
                    </v-flex>

                </template>
                <v-container v-else grid-list-md>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-text-field v-model="amount" label="Amount (NGN)"></v-text-field>
                        </v-flex>

                        <v-flex xs12 class="text-xs-center">
                            <v-btn :loading="loading" @click="fundAccount" color="success" depressed="">Fund Account</v-btn>
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
  name: 'fund-account',
  data: () => ({
    amount: '',
    description: '',
    businessId: '',
    loading: false,
    completedMessage: '',
    dialog: true
  }),
  watch: {
    amount: function (newValue) {
      const result = newValue.replace(/\D/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      Vue.nextTick(() => {
        this.amount = result;
      });
    },
    dialog (value) {
      if (!value) {
        this.$emit('done');
      }
    }
  },
  async mounted () {
    this.businessId = (await Util.getCurrentBusiness()).id;
  },
  methods: {
    close () {
      this.$emit('done');
    },
    async fundAccount () {
      if (this.amount) {
        this.loading = true;
        const amount = parseFloat(this.amount.replace(/,/g, ''));
        const publicKey = Parse.serverURL.indexOf('test') > 0 ? 'pk_test_813ab985ib4f5-4c5b-b100-d71513fcf3de' : 'pk_8a624b1c-d553-44f4-a5be-47219e45257e';
        Innstapay.showPaymentDialog({
          amount: amount,
          key: publicKey, // innstapay business public key
          customer: {
            email: Util.getCurrentUser().getEmail() // user email
          },
          onClose: () => {
            this.loading = false;
            this.dialog = false;
          },
          callback: async (ref) => {
            Util.toast('Completing Transaction');
            try {
              this.completedMessage = await Parse.Cloud.run('businessFundAccount', { amount, ref, businessId: this.businessId });
            }
            catch (e) {
              Util.toast(e.message, false);
            }
            this.loading = false;

          }
        });
      }
    }
  },

};
</script>
