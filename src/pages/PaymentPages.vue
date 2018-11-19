<template>
  <div id="pageTable">
    <new-payment-page v-if="dialog" v-on:done="load"></new-payment-page>
    <v-btn color="success" @click="dialog = true" outline="">Create Payment Page</v-btn>

    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
          <v-divider></v-divider>
          <v-data-table
            :headers="headers"
            :items="pages"
            :loading="loading"
            hide-actions
            :search="search"
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <td>
                <v-tooltip v-if="props.item.active" bottom>
                  <v-icon slot="activator" color="green">check</v-icon>
                  <span>Active</span>
                </v-tooltip>
              </td>
              <td>{{ props.item.path }}</td>
              <td>{{ props.item.amount }}</td>
              <td>{{ props.item.desc }}</td>
            </template>
          </v-data-table>
        </v-flex>

      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Parse from 'parse';
import Util from '@/util';
import BulkTransfer from '@/components/BulkTransfer';
import FundAccount from '@/components/FundAccount';
import NewPaymentPage from '../components/NewPaymentPage';
export default {
  components: {
    NewPaymentPage,
    BulkTransfer,
    FundAccount
  },
  data () {
    return {
      pages: [],
      search: '',
      dialog: false,
      loading: true,
      headers: [
        {
          text: 'Status',
          sortable: false,
          value: 'status'
        }, {
          text: 'Path',
          sortable: false,
          value: 'path'
        },
        { text: 'Amount', value: 'amount', sortable: false, },
        { text: 'Description', value: 'desc', sortable: false, },
      ],

    };
  },
  mounted () {
    this.load();
  },
  methods: {
    async load () {
      this.dialog = false;
      const business = await Util.getCurrentBusiness();
      const pages = await business.getPaymentPages();
      pages.forEach((page) => {
        page.path = Parse.checkoutURL + page.get('path');
        page.amount = page.get('amount');
        page.desc = page.get('notes');
        page.active = page.get('active');
      });
      this.loading = false;
      this.pages = pages;
    }
  },
};
</script>
