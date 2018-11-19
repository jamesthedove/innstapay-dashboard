<template>
  <div id="pageTable">
    <new-transfer v-if="transferDialog" v-on:done="load"></new-transfer>
    <bulk-transfer v-if="bulkTransferDialog" v-on:done="load"></bulk-transfer>
    <fund-account v-if="fundAccountDialog" v-on:done="load"></fund-account>
    <v-btn color="success" @click="transferDialog = true" outline="">New Single Transfer</v-btn>
    <v-btn color="success" @click="bulkTransferDialog = true" outline="">New Bulk Transfer</v-btn>
    <v-btn color="success" @click="fundAccountDialog = true" outline="">Fund Account</v-btn>

    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
          <v-toolbar card color="white">
            <v-text-field
                    flat
                    solo
                    prepend-icon="search"
                    placeholder="Search Transfers"
                    v-model="search"
                    hide-details
                    class="hidden-sm-and-down"
            ></v-text-field>
            <v-btn icon>
              <v-icon>filter_list</v-icon>
            </v-btn>
          </v-toolbar>
          <v-divider></v-divider>
          <v-data-table
            :headers="headers"
            :items="transfers"
            :loading="loading"
            hide-actions
            :search="search"
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <td>
                <v-tooltip v-if="props.item.status === 'successful'" bottom>
                  <v-icon slot="activator" color="green">check</v-icon>
                  <span>Successful</span>
                </v-tooltip>
              </td>
              <td>{{ props.item.type }}</td>
              <td>{{ props.item.name }}</td>
              <td>{{ props.item.amount }}</td>
              <td>{{ props.item.date }}</td>
            </template>
          </v-data-table>
        </v-flex>

      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Parse from 'parse';
import moment from 'moment';
import Util from '@/util';
import { Items as Users } from '@/api/user';
import NewTransfer from '@/components/NewTransfer';
import BulkTransfer from '@/components/BulkTransfer';
import FundAccount from '@/components/FundAccount';
export default {
  components: {
    BulkTransfer,
    NewTransfer,
    FundAccount
  },
  data () {
    return {
      transfers: [],
      search: '',
      transferDialog: false,
      bulkTransferDialog: false,
      fundAccountDialog: false,
      loading: true,
      headers: [
        {
          text: 'Status',
          sortable: false,
          value: 'status'
        },
        { text: 'Type', value: 'type', sortable: false, },
        { text: 'Recipient(s)', value: 'name', sortable: false, },
        { text: 'Amount', value: 'amount', sortable: false, },
        { text: 'Date', value: 'date', sortable: false, },
      ],

    };
  },
  mounted () {
    this.load();
  },
  methods: {
    async load () {
      this.transferDialog = false;
      this.bulkTransferDialog = false;
      this.fundAccountDialog = false;
      const business = await Util.getCurrentBusiness();
      const transfers = await business.getBankTransfers();
      transfers.forEach((transfer) => {
        transfer.type = transfer.get('type');
        transfer.status = transfer.get('status');
        if (transfer.get('type') === 'single') {
          transfer.name = `${transfer.get('accountName')}, ${transfer.get('bank').get('name')}`;
        } else {
          transfer.name = `${transfer.get('bulkCount')} Recipients`;
        }

        const currency = transfer.get('currency') || 'NGN';
        transfer.amount = `${currency} ${transfer.get('amount')}`;

        transfer.date = moment(transfer.createdAt).format('dddd, MMMM Do YYYY, h:mm a');
      });
      this.loading = false;
      this.transfers = transfers;
    }
  },
};
</script>
