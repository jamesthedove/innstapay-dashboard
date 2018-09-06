<template>
    <v-dialog persistent v-model="dialog" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">Bulk Transfer</span>
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
                            <h3 v-html="completedMessage"></h3>
                        </v-flex>

                </template>
                <v-container v-else grid-list-md>
                    <v-layout wrap>
                        <v-flex v-if="!confirm" class="text-xs-center">
                            <v-btn :loading="uploading" @click="$refs.file.click()" outline>Select CSV file</v-btn>
                            <h5 v-if="uploading">Uploading and Validating</h5>
                        </v-flex>

                        <input @change="fileChanged" ref="file" accept=".csv" class="hidden" type="file"/>

                        <v-flex xs12 class="text-xs-center">
                            <h5>{{confirm}}</h5>
                            <v-btn v-if="confirm" :loading="loading" @click="transfer" color="success" depressed="">Transfer</v-btn>
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
  name: 'bulk-transfer',
  data: () => ({
    amount: '',
    businessId: '',
    uploading: false,
    dialog: true,
    completedMessage: '',
    loading: false,
    error: '',
    confirm: '',
    ref: ''
  }),
  watch: {
    accountNo (value) {
      if (value.length === 10) {
        this.getAccountName();
      }
    },
    dialog (value) {
      if (!value) {
        this.$emit('done');
      }
    },
    amount: function (newValue) {
      const result = newValue.replace(/\D/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        Vue.nextTick(() =>{
            this.amount = result
        });
    }
  },
  async mounted () {
    this.businessId = (await Util.getCurrentBusiness()).id;
  },
  methods: {
    fileChanged(){
        const file = this.$refs.file.files[0];
        const fileName = 'bulk_upload.csv';
        this.uploading = true;
        const parseFile = new Parse.File(fileName, file);
        parseFile.save().then(() => {
            return Parse.Cloud.run('validateBulkTransfer', { file: parseFile, businessId: this.businessId });
        }).then((res) => {
            const totalAmount = res.amount;
            const count = res.recipientsCount;
            this.ref = res.ref;

            this.confirm = `Please Confirm the Transfer of ${Util.getCurrency()} ${totalAmount} to ${count} recipients. Total charges including transfer charges is ${Util.getCurrency()} ${res.amountWithCharge}`;
        }).catch((e) => {

        }).then(() => {
            this.uploading = false;
        });
    },
    close () {
      this.$emit('done');
    },
    async transfer () {
      this.loading = true;
      try {
        this.completedMessage = await Parse.Cloud.run('bulkBankTransfer', { ref: this.ref, businessId: this.businessId });
      }
      catch (e) {
        this.loading = false;
        this.error = e.message;
      }
    }
  },

};
</script>